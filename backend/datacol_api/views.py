from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *

# # Create your views here.

class DcCasesModelViews(viewsets.ModelViewSet):
    queryset = DC_Cases.objects.all()
    serializer_class = DcCasesSerializer
    

class DcIncomeModelView(viewsets.ModelViewSet):
    queryset = DC_Income.objects.all()
    serializer_class = DcIncomeSerializers

