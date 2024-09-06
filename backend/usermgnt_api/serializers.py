from rest_framework import serializers
from .models import *

class userDataSerializers(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = user_data