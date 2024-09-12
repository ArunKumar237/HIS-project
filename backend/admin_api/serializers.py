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
            if (caseworker.ACTIVE_SW == False) and (user.is_staff == False):  # Check if the field needs to be updated
                if (caseworker.UPDATED_BY == 'admin'):
                    token['redirect_to_unlock'] = True  # Add a custom field to the token
                else:
                    token['redirect_to_unlock'] = False
            else:
                token['redirect_to_unlock'] = False
        except CaseWorkerAcct.DoesNotExist:
            token['redirect_to_unlock'] = False
        
        return token