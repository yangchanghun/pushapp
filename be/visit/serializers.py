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
            'professor',
            'professor_name',
            'birthdate',
            'car_number',
            'company_name',
        ]
