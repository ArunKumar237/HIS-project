from rest_framework import serializers 

class EmailSerializer(serializers.Serializer): 
    email = serializers.CharField(max_length=64)


class PasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=300)
    uid = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100)

class NewUserChangePasswordSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100)
    new_password = serializers.CharField(max_length=100)