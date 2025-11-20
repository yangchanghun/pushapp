# views.py
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Professors
from .serializers import ProfessorsSerializer


from rest_framework.permissions import IsAdminUser

class ProfessorCreateView(APIView):
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