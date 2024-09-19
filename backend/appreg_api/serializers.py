# serializers.py

from rest_framework import serializers
from .models import AppReg

class AppRegSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppReg
        fields = '__all__'
