from rest_framework import serializers
from .models import Visitors

class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visitors
        fields = "__all__"

class VisitorsSerializers(serializers.ModelSerializer):
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
            'professor',        # ✅ ForeignKey 필드 추가 (입력용)
            'professor_name',   # ✅ 출력용
        ]