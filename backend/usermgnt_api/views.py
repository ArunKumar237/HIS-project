import os
import environ
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import UntypedToken, TokenError, RefreshToken, AccessToken
from rest_framework.exceptions import ValidationError
from .serializers import EmailSerializer, PasswordResetSerializer, NewUserChangePasswordSerializer
from rest_framework.permissions import AllowAny
from admin_api.models import CaseWorkerAcct

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


class NewUserChangePasswordView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def get_queryset(self):
        # This queryset won't be directly used in the reset logic, 
        # but it's required for DjangoModelPermissions
        return User.objects.all()

    def create(self, request):
        # Access query params and combine with body data
        username = request.data.get('username')
        password = request.data.get('password')
        new_password = request.data.get('new_password')

        # Combine token and uid from query params with password from request body
        data = {
            'username' : request.data.get('username'),
            'password' : request.data.get('password'),
            'new_password' : request.data.get('new_password'),
        }

        print('received data:',data)

        # Pass the combined data to the serializer
        serializer = NewUserChangePasswordSerializer(data=data)

        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            new_password = serializer.data.get('new_password')
            try:
                print('----->', username, password)
                user = authenticate(username=username, password=password)

                if user is not None:
                    # Changing staff status
                    if user.is_staff == False:
                        user.is_staff = True

                        #updating password in caseworkeracct
                        worker = CaseWorkerAcct.objects.get(USERNAME=user.username)
                        worker.ACTIVE_SW = True
                        worker.save()
                    
                    # Set the new password
                    user.set_password(new_password)
                    user.save()

                    return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

            except (User.DoesNotExist, ValidationError, TokenError):
                return Response({'error': 'Invalid token or user does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors,status=400)

    

class PasswordResetRequestView(viewsets.ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        # This queryset won't be directly used in the reset logic, 
        # but it's required for DjangoModelPermissions
        return User.objects.all()

    def create(self, request):
        serializer=EmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            user = User.objects.filter(email=email).first()
            if user:
                token = RefreshToken.for_user(user).access_token
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                # domain_url = request.build_absolute_uri('/')[:-1].strip("/")
                reset_url = f"http://localhost:5173/reset/?token={token}&uid={uid}"
                send_mail(
                    'Password Reset Request',
                    f'Click the link to reset your password: {reset_url}',
                    env('EMAIL_HOST_USER'), #from
                    [email], #to
                    fail_silently=False,
                )
            return Response({'message': 'If an account with that email exists, we have sent a password reset link.'})
        return Response(serializer.errors,status=400)


class PasswordResetConfirmView(viewsets.ViewSet):
    permission_classes = [AllowAny,]
    authentication_classes = []

    def get_queryset(self):
        # This queryset won't be directly used in the reset logic, 
        # but it's required for DjangoModelPermissions
        return User.objects.all()

    def create(self, request):
        # Access query params and combine with body data
        token = request.query_params.get('token')
        uidb64 = request.query_params.get('uid')

        # Combine token and uid from query params with password from request body
        data = {
            'token': token,
            'uid': uidb64,
            'password': request.data.get('password')
        }

        # Pass the combined data to the serializer
        serializer = PasswordResetSerializer(data=data)

        if serializer.is_valid():
            token = serializer.data.get('token')
            uidb64 = serializer.data.get('uid')
            new_password = serializer.data.get('password')
            try:
                # Decode the user ID
                uid = urlsafe_base64_decode(uidb64).decode()
                user = User.objects.get(pk=uid)

                if user.is_staff == False:
                    return Response({'error': 'first Unlock your Account at our portal'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Validate the token
                UntypedToken(token)  # This raises an exception if the token is invalid or expired
                
                # Set the new password
                user.set_password(new_password)
                user.save()

                #updating password in caseworkeracct
                worker = CaseWorkerAcct.objects.get(USERNAME=user.username)
                worker.PWD = new_password
                worker.save()

                print('---->',user.email, user.username)
                send_mail(
                    'Password Reset Successfull',
                    f'Your password reset was successful your new credentials are below\nusername:{user.username}\nnew password:{new_password}',
                    env('EMAIL_HOST_USER'), #from
                    [user.email], #to
                    fail_silently=False,
                )
                return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
            except (User.DoesNotExist, ValidationError, TokenError):
                return Response({'error': 'Invalid token or user does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors,status=400)
