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

    def validate_CASE_NUM(self, value):
        if not AppReg.objects.filter(CASE_NUM=value.CASE_NUM).exists():
            raise serializers.ValidationError(f"CASE_NUM {value.CASE_NUM} does not exist.")
        return value

class CaseChildrenSerializer(serializers.Serializer):
    CASE_NUM = serializers.PrimaryKeyRelatedField(queryset=DC_Cases.objects.all())
    CHILDREN = DcChildrensSerializers(many=True)

    def create(self, validated_data):
        case_num = validated_data['CASE_NUM']
        children_data = validated_data['CHILDREN']

        # Iterate through the list of children and create records for each one
        for child in children_data:
            DC_Childrens.objects.create(
                CASE_NUM=case_num,
                CHILDREN_DOB=child['CHILDREN_DOB'],
                CHILDREN_SSN=child['CHILDREN_SSN']
            )

        return validated_data

class DcEducationsSerializers(serializers.ModelSerializer):
    class Meta:
        model = DC_Education
        fields = '__all__'