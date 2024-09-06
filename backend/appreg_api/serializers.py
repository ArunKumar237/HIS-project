from rest_framework import serializers
from .models import *

class appRegSerializers(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = appReg_Module