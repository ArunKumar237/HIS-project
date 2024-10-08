from datetime import datetime, timedelta
from django.core.mail import EmailMessage
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, filters
from .models import eligibilityDetermination
from datacol_api.models import DC_Cases, DC_Income, DC_Childrens, DC_Education
from .serializers import eligibilitySerializers, EligibilityDeterminationSerializer
from appreg_api.models import AppReg
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from correspondence_api.models import correspondance_module
from .filters import EligibilityDeterminationFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Sum, Min, Max
import os
import environ

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

class eligibilityModelViews(viewsets.ViewSet):

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
                print('Latest case num --------->', latest_case.CASE_NUM.CASE_NUM)
                user_mail = AppReg.objects.get(CASE_NUM=latest_case.CASE_NUM.CASE_NUM).EMAIL
                print(f"User mail ---------------------------> : {user_mail}")

                # Fetch related income, children, and education records
                income = DC_Income.objects.filter(CASE_NUM=latest_case.CASE_NUM).first()
                childrens = DC_Childrens.objects.filter(CASE_NUM=latest_case.CASE_NUM)
                education = DC_Education.objects.filter(CASE_NUM=latest_case.CASE_NUM).first()

                # Debugging logs to check fetched data
                if not income:
                    print(f"No income data found for CASE_NUM: {latest_case.CASE_NUM}")
                if not childrens.exists():
                    print(f"No children data found for CASE_NUM: {latest_case.CASE_NUM}")
                if not education:
                    print(f"No education data found for CASE_NUM: {latest_case.CASE_NUM}")

                current_date = datetime.now().date()

                # Helper function to handle serializer saving and error logging
                def save_serializer(serializer):
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        # Log the errors if validation fails
                        print(f"Serializer errors: {serializer.errors}")

                # Check for SNAP eligibility
                if latest_case.PLAN_NAME.PLAN_NAME == 'SNAP':
                    print('---------****************----------',latest_case.CASE_NUM.CASE_NUM)
                    if income and income.EMP_INCOME <= 2000 and income.PROPERTY_INCOME <= 14580:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'SNAP',
                            'PLAN_STATUS': 'Approved',
                            'PLAN_START_DATE': current_date,
                            'PLAN_END_DATE': current_date + timedelta(days=365),
                            'BENEFIT_AMT': 200,  # Example benefit amount
                            'DENIAL_REASON': None,
                            'EMAIL':user_mail
                        })
                    else:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'SNAP',
                            'PLAN_STATUS': 'Rejected',
                            'PLAN_START_DATE': current_date,
                            'PLAN_END_DATE': current_date + timedelta(days=365),
                            'BENEFIT_AMT': 0,
                            'DENIAL_REASON': 'Income or property income criteria not met for SNAP',
                            'EMAIL':user_mail
                        })
                    save_serializer(serializer)

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
                                'DENIAL_REASON': None,
                                'EMAIL':user_mail
                            })
                        else:
                            serializer = eligibilitySerializers(data={
                                'CASE_NUM': latest_case.CASE_NUM,
                                'PLAN_NAME': 'CCAP',
                                'PLAN_STATUS': 'Rejected',
                                'PLAN_START_DATE': current_date,
                                'PLAN_END_DATE': current_date + timedelta(days=365),
                                'BENEFIT_AMT': 0,
                                'DENIAL_REASON': 'Child age or property income criteria not met for CCAP',
                                'EMAIL':user_mail
                            })
                        save_serializer(serializer)

                # Check for Medicare eligibility
                if latest_case.PLAN_NAME.PLAN_NAME == 'Medicare':
                    print('I am in Medicare, plan name', latest_case.PLAN_NAME.PLAN_NAME)
                    print('income:',income, 'income.EMP_INCOME:',income.EMP_INCOME <= 2000, 'income.PROPERTY_INCOME', income.PROPERTY_INCOME)
                    if income and income.EMP_INCOME <= 2000 and income.PROPERTY_INCOME <= 14580:
                        print('matched------->')
                        try:
                            citizen_dob = AppReg.objects.get(APP_ID=latest_case.APP_ID).DOB
                        except AppReg.DoesNotExist:
                            print(f"No registration data found for APP_ID: {latest_case.APP_ID}")
                            return Response({'error': 'No registration data found'}, status=status.HTTP_404_NOT_FOUND)

                        age = (datetime.now().date() - citizen_dob).days / 365.25
                        if age > 60:
                            serializer = eligibilitySerializers(data={
                                'CASE_NUM': latest_case.CASE_NUM,
                                'PLAN_NAME': 'Medicare',
                                'PLAN_STATUS': 'Approved',
                                'PLAN_START_DATE': current_date,
                                'PLAN_END_DATE': current_date + timedelta(days=365),
                                'BENEFIT_AMT': 500,  # Example benefit amount
                                'DENIAL_REASON': None,
                                'EMAIL':user_mail
                            })
                        else:
                            serializer = eligibilitySerializers(data={
                                'CASE_NUM': latest_case.CASE_NUM,
                                'PLAN_NAME': 'Medicare',
                                'PLAN_STATUS': 'Rejected',
                                'PLAN_START_DATE': current_date,
                                'PLAN_END_DATE': current_date + timedelta(days=365),
                                'BENEFIT_AMT': 0,
                                'DENIAL_REASON': 'Age is less than 60',
                                'EMAIL':user_mail
                            })
                    else:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'Medicare',
                            'PLAN_STATUS': 'Rejected',
                            'PLAN_START_DATE': current_date,
                            'PLAN_END_DATE': current_date + timedelta(days=365),
                            'BENEFIT_AMT': 0,
                            'DENIAL_REASON': 'Income or property income criteria not met for Medicare',
                                'EMAIL':user_mail
                        })
                        save_serializer(serializer)

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
                            'DENIAL_REASON': None,
                            'EMAIL':user_mail
                        })
                    else:
                        serializer = eligibilitySerializers(data={
                            'CASE_NUM': latest_case.CASE_NUM,
                            'PLAN_NAME': 'NJW',
                            'PLAN_STATUS': 'Denied',
                            'PLAN_START_DATE': None,
                            'PLAN_END_DATE': None,
                            'BENEFIT_AMT': 0,
                            'DENIAL_REASON': 'Qualification not "B.E" for NJW',
                            'EMAIL':user_mail
                        })
                    save_serializer(serializer)

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


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = eligibilityDetermination.objects.all()
    serializer_class = eligibilitySerializers
    filter_backends = [filters.SearchFilter]
    search_fields = ['BENEFIT_AMT', 'CASE_NUM', 'DENIAL_REASON', 'PLAN_END_DATE', 'PLAN_NAME', 'PLAN_START_DATE', 'PLAN_STATUS']  # Specify the fields you want to search

