from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import DjangoModelPermissions
# Create your views here.

class userDataModelViewSet(viewsets.ModelViewSet):
    queryset = user_data.objects.all()
    serializer_class = userDataSerializers
    permission_classes = [DjangoModelPermissions]
