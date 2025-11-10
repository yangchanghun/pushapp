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


class VisitorCreateView(APIView):
    def post(self, request):
        serializer = VisitorSerializer(data=request.data)
        if serializer.is_valid():
            visitor = serializer.save()

            # ✅ token 접근
            token = serializer.data["token"]

            # ✅ 출력 확인용 로그
            print(f"방문자 등록 완료: {visitor.name}")
            print(f"Token: {token}")
            print(f"Frontend URL: http://localhost:5173/acceptreject/{token}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
    except Visitors.DoesNotExist:
        return HttpResponse("❌ 잘못된 요청입니다.", status=400)

    if visitor.status != "대기":
        return HttpResponse("⚠️ 이미 처리된 요청입니다.", status=400)

    visitor.status = "수락"
    visitor.save()

    sender = visitor.professor.name if visitor.professor else "교수"
    message = f"{visitor.name} 방문을 수락했습니다."
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "room_1",
        {
            "type": "chat_message",
            "message": f"{sender}: {message}"
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
            "message": f"{sender}: {message}"
        }
    )

    return HttpResponse("❌ 방문이 거절되었습니다.")