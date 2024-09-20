from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import DjangoModelPermissions
from .models import eligibilityDetermination
from datacol_api.models import DC_Cases, DC_Income, DC_Childrens, DC_Education
from .serializers import eligibilitySerializers
from appreg_api.models import AppReg

class eligibilityModelViews(ViewSet):
    permission_classes = [DjangoModelPermissions]

    def get_queryset(self):
        return eligibilityDetermination.objects.all()

    def list(self, request):
        queryset = eligibilityDetermination.objects.all()
        serializer = eligibilitySerializers(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # Check if the request data is empty, indicating a check eligibility process
        if not request.data:
            try:
                # Fetch the latest case based on CASE_NUM
                latest_case = DC_Cases.objects.latest('CASE_NUM')

                # Fetch related income, children, and education records
                income = DC_Income.objects.filter(CASE_NUM=latest_case.CASE_NUM).first()
                childrens = DC_Childrens.objects.filter(CASE_NUM=latest_case.CASE_NUM)
                education = DC_Education.objects.filter(CASE_NUM=latest_case.CASE_NUM).first()

                current_date = datetime.now().date()

                # Check for SNAP eligibility
                if latest_case.PLAN_NAME.PLAN_NAME == 'SNAP':
                    if income.EMP_INCOME <= 2000 and income.PROPERTY_INCOME <= 14580:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'SNAP',
                            'PLAN_STATUS': 'Approved',
                            'PLAN_START_DATE': current_date,
                            'PLAN_END_DATE': current_date + timedelta(days=365),
                            'BENEFIT_AMT': 200,  # Example benefit amount
                            'DENIAL_REASON': None
                        })
                    else:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'SNAP',
                            'PLAN_STATUS': 'Denied',
                            'PLAN_START_DATE': None,
                            'PLAN_END_DATE': None,
                            'BENEFIT_AMT': 0,
                            'DENIAL_REASON': 'Income or property income criteria not met for SNAP'
                        })
                    if serializer.is_valid():
                        serializer.save()

                # Check for CCAP eligibility
                if latest_case.PLAN_NAME.PLAN_NAME == 'CCAP':
                    if income and childrens.exists():
                        total_allowed_income = 30000 + (len(childrens) - 1) * 3333
                        child_under_18 = all(
                            (datetime.now().date() - child.CHILDREN_DOB).days / 365.25 < 18
                            for child in childrens
                        )
                        if child_under_18 and income.PROPERTY_INCOME < total_allowed_income:
                            serializer = eligibilitySerializers(data={
                                'CASE_NUM': latest_case.CASE_NUM,
                                'PLAN_NAME': 'CCAP',
                                'PLAN_STATUS': 'Approved',
                                'PLAN_START_DATE': current_date,
                                'PLAN_END_DATE': current_date + timedelta(days=365),
                                'BENEFIT_AMT': 300,  # Example benefit amount
                                'DENIAL_REASON': None
                            })
                        else:
                            serializer = eligibilitySerializers(data={
                                'CASE_NUM': latest_case.CASE_NUM,
                                'PLAN_NAME': 'CCAP',
                                'PLAN_STATUS': 'Denied',
                                'PLAN_START_DATE': None,
                                'PLAN_END_DATE': None,
                                'BENEFIT_AMT': 0,
                                'DENIAL_REASON': 'Child age or property income criteria not met for CCAP'
                            })
                        if serializer.is_valid():
                            serializer.save()

                # Check for Medicare eligibility
                if latest_case.PLAN_NAME.PLAN_NAME == 'Medicare':
                    if income and income.EMP_INCOME <= 2000 and income.PROPERTY_INCOME <= 14580:
                        citizen_dob = AppReg.objects.get(APP_ID=latest_case.APP_ID).DOB
                        age = (datetime.now().date() - citizen_dob).days / 365.25
                        if age > 60:
                            serializer = eligibilitySerializers(data={
                                'CASE_NUM': latest_case.CASE_NUM,
                                'PLAN_NAME': 'Medicare',
                                'PLAN_STATUS': 'Approved',
                                'PLAN_START_DATE': current_date,
                                'PLAN_END_DATE': current_date + timedelta(days=365),
                                'BENEFIT_AMT': 500,  # Example benefit amount
                                'DENIAL_REASON': None
                            })
                        else:
                            serializer = eligibilitySerializers(data={
                                'CASE_NUM': latest_case.CASE_NUM,
                                'PLAN_NAME': 'Medicare',
                                'PLAN_STATUS': 'Rejected',
                                'PLAN_START_DATE': current_date,
                                'PLAN_END_DATE': current_date + timedelta(days=365),
                                'BENEFIT_AMT': 0,
                                'DENIAL_REASON': 'Age is less than 60'
                            })
                        if serializer.is_valid():
                            serializer.save()

                # Check for NJW eligibility
                if latest_case.PLAN_NAME.PLAN_NAME == 'NJW':
                    if education and 'B.E' in education.HIGHEST_QUALIFICATION:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'NJW',
                            'PLAN_STATUS': 'Approved',
                            'PLAN_START_DATE': current_date,
                            'PLAN_END_DATE': current_date + timedelta(days=365),
                            'BENEFIT_AMT': 400,  # Example benefit amount
                            'DENIAL_REASON': None
                        })
                    else:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'NJW',
                            'PLAN_STATUS': 'Denied',
                            'PLAN_START_DATE': None,
                            'PLAN_END_DATE': None,
                            'BENEFIT_AMT': 0,
                            'DENIAL_REASON': 'Qualification not "B.E" for NJW'
                        })
                    if serializer.is_valid():
                        serializer.save()

                return Response({"message": "Eligibility check completed and saved successfully."}, status=status.HTTP_201_CREATED)

            except DC_Cases.DoesNotExist:
                return Response({'error': 'No cases found'}, status=status.HTTP_404_NOT_FOUND)

        # If data is provided in the request, fallback to the standard create process
        serializer = eligibilitySerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def retrieve(self, request, pk=None):
        try:
            eligibleDet = eligibilityDetermination.objects.get(pk=pk)
        except eligibilityDetermination.DoesNotExist:
            return Response({'error': 'Record Not Found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = eligibilitySerializers(eligibleDet)
        return Response(serializer.data)
        
    def update(self, request, pk=None):
        try:
            eligibleDet = eligibilityDetermination.objects.get(pk=pk)
        except eligibilityDetermination.DoesNotExist:
            return Response({'error': 'Record Does Not Found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = eligibilitySerializers(eligibleDet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, pk=None):
        try:
            eligibleDet = eligibilityDetermination.objects.get(pk=pk)
        except eligibilityDetermination.DoesNotExist:
            return Response({'error': 'Record Not Found'}, status=status.HTTP_404_NOT_FOUND)
        
        eligibleDet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
