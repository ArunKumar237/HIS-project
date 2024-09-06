from rest_framework import serializers
from .models import *

class DcCasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = DC_Cases
        fields = '__all__'
        

class DcIncomeSerializers(serializers.ModelSerializer):
    class Meta:
        model = DC_Income
        fields = '__all__'

class DcChildrensSerializers(serializers.ModelSerializer):
    class Meta:
        model = DC_Childrens
        fields = '__all__'
class DcEducationsSerializers(serializers.ModelSerializer):
    class Meta:
        model = DC_Education
        fields = '__all__'