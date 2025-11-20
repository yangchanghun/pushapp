from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .serializers import RegisterSerializer, UserSerializer


# 회원가입
class RegisterView(APIView):
    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        if ser.is_valid():
            user = ser.save()
            return Response({"message": "회원가입 완료!"}, status=201)
        return Response(ser.errors, status=400)


# 로그인 (TokenAuthentication 사용)
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "아이디와 비밀번호를 입력하세요."},
                            status=400)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "아이디 또는 비밀번호가 잘못되었습니다."},
                            status=401)

        # 🔥 토큰 발급
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "message": "로그인 성공",
            "token": token.key,
            "user": UserSerializer(user).data
        })


# 로그아웃
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.auth
        if token:
            token.delete()  # 토큰 삭제 = 로그아웃
        return Response({"message": "로그아웃 완료"})


# 관리자만 접근 가능
class MyPageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("현재 로그인 사용자:", request.user.is_staff)

        # 여기서 무조건 staff 정보 보내줘야 함
        return Response({
            "username": request.user.username,
            "is_staff": request.user.is_staff
        })
