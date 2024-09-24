from rest_framework import serializers
from .models import eligibilityDetermination, AppReg

class eligibilitySerializers(serializers.ModelSerializer):
    class Meta:
        model = eligibilityDetermination
        fields = [
            'ELIG_ID', 
            'CASE_NUM', 
            'PLAN_NAME', 
            'PLAN_STATUS', 
            'PLAN_START_DATE', 
            'PLAN_END_DATE', 
            'BENEFIT_AMT', 
            'DENIAL_REASON'
        ]
        read_only_fields = ['ELIG_ID']  # ELIG_ID is auto-generated, so it should be read-only

class EligibilityDeterminationSerializer(serializers.ModelSerializer):
    # Access related AppReg fields
    FULLNAME = serializers.CharField(source='EMAIL.FULLNAME')
    EMAIL = serializers.CharField(source='EMAIL.EMAIL')
    PHNO = serializers.IntegerField(source='EMAIL.PHNO')
    GENDER = serializers.CharField(source='EMAIL.GENDER')
    SSN = serializers.IntegerField(source='EMAIL.SSN')

    class Meta:
        model = eligibilityDetermination
        fields = ['ELIG_ID', 'FULLNAME', 'EMAIL', 'PHNO', 'GENDER', 'SSN', 'PLAN_NAME', 'PLAN_STATUS', 'PLAN_START_DATE', 'PLAN_END_DATE']
