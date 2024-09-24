from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import *
from admin_api.serializers import PlanMasterSerializer
from .models import *

@api_view(['GET'])
def get_latest_case(request):
    latest_case = DC_Cases.objects.order_by('-CASE_ID').first()  # Ordering by descending to get the latest
    if latest_case:
        serializer = DcCasesSerializer(latest_case)
        return Response({
            'CASE_ID': serializer.data['CASE_ID'],
            'CASE_NUM': serializer.data['CASE_NUM'],
            'PLAN_ID':serializer.data['PLAN_NAME']
        })
    return Response({'CASE_ID': None, 'CASE_NUM': None}, status=404)


@api_view(['GET'])
def get_plan_names(request):
    plans = PlanMaster.objects.all()
    serializer = PlanMasterSerializer(plans, many=True)  # `many=True` for a queryset
    return Response(serializer.data)

class DcCasesModelViews(viewsets.ViewSet):
    def get_queryset(self):
        return DC_Cases.objects.all()
    
    def list(self, request):
        queryset = DC_Cases.objects.all()
        serializer = DcCasesSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        serializer = DcCasesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        case = get_object_or_404(DC_Cases, pk=pk)
        serializer = DcCasesSerializer(case)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        case = get_object_or_404(DC_Cases, pk=pk)
        serializer = DcCasesSerializer(case, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        case = get_object_or_404(DC_Cases, pk=pk)
        case.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, pk=None):
        case = get_object_or_404(DC_Cases, pk=pk)
        serializer = DcCasesSerializer(case, data=request.data, partial=True)  # partial=True allows partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DcIncomeModelView(viewsets.ViewSet):
    
    def get_queryset(self):
        return DC_Cases.objects.all()
    
    def list(self, request):
        queryset = DC_Income.objects.all()
        serializer = DcIncomeSerializers(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        serializer = DcIncomeSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        income = get_object_or_404(DC_Income, pk=pk)
        serializer = DcIncomeSerializers(income)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        income = get_object_or_404(DC_Income, pk=pk)
        serializer = DcIncomeSerializers(income, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        income = get_object_or_404(DC_Income, pk=pk)
        serializer = DcIncomeSerializers(income, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        income = get_object_or_404(DC_Income, pk=pk)
        income.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DcChildrensModelView(viewsets.ViewSet):

    def get_queryset(self):
        return DC_Cases.objects.all()
    
    def list(self, request):
        queryset = DC_Childrens.objects.all()
        serializer = DcChildrensSerializers(queryset, many=True)
        return Response(serializer.data)
    
    # def create(self, request, *args, **kwargs):
    #     serializer = CaseChildrenSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def create(self, request):
        case_num = request.data.get('CASE_NUM')
        children_data = request.data.get('CHILDREN', [])

        try:
            case = AppReg.objects.get(CASE_NUM=case_num)
        except AppReg.DoesNotExist:
            return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)

        # Validate and create children records
        serializer = DcChildrensSerializers(data=children_data, many=True)
        if serializer.is_valid():
            for child in serializer.validated_data:
                DC_Childrens.objects.create(
                    CASE_NUM=case,
                    CHILDREN_DOB=child['CHILDREN_DOB'],
                    CHILDREN_SSN=child['CHILDREN_SSN']
                )
            return Response({'message': 'Data saved successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        child = get_object_or_404(DC_Childrens, pk=pk)
        serializer = DcChildrensSerializers(child)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        child = get_object_or_404(DC_Childrens, pk=pk)
        serializer = DcChildrensSerializers(child, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        child = get_object_or_404(DC_Childrens, pk=pk)
        serializer = DcChildrensSerializers(child, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        child = get_object_or_404(DC_Childrens, pk=pk)
        child.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DcEducationsModelView(viewsets.ViewSet):
    
    def get_queryset(self):
        return DC_Cases.objects.all()

    def list(self, request):
        queryset = DC_Education.objects.all()
        serializer = DcEducationsSerializers(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        serializer = DcEducationsSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        education = get_object_or_404(DC_Education, pk=pk)
        serializer = DcEducationsSerializers(education)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        education = get_object_or_404(DC_Education, pk=pk)
        serializer = DcEducationsSerializers(education, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        education = get_object_or_404(DC_Education, pk=pk)
        serializer = DcEducationsSerializers(education, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        education = get_object_or_404(DC_Education, pk=pk)
        education.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
