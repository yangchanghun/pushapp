from rest_framework import serializers
from .models import Professors

class ProfessorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professors
        fields = "__all__"
