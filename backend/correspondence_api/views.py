from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
# Create your views here.

class correspondance_modelView(viewsets.ModelViewSet):
    queryset = correspondance_module.objects.all()
    serializer_class = correspondanceModuleSerializers
