from django.shortcuts import render
from rest_framework import viewsets
from .serializers import  *



# Create your views here.

class appRegModuleModelViewSet(viewsets.ModelViewSet):
    queryset = appReg_Module.objects.all()
    serializer_class = appRegSerializers