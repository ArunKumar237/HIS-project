from rest_framework import serializers
from .models import PlanCategory, PlanMaster

class PlanCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=PlanCategory
        fields='__all__'
        
class PlanMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlanMaster
        fields='__all__'