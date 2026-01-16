# views.py
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Professors
from .serializers import ProfessorsSerializer,LocationImageSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAdminUser,AllowAny
from rest_framework.authentication import TokenAuthentication
@method_decorator(csrf_exempt, name='dispatch')
class ProfessorCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]   # ← STAFF 권한만 접근 허용!
    def post(self, request):

        serializer = ProfessorsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
from rest_framework import generics
from rest_framework.filters import SearchFilter
from .models import Professors
from .serializers import ProfessorsSerializer

class ProfessorListView(generics.ListAPIView):
    queryset = Professors.objects.all().order_by('id')
    serializer_class = ProfessorsSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']  # 🔍 교수 이름 검색 가능


class ProfessorDetailView(generics.RetrieveAPIView):
    queryset = Professors.objects.all()
    serializer_class = ProfessorsSerializer
    lookup_field = "id"

class ProfessorUpdateView(generics.UpdateAPIView):
    queryset = Professors.objects.all()
    serializer_class = ProfessorsSerializer
    lookup_field = "id"


class ProfessorDeleteView(generics.DestroyAPIView):
    queryset = Professors.objects.all()
    serializer_class = ProfessorsSerializer
    lookup_field = "id"

class LocationImageCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LocationImageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

import pandas as pd
from .models import Professors, LocationImage

def import_professors_from_excel(file):
    df = pd.read_excel(file)

    for _, row in df.iterrows():
        professor = Professors.objects.create(
            name=row.get("name", ""),
            phonenumber=row.get("phonenumber", ""),
            location=row.get("location", ""),
            department=row.get("department", ""),
            class_level=row.get("class","")
        )

        if pd.notna(row.get("location_img")):
            loc_img = LocationImage.objects.filter(
                code=row["location_img"]
            ).first()

            if loc_img:
                # 🔥 핵심: ImageField에 경로 문자열 복사
                professor.location_gif.name = loc_img.image.name
                professor.save()



class ProfessorExcelUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"detail": "엑셀 파일이 필요합니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        import_professors_from_excel(file)

        return Response(
            {"detail": "엑셀 업로드 완료"},
            status=status.HTTP_201_CREATED
        )
    
class LocationImageListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = LocationImage.objects.all().order_by("code")
        serializer = LocationImageSerializer(qs, many=True)
        return Response(serializer.data)