from django.shortcuts import render
from rest_framework.viewsets import ViewSet
from .serializers import  *
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.response import Response
from rest_framework import status



# Create your views here.

class appRegModuleModelViewSet(ViewSet):
    def list(self,request):
        queryset = appReg_Module.objects.all()
        serializer = appRegSerializers(queryset,many=True)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer = appRegSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,pk=None):
        try:
            appReg = appReg_Module.objects.get(pk = pk)
        except appReg_Module.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
    def update(self,request,pk=None):
        try:
            appReg = appReg_Module.objects.get(pk=pk)
        except appReg_Module.DoesNotExist:
            return Response({'error':'Record Does Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = appRegSerializers(appReg,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self,request,pk=None):
        try:
            appReg = appReg_Module.objects.get(pk=pk)
        except appReg_Module.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        appReg.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
