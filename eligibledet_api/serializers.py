from rest_framework import serializers
from .models import *

class eligibilitySerializers(serializers.ModelSerializer):

      class Meta:
        model=eligibilityDetermination
        fields="__all__"