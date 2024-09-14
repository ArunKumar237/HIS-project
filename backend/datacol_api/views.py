from django.shortcuts import render
from rest_framework import viewsets,status
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import DjangoModelPermissions

# # Create your views here.

class DcCasesModelViews(ViewSet):
    permission_classes = [DjangoModelPermissions]
    def list(self,request):
        queryset = DC_Cases.objects.all()
        serializer = DcCasesSerializer(queryset,many=True)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer = DcCasesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,pk=None):
        try:
            DcCase = DC_Cases.objects.get(pk = pk)
        except DC_Cases.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)

        serializer = DcCasesSerializer(DcCase)
        return Response(serializer.data)
    def update(self,request,pk=None):
        try:
            DcCase = DC_Cases.objects.get(pk=pk)
        except DC_Cases.DoesNotExist:
            return Response({'error':'Record Does Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = DcCasesSerializer(DcCase,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self,request,pk=None):
        try:
            DcCase = DC_Cases.objects.get(pk=pk)
        except DC_Cases.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        DcCase.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DcIncomeModelView(ViewSet):
    permission_classes = [DjangoModelPermissions]
    def list(self,request):
        queryset = DC_Income.objects.all()
        serializer = DcIncomeSerializers(queryset,many=True)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer = DcIncomeSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,pk=None):
        try:
            DcIncome = DC_Income.objects.get(pk = pk)
        except DC_Income.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)

        serializer = DcIncomeSerializers(DcIncome)
        return Response(serializer.data)
    def update(self,request,pk=None):
        try:
           DcIncome = DC_Income.objects.get(pk=pk)
        except DC_Income.DoesNotExist:
            return Response({'error':'Record Does Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = DcIncomeSerializers(DcIncome,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self,request,pk=None):
        try:
           DcIncome = DC_Income.objects.get(pk=pk)
        except DC_Income.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        DcIncome.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
   

class DcChildrensModelView(ViewSet):
    permission_classes = [DjangoModelPermissions]
    def list(self,request):
        queryset = DC_Childrens.objects.all()
        serializer = DcChildrensSerializers(queryset,many=True)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer = DcChildrensSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,pk=None):
        try:
            DcChildren = DC_Childrens.objects.get(pk = pk)
        except DC_Childrens.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)

        serializer = DcChildrensSerializers(DcChildren)
        return Response(serializer.data)
        
    def update(self,request,pk=None):
        try:
             DcChildren  = DC_Childrens.objects.get(pk=pk)
        except DC_Childrens.DoesNotExist:
            return Response({'error':'Record Does Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = DcChildrensSerializers( DcChildren ,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self,request,pk=None):
        try:
             DcChildren  = DC_Childrens.objects.get(pk=pk)
        except DC_Childrens.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        DcChildren.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class DcEducationsModelView(ViewSet):
    permission_classes = [DjangoModelPermissions]
    def list(self,request):
        queryset = DC_Education.objects.all()
        serializer = DcEducationsSerializers(queryset,many=True)
        return Response(serializer.data)
    def create(self,request,*args,**kwargs):
        serializer = DcEducationsSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self,request,pk=None):
        try:
           DcEducation = DC_Education.objects.get(pk = pk)
        except DC_Education.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)

        serializer = DcEducationsSerializers(DcEducation)
        return Response(serializer.data)
    def update(self,request,pk=None):
        try:
            DcEducation = DC_Education.objects.get(pk=pk)
        except DC_Education.DoesNotExist:
            return Response({'error':'Record Does Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = DcEducationsSerializers(DcEducation,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self,request,pk=None):
        try:
            DcEducation = DC_Education.objects.get(pk=pk)
        except DC_Education.DoesNotExist:
            return Response({'error':'Record Not Found'},status=status.HTTP_404_NOT_FOUND)
        
        DcEducation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

