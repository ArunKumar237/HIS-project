from django.shortcuts import render
from  rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import ViewSet
# Create your views here.
from rest_framework import viewsets,status
from .models import *
from  .serializers import *
from rest_framework.permissions import DjangoModelPermissions


class eligibilityModelViews(ViewSet):
    permission_classes = [DjangoModelPermissions]
    def list(self,request):
        queryset = eligibilityDetermination.objects.all()
        serializer = eligibilitySerializers(queryset,many=True)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer = eligibilitySerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,pk=None):
        try:
            eligibleDet = eligibilityDetermination.objects.get(pk = pk)
        except eligibilityDetermination.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        serializer = eligibilitySerializers(eligibleDet)
        return Response(serializer.data)
    def update(self,request,pk=None):
        try:
            eligibleDet = eligibilityDetermination.objects.get(pk=pk)
        except eligibilityDetermination.DoesNotExist:
            return Response({'error':'Record Does Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = eligibilitySerializers(eligibleDet,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self,request,pk=None):
        try:
            eligibleDet = eligibilityDetermination.objects.get(pk=pk)
        except eligibilityDetermination.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        eligibleDet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
