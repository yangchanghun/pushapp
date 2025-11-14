from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse
# from .models import Visit
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Visitors
from .serializers import VisitorSerializer
from .serializers import VisitorsSerializers
from django.db.models import Q
from professors.models import Professors

class VisitorCreateView(APIView):
    def post(self, request):
        serializer = VisitorSerializer(data=request.data)
        if serializer.is_valid():
            visitor = serializer.save()
            professor_id = serializer.data['professor']
            professor_phonenumber = Professors.objects.get(id = professor_id).phonenumber
            # 위 폰넘버에다가 문자 보냄
            # http://localhost:5173/acceptreject/{token} 이거
            # ✅ token 접근
            token = serializer.data["token"]

            # ✅ 출력 확인용 로그
            print(f"방문자 등록 완료: {visitor.name}")
            print(f"Token: {token}")
            print(f"Frontend URL: http://localhost:5173/acceptreject/{token}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import generics
from .models import Visitors
from .serializers import VisitorSerializer
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class VisitorDetailView(generics.RetrieveAPIView):
    queryset = Visitors.objects.all()
    serializer_class = VisitorsSerializers
    lookup_field = "token"  # URL에서 token으로 조회 가능

    # 선택적으로 name으로도 조회 원할 때
    def get(self, request, *args, **kwargs):
        token = kwargs.get("token", None)
        name = kwargs.get("name", None)

        if token:
            visitor = get_object_or_404(Visitors, token=token)
        elif name:
            visitor = get_object_or_404(Visitors, name=name)
        else:
            return Response(
                {"error": "조회할 방문자 식별자가 없습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(visitor)
        return Response(serializer.data)



from rest_framework.decorators import api_view
from uuid import UUID
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Visitors


@api_view(["GET"])
def check_token_valid(request, token):
    # 1️⃣ UUID 형식 검증
    try:
        UUID(token)
    except ValueError:
        return Response({"valid": False, "message": "잘못된 요청입니다."}, status=400)

    # 2️⃣ DB 조회
    try:
        visitor = Visitors.objects.get(token=token)
    except Visitors.DoesNotExist:
        return Response({"valid": False, "message": "잘못된 요청입니다."}, status=400)

    # 3️⃣ 상태 확인
    if visitor.status != "대기":
        return Response(
            {"valid": False, "message": "이미 처리된 요청입니다."}, status=400
        )

    # 4️⃣ 정상일 때
    return Response({
        "valid": True,
        "visitor": {
            "name": visitor.name,
            "visit_purpose": visitor.visit_purpose,
            "professor": visitor.professor.name if visitor.professor else None
        }
    })




def accept_visit(request, token):
    try:
        visitor = Visitors.objects.get(token=token)
        print("안녕")
    except Visitors.DoesNotExist:
        return HttpResponse("❌ 잘못된 요청입니다.", status=400)

    if visitor.status != "대기":
        return HttpResponse("⚠️ 이미 처리된 요청입니다.", status=400)

    visitor.status = "수락"
    visitor.save()
    print(visitor.phonenumber)
    # visitor.phone_number을 가져와서
    # 여기다가도 원하면 문자 전송

    sender = visitor.professor.name if visitor.professor else "교수"
    message = f"{visitor.name} 방문을 수락했습니다."
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "room_1",
        {
            "type": "chat_message",
            "message": f"{sender}: {message}",
            "token": str(token),  # ✅ UUID → 문자열 변환
            "created_at": visitor.created_at.isoformat(),  # ⭐ 추가
        }
    )

    return HttpResponse("✅ 방문이 수락되었습니다.")


def reject_visit(request, token):
    try:
        visitor = Visitors.objects.get(token=token)
    except Visitors.DoesNotExist:
        return HttpResponse("❌ 잘못된 요청입니다.", status=400)

    if visitor.status != "대기":
        return HttpResponse("⚠️ 이미 처리된 요청입니다.", status=400)

    visitor.status = "거절"
    visitor.save()

    sender = visitor.professor.name if visitor.professor else "교수"
    message = f"{visitor.name} 방문을 거절했습니다."
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "room_1",
        {
            "type": "chat_message",
            "message": f"{sender}: {message}",
            "token": str(token),  # ✅ UUID → 문자열 변환
            "created_at": visitor.created_at.isoformat(),   # ⭐ 추가
        }
    )

    return HttpResponse("❌ 방문이 거절되었습니다.")





@api_view(["POST"])
def check_visit(request):
    token = request.data.get("token")
    try:
        visit = Visitors.objects.get(token=token)
        visit.is_checked = True
        visit.save()  # ✅ 반드시 저장
        return Response({"message": "경비원이 방문을 확인했습니다."})
    except Visitors.DoesNotExist:
        return Response({"error": "해당 방문자가 존재하지 않습니다."}, status=404)
    

@api_view(["GET"])
def checked_visit_list(request):
    """
    ✅ 교수가 수락 or 거절버튼을 누르고, 경비원이 확인한 방문자 목록
    """
    visits = Visitors.objects.filter(
        Q(is_checked=True),
        Q(status="수락") | Q(status="거절")
    )#.order_by("-created_at")

    serializer = VisitorsSerializers(visits, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def no_checked_visit_list(request):
    """
    🚫 교수가 수락 or 거절버튼을 누르고 , 경비원이 확인 하지 않은 방문자 목록
    """
    visits = Visitors.objects.filter(
        Q(is_checked=False),
        Q(status="수락") | Q(status = "거절")   # ✅ 교수가 응답함
    )#.order_by("-created_at")

    serializer = VisitorsSerializers(visits, many=True)
    return Response(serializer.data)

"""
[
  {
    "id": 12,
    "name": "홍길동",
    "phonenumber": "010-1234-5678",
    "visit_purpose": "면담 요청",
    "status": "수락",
    "is_checked": false,
    "token": "a1b2c3d4-...",
    "professor_name": "이승기",
    "created_at": "2025-11-12T01:20:00Z"
  }
]
"""