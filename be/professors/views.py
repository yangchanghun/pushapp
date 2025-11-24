# views.py
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Professors
from .serializers import ProfessorsSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework.permissions import IsAdminUser
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