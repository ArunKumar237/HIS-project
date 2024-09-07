from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import PlanCategory, PlanMaster, CaseWorkerAcct

class PlanCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=PlanCategory
        fields='__all__'
        
class PlanMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlanMaster
        fields='__all__'
        
class CaseWorkerAcctSerializer(serializers.ModelSerializer):
    class Meta:
        model=CaseWorkerAcct
        fields='__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Update the other model field (e.g., CaseWorkerAcct)
        try:
            caseworker = CaseWorkerAcct.objects.get(USERNAME=user)
            if caseworker.ACTIVE_SW:  # Check if the field needs to be updated
                caseworker.ACTIVE_SW = True  # Set the new value
                caseworker.save()
                user.is_staff = True
        except CaseWorkerAcct.DoesNotExist:
            pass  # Handle case if the record does not exist
        
        return token