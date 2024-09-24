from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import correspondance_module
from eligibledet_api.models import eligibilityDetermination
from appreg_api.models import AppReg
from .serializers import correspondanceModuleSerializers
from rest_framework.viewsets import ViewSet
from io import BytesIO
from xhtml2pdf import pisa
from django.template.loader import get_template
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.core.files.base import ContentFile

import os
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

class CorrespondanceModelView(ViewSet):
    def get_queryset(self):
        return correspondance_module.objects.all()

    def list(self, request):
        queryset = self.get_queryset()
        serializer = correspondanceModuleSerializers(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = correspondanceModuleSerializers(data=request.data)
        if serializer.is_valid():
            case_num = request.data.get('CASE_NUM')

            # Fetch the related eligibility details
            eligibility = eligibilityDetermination.objects.filter(CASE_NUM=case_num).first()
            if not eligibility:
                return Response({'error': 'Eligibility details not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Generate the PDF
            pdf_content = self.generate_pdf(eligibility)
            
            if pdf_content:
                file_name = f"Notice_{case_num}.pdf"
                content_file = ContentFile(pdf_content, name=file_name)
                
                # Save the correspondence module with the generated PDF
                correspondence_instance = correspondance_module(
                    CASE_NUM=case_num,
                    NOTICE=content_file
                )
                correspondence_instance.save()

                # Send email and capture result
                email_status = self.send_email(pdf_content, eligibility)
                
                return Response({
                    'message': 'Notice created and email sent successfully!' if email_status else 'Notice created but failed to send email.',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)

            return Response({'error': 'Failed to generate PDF.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def generate_pdf(self, eligibility):
        """Generate a PDF with eligibility details."""
        try:
            template = get_template('pdf_template.html')
            html = template.render({'eligibility': eligibility})
            pdf_buffer = BytesIO()
            pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), pdf_buffer)

            if not pdf.err:
                pdf_buffer.seek(0)
                return pdf_buffer.read()
            else:
                print(f"PDF generation error: {pdf.err}")  # Log the error details
        except Exception as e:
            print(f"PDF generation error: {e}")

        return None


    def send_email(self, pdf_content, eligibility):
        """Send an email with the generated PDF."""
        try:
            app_reg = AppReg.objects.get(CASE_NUM=eligibility.CASE_NUM)
            user_email = app_reg.EMAIL  # Adjust based on your actual model structure
            email = EmailMessage(
                subject=f'Notice for {eligibility.PLAN_NAME}',
                body='Please find attached the notice for your plan.',
                from_email=env('EMAIL_HOST_USER'),
                to=[user_email]
            )
            email.attach(f'Notice_{eligibility.CASE_NUM}.pdf', pdf_content, 'application/pdf')
            email.send(fail_silently=False)  # You can manage error handling here
            return True  # Indicate success
        except Exception as e:
            print(f"Error sending email: {e}")
            return False  # Indicate failure

    def retrieve(self, request, pk=None):
        eligibility = self.get_eligibility_data(case_num=pk)
        if not eligibility:
            return Response({'detail': 'Eligibility data not found.'}, status=status.HTTP_404_NOT_FOUND)

        pdf_content = self.generate_pdf(eligibility)
        if pdf_content:
            response = HttpResponse(pdf_content, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="notices/Notice_{eligibility.CASE_NUM}.pdf"'
            return response
        else:
            return Response({'detail': 'Failed to generate PDF.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            corAPI = correspondance_module.objects.get(pk=pk)
        except correspondance_module.DoesNotExist:
            return Response({'error': 'Record Not Found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = correspondanceModuleSerializers(corAPI, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            corAPI = correspondance_module.objects.get(pk=pk)
        except correspondance_module.DoesNotExist:
            return Response({'error': 'Record Not Found'}, status=status.HTTP_404_NOT_FOUND)

        corAPI.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_eligibility_data(self, case_num):
        """Fetch eligibility data based on the case number."""
        return eligibilityDetermination.objects.filter(CASE_NUM=case_num).first()
