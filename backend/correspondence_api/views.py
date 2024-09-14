from django.shortcuts import render
from rest_framework import viewsets,status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import DjangoModelPermissions
# Create your views here.


class correspondance_modelView(ViewSet):
    def list(self,request):
        queryset = correspondance_module.objects.all()
        serializer = correspondanceModuleSerializers(queryset,many=True)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer = correspondanceModuleSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,pk=None):
        try:
            corAPI = correspondance_module.objects.get(pk = pk)
        except correspondance_module.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
    def update(self,request,pk=None):
        try:
            corAPI = correspondance_module.objects.get(pk=pk)
        except correspondance_module.DoesNotExist:
            return Response({'error':'Record Does Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = correspondanceModuleSerializers(corAPI,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self,request,pk=None):
        try:
            corAPI = correspondance_module.objects.get(pk=pk)
        except correspondance_module.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        corAPI.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


