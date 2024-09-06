from rest_framework import *
from .models import *
from rest_framework import serializers
from .models import *


class correspondanceModuleSerializers(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = correspondance_module