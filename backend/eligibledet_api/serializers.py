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
            'DENIAL_REASON',
            'EMAIL'
        ]
        read_only_fields = ['ELIG_ID']  # ELIG_ID is auto-generated, so it should be read-only

class EligibilityDeterminationSerializer(serializers.ModelSerializer):
    # Access related AppReg fields
    FULLNAME = serializers.CharField(source='app_reg.FULLNAME')
    EMAIL = serializers.CharField(source='app_reg.EMAIL')
    PHNO = serializers.IntegerField(source='app_reg.PHNO')
    GENDER = serializers.CharField(source='app_reg.GENDER')
    SSN = serializers.IntegerField(source='app_reg.SSN')

    class Meta:
        model = eligibilityDetermination
        fields = ['ELIG_ID', 'FULLNAME', 'EMAIL', 'PHNO', 'GENDER', 'SSN', 
                  'PLAN_NAME', 'PLAN_STATUS', 'PLAN_START_DATE', 'PLAN_END_DATE']

