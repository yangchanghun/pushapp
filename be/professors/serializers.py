from rest_framework import serializers
from .models import Professors, LocationImage

class ProfessorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professors
        fields = "__all__"


class LocationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationImage
        fields = "__all__"
