from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
# Create your views here.

class userDataModelViewSet(viewsets.ModelViewSet):
    queryset = user_data.objects.all()
    serializer_class = userDataSerializers
