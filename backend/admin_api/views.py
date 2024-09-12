from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import DjangoModelPermissions
from .serializers import PlanCategorySerializer, PlanMasterSerializer, CaseWorkerAcctSerializer
from .models import PlanCategory, PlanMaster, CaseWorkerAcct
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.utils.crypto import get_random_string
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status

class PlanCategoryCRUD(ModelViewSet):
    serializer_class = PlanCategorySerializer
    queryset = PlanCategory.objects.all()
    permission_classes=[DjangoModelPermissions,]

class PlanMasterCRUD(ModelViewSet):
    serializer_class = PlanMasterSerializer
    queryset = PlanMaster.objects.all()
    permission_classes=[DjangoModelPermissions,]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CaseWorkerAcctCRUD(ViewSet):
    def list(self, request):
        queryset = CaseWorkerAcct.objects.all()
        serializer = CaseWorkerAcctSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = CaseWorkerAcctSerializer(data=request.data)
        if serializer.is_valid():
            default_password = get_random_string(length=8)
            serializer.save(PWD=default_password)

            print(serializer.data)
            username = serializer.data.get('USERNAME')
            fullname = serializer.data.get('FULLNAME')
            email= serializer.data.get('EMAIL')

            #saving this caseworker in user
            user = User.objects.create_user(
                username=username,
                first_name = fullname.split(' ')[0],
                last_name = ' '.join(fullname.split(' ')[1:]),
                email=email,
                password=default_password,
            )
            user.save()

            # Optionally send an email with the default password
            subject='Reset your password'
            message=(
                f"""Your account has been created.\nYour username is: {username}\nYour default password is: {default_password}\nplease login into our portal"""
            )
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]
            
            send_mail(
                subject,
                message,
                from_email,
                recipient_list,
                fail_silently=False
            )
            return Response('CaseWorker form submitted successfully')
        return Response(serializer.errors,status=400)

    def update(self, request, pk=None):
        try:
            worker = CaseWorkerAcct.objects.get(pk=pk)
        except CaseWorkerAcct.DoesNotExist:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CaseWorkerAcctSerializer(instance=worker, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        try:
            worker = CaseWorkerAcct.objects.get(pk=pk)
            print('--patch--->',worker, worker.USERNAME)
        except CaseWorkerAcct.DoesNotExist:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)

        if worker.USERNAME == request.user.username:
            return Response({'error': 'You cannot lock/unlock your own account'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CaseWorkerAcctSerializer(instance=worker, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # Update User model
            try:
                user = User.objects.get(username=worker.USERNAME)
                print('serializer status:',serializer.data.get('ACTIVE_SW'), worker.ACTIVE_SW, request.data, request.data.get('ACTIVE_SW'))
                
                print('user:',request.user.username)
                if user.is_staff != request.data.get('ACTIVE_SW'):
                    user.is_staff = request.data.get('ACTIVE_SW')
                    user.save()

                    worker.UPDATED_BY = request.user.username
                    worker.save()
            except User.DoesNotExist:
                return Response({'error': 'Associated user not found'}, status=status.HTTP_404_NOT_FOUND)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def destroy(self, request, pk=None):
        try:
            worker = CaseWorkerAcct.objects.get(pk=pk)
        except CaseWorkerAcct.DoesNotExist:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)

        username = worker.USERNAME

        # Delete associated User model
        try:
            user = User.objects.get(username=username)
            user.delete()
        except User.DoesNotExist:
            return Response({'error': 'Associated user not found'}, status=status.HTTP_404_NOT_FOUND)

        worker.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
