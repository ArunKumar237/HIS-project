from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Max
from .models import AppReg
from datacol_api.models import DC_Cases
from datacol_api.serializers import DcCasesSerializer
from .serializers import AppRegSerializer

class AppReg_CRUD(viewsets.ModelViewSet):
    queryset = AppReg.objects.all()
    serializer_class = AppRegSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Use request.user to get the authenticated user
        user = request.user
        if not user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        # Retrieve data from the request
        data = request.data

        # If STATE_NAME is "New Jersey", generate the CASE_NUM
        if data.get('STATE_NAME').lower() == 'new jersey':
            max_case_num = AppReg.objects.aggregate(Max('CASE_NUM'))['CASE_NUM__max']
            data['CASE_NUM'] = (max_case_num or 0) + 1

        # Create a new instance of your model
        serializer = AppRegSerializer(data=data)
        if serializer.is_valid():
            # Set CREATED_BY field if not provided
            instance = serializer.save(CREATED_BY=user.username)

            # Save the latest CASE_NUM in the DC_Cases model
            dc_case_data = {
                'CASE_NUM': instance.CASE_NUM,
                'APP_ID': instance.APP_ID,
            }
            dc_case_serializer = DcCasesSerializer(data=dc_case_data)
            if dc_case_serializer.is_valid():
                dc_case_serializer.save()
            else:
                # Handle the case where DC_Cases data is invalid
                return Response(dc_case_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        # Retrieve the instance to update
        instance = self.get_object()

        # Use request.user to get the authenticated user
        user = request.user
        if not user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        # Retrieve data from the request
        data = request.data

        # Check if STATE_NAME is being updated to "New Jersey"
        if data.get('STATE_NAME').lower() == 'new jersey':
            # If STATE_NAME is updated to "New Jersey", calculate new CASE_NUM
            max_case_num = AppReg.objects.aggregate(Max('CASE_NUM'))['CASE_NUM__max']
            new_case_num = (max_case_num or 0) + 1
            data['CASE_NUM'] = new_case_num

        # Update the instance with the new data
        serializer = self.get_serializer(instance, data=data, partial=True)
        if serializer.is_valid():
            # Set UPDATED_BY field
            serializer.save(UPDATED_BY=user.username)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
