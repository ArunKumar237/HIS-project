from django.db import models
class PlanCategory(models.Model):
    CATEGORY_ID = models.AutoField(primary_key=True, )
    CATEGORY_NAME = models.CharField(max_length=64)
    ACTIVE_SW = models.CharField(max_length=64)
    CREATE_DATE = models.DateField(auto_now_add=True)
    UPDATE_DATE = models.DateField(auto_now=True)
    CREATED_BY = models.CharField(max_length=64)
    UPDATED_BY = models.CharField(max_length=64)

class PlanMaster(models.Model):
    PLAN_ID	= models.AutoField(primary_key=True)
    PLAN_NAME = models.CharField(max_length=64)
    PLAN_START_DATE = models.DateField()	
    PLAN_END_DATE = models.DateField()
    PLAN_CATEGORY_ID = models.IntegerField()
    ACTIVE_SW = models.CharField(max_length=64)
    CREATE_DATE = models.DateField(auto_now_add=True)
    UPDATE_DATE	= models.DateField(auto_now=True)
    CREATED_BY = models.CharField(max_length=64)
    UPDATED_BY = models.CharField(max_length=64)