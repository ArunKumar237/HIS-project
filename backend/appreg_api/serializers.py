# serializers.py

from rest_framework import serializers
from .models import AppReg

def newjerseyOnly(value):
    print('new jersey validation')
    if value.lower().replace(' ','') != 'newjersey':
        raise serializers.ValidationError('state name should be "New Jersey"')

class AppRegSerializer(serializers.ModelSerializer):
    STATE_NAME = serializers.CharField(validators=[newjerseyOnly])
    class Meta:
        model = AppReg
        fields = '__all__'
