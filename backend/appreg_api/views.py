from django.shortcuts import render
from rest_framework import viewsets
from .serializers import  *
from rest_framework.permissions import DjangoModelPermissions



# Create your views here.

class appRegModuleModelViewSet(viewsets.ModelViewSet):
    queryset = appReg_Module.objects.all()
    serializer_class = appRegSerializers
    permission_classes=[DjangoModelPermissions,]
