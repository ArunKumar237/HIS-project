from django.db import models

# Create your models here.

class appReg_Module(models.Model):
    APP_ID = models.AutoField(primary_key=True)
    FULLNAME = models.CharField(max_length=255)			
    EMAIL	= models.CharField(max_length=255)			
    PHNO	= models.BigIntegerField()
    SSN		= models.BigIntegerField(unique=True)			
    GENDER	= models.CharField(max_length=255)				
    STATE_NAME = models.CharField(max_length=255)	
    CREATE_DATE =	models.DateField(auto_now=True)
    UPDATE_DATE	= models.DateField(auto_now_add=True)
    CREATED_BY	= models.CharField(max_length=255)	
    UPDATED_BY = models.CharField(max_length=255)	