class PendingNoticeViewSet(viewsets.ModelViewSet):
    serializer_class = eligibilitySerializers
    filter_backends = [filters.SearchFilter]
    parser_classes = [MultiPartParser, FormParser]
    search_fields = ['BENEFIT_AMT', 'CASE_NUM', 'DENIAL_REASON', 'PLAN_END_DATE', 'PLAN_NAME', 'PLAN_START_DATE', 'PLAN_STATUS']

    def get_queryset(self):
        return eligibilityDetermination.objects.filter(MAIL_SENT=False)

    def send_email_to_citizen(self, notice, pdf_file):
        print("""Function to send an email with a PDF attachment.""")
        try:
            subject = f"Notice for Insurance Plan: {notice.PLAN_NAME}"
            body = (
                f"Dear Citizen,\n\n"
                f"Please find attached the notice for your insurance plan: {notice.PLAN_NAME}.\n\n"
                f"Best regards,\nInsurance Team"
            )
            to_email = notice.EMAIL
            print('to_email:', to_email)

            # Create the email message
            email = EmailMessage(subject, body, env('EMAIL_HOST_USER'), [to_email])

            pdf_file.seek(0)
            email.attach(pdf_file.name, pdf_file.read(), pdf_file.content_type)

            # Send the email
            email.send(fail_silently=False)
            print("Email sent successfully.")
            return True  # Indicate success
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False  # Indicate failure

    @action(detail=True, methods=['post'])
    def send_notice(self, request, *args, **kwargs):
        print(request.data)

        # Get the notice object (you might need to fetch it based on ELIG_ID or another identifier)
        notice_id = kwargs.get('pk')  # Assuming you're using the pk from the URL
        try:
            notice = eligibilityDetermination.objects.get(pk=notice_id)
        except eligibilityDetermination.DoesNotExist:
            return Response({'error': 'Notice not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the PDF is in the request data
        pdf_file = request.FILES.get('pdf')
        if not pdf_file or pdf_file.size == 0:
            return Response({'error': 'PDF file not provided'}, status=status.HTTP_400_BAD_REQUEST)

        pdf_content = pdf_file.read()
        # Save the PDF to the correspondance_module
        correspondance_record = correspondance_module.objects.create(
            CASE_NUM=notice.CASE_NUM,
            NOTICE=pdf_content  # Assuming NOTICE_FILE is the field for storing the PDF
        )

        # Send the email with the PDF
        email_sent = self.send_email_to_citizen(notice, pdf_file)

        # Check if email was sent successfully
        if email_sent:
            # Update the MAIL_SENT status
            notice.MAIL_SENT = True
            notice.save()
            return Response({"message": "Mail sent successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Failed to send email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HistoryNoticeViewSet(viewsets.ModelViewSet):
    queryset = eligibilityDetermination.objects.filter(MAIL_SENT=True)
    serializer_class = eligibilitySerializers
    filter_backends = [filters.SearchFilter]
    search_fields = ['BENEFIT_AMT', 'CASE_NUM', 'DENIAL_REASON', 'PLAN_END_DATE', 'PLAN_NAME', 'PLAN_START_DATE', 'PLAN_STATUS']  # Specify the fields you want to search


class EligibilityFilterViewSet(viewsets.ModelViewSet):
    queryset = eligibilityDetermination.objects.all()
    serializer_class = EligibilityDeterminationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = EligibilityDeterminationFilter
    search_fields = ['PLAN_NAME', 'PLAN_STATUS', 'app_reg__GENDER', 'PLAN_START_DATE', 'PLAN_END_DATE']



    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        # Count total plans
        total_plans = eligibilityDetermination.objects.count()

        # Count approved plans
        total_approved = eligibilityDetermination.objects.filter(PLAN_STATUS='Approved').count()

        # Count denied plans
        total_denied = eligibilityDetermination.objects.filter(PLAN_STATUS='Rejected').count()

        # Sum of benefit amounts
        total_benefit = eligibilityDetermination.objects.aggregate(total_benefit=Sum('BENEFIT_AMT'))['total_benefit'] or 0

        # Get first and last date (PLAN_START_DATE)
        first_date = eligibilityDetermination.objects.aggregate(first_date=Min('PLAN_START_DATE'))['first_date']
        last_date = eligibilityDetermination.objects.aggregate(last_date=Max('PLAN_END_DATE'))['last_date']
        
        # Format dates to "Month Year" format
        first_date_formatted = first_date.strftime('%b %Y') if first_date else None
        last_date_formatted = last_date.strftime('%b %Y') if last_date else None

        # Prepare the response data
        data = {
            'total_plans': total_plans,
            'total_approved': total_approved,
            'total_denied': total_denied,
            'total_benefit': total_benefit,
            'first_date': first_date_formatted,
            'last_date': last_date_formatted,
        }

        # Return as a DRF Response
        return Response(data)