from django.shortcuts import render
from  rest_framework.response import Response
from rest_framework.decorators import api_view
# Create your views here.
from rest_framework import viewsets
from .models import *
from  .serializers import *
from rest_framework.permissions import DjangoModelPermissions


class eligibilityModelViews(viewsets.ModelViewSet):
      queryset=eligibilityDetermination.objects.all()
      serializer_class=eligibilitySerializers
      permission_classes=[DjangoModelPermissions,]
