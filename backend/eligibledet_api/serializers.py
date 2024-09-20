from rest_framework import serializers
from .models import eligibilityDetermination

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
