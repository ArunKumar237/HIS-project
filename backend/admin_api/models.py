from django.db import models
from datetime import date
class PlanCategory(models.Model):
    CATEGORY_ID = models.AutoField(primary_key=True, )
    CATEGORY_NAME = models.CharField(max_length=64)
    CREATE_DATE = models.DateField(auto_now_add=True)
    UPDATE_DATE = models.DateField(auto_now=True)
    CREATED_BY = models.CharField(default='admin', max_length=64)
    UPDATED_BY = models.CharField(default='admin', max_length=64)

class PlanMaster(models.Model):
    PLAN_ID	= models.AutoField(primary_key=True)
    PLAN_NAME = models.CharField(max_length=64, unique=True)
    PLAN_START_DATE = models.DateField()	
    PLAN_END_DATE = models.DateField()
    PLAN_CATEGORY_ID = models.ForeignKey(PlanCategory, on_delete=models.CASCADE)
    ACTIVE_SW = models.BooleanField(default=False)
    CREATE_DATE = models.DateField(auto_now_add=True)
    UPDATE_DATE	= models.DateField(auto_now=True)
    CREATED_BY = models.CharField(default='admin', max_length=64)
    UPDATED_BY = models.CharField(default='admin', max_length=64)

    def save(self, *args, **kwargs):
        # Get today's date
        today = date.today()

        # Check if today is between the start and end dates
        if self.PLAN_START_DATE <= today <= self.PLAN_END_DATE:
            self.ACTIVE_SW = True
        else:
            self.ACTIVE_SW = False

        # Call the original save method to ensure the object is saved
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.PLAN_NAME}"

class CaseWorkerAcct(models.Model):
    ACC_ID	= models.AutoField(primary_key=True)
    USERNAME = models.CharField(max_length=64, unique=True, blank=False, null=False)
    FULLNAME = models.CharField(max_length=64, blank=False, null=False)
    EMAIL = models.CharField(max_length=64, default='arunchary237@gmail.com', blank=False, null=False)
    PWD = models.CharField(max_length=64, editable=False, blank=False, null=False)
    PHNO = models.IntegerField(default=9876543210, blank=False, null=False)
    GENDER = models.CharField(max_length=6, blank=False, null=False)
    SSN = models.IntegerField(default=987657847, blank=False, null=False)
    DOB = models.DateField(blank=False, null=False)
    ACTIVE_SW = models.BooleanField(default=False, blank=False, null=False)
    CREATE_DATE = models.DateField(auto_now_add=True, blank=False, null=False)
    UPDATE_DATE	= models.DateField(auto_now=True, blank=False, null=False)
    CREATED_BY = models.CharField(max_length=64, default='admin', blank=False, null=False)
    UPDATED_BY = models.CharField(max_length=64, default='admin', blank=False, null=False)