from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *
from rest_framework.permissions import DjangoModelPermissions

# # Create your views here.

class DcCasesModelViews(viewsets.ModelViewSet):
    queryset = DC_Cases.objects.all()
    serializer_class = DcCasesSerializer
    permission_classes = [DjangoModelPermissions]

class DcIncomeModelView(viewsets.ModelViewSet):
    queryset = DC_Income.objects.all()
    serializer_class = DcIncomeSerializers
    permission_classes = [DjangoModelPermissions]

class DcChildrensModelView(viewsets.ModelViewSet):
    queryset = DC_Childrens.objects.all()
    serializer_class = DcChildrensSerializers
    permission_classes = [DjangoModelPermissions]
    
class DcEducationsModelView(viewsets.ModelViewSet):
    queryset = DC_Education.objects.all()
    serializer_class = DcEducationsSerializers
    permission_classes = [DjangoModelPermissions]

