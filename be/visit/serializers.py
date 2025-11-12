from rest_framework import serializers
from .models import Visitors

class VisitorsSerializer(serializers.ModelSerializer):
    professor_name = serializers.CharField(source='professor.name', read_only=True)

    class Meta:
        model = Visitors
        fields = [
            'id',
            'name',
            'phonenumber',
            'visit_purpose',
            'status',
            'created_at',
            'is_checked',
            'token',
            'professor_name',   # ✅ 교수 이름 필드 추가
        ]