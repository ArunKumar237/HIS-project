from django.db import models

# Create your models here.

class AppReg(models.Model):
    APP_ID = models.AutoField(primary_key=True)
    FULLNAME = models.CharField(max_length=255)			
    EMAIL	= models.CharField(max_length=255, unique=True)			
    PHNO	= models.BigIntegerField()
    SSN		= models.BigIntegerField(unique=True)			
    GENDER	= models.CharField(max_length=255)
    DOB = models.DateField(null=True)				
    STATE_NAME = models.CharField(max_length=255)	
    CASE_NUM = models.IntegerField(default=0, null=True, unique=True)
    CREATE_DATE =	models.DateField(auto_now=True)
    UPDATE_DATE	= models.DateField(auto_now_add=True)
    CREATED_BY	= models.CharField(max_length=255, null=True, blank=True)	
    UPDATED_BY = models.CharField(max_length=255, null=True, blank=True)	

    def __str__(self):
        # Return a string representation of the instance
        return f"{self.CASE_NUM}"