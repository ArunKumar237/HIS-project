from django.db import models
from appreg_api.models import AppReg
from admin_api.models import PlanMaster

class DC_Cases(models.Model):
    CASE_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(AppReg, to_field='CASE_NUM', on_delete=models.CASCADE)
    APP_ID = models.IntegerField()
    PLAN_NAME = models.ForeignKey(PlanMaster, to_field='PLAN_NAME', on_delete=models.CASCADE, null=True)
    class Meta:
        verbose_name = 'Dc_case'
        verbose_name_plural = 'Dc_cases'
        
        
class DC_Income(models.Model):
    INCOME_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(AppReg, to_field='CASE_NUM', on_delete=models.CASCADE,null=True,blank=True, unique=True)
    EMP_INCOME = models.IntegerField()
    PROPERTY_INCOME = models.IntegerField()
    class Meta:
        verbose_name = 'Dc_income'
        verbose_name_plural = 'Dc_income'


class DC_Childrens(models.Model):
    CHILDREN_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(AppReg, to_field='CASE_NUM', on_delete=models.CASCADE,null=True,blank=True)
    CHILDREN_DOB = models.DateField()
    CHILDREN_SSN = models.IntegerField(unique=True)
    class Meta:
        verbose_name = 'Dc_children'
        verbose_name_plural = 'Dc_childrens'

class DC_Education(models.Model):
    EDU_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(AppReg, to_field='CASE_NUM', on_delete=models.CASCADE,null=True,blank=True, unique=True)
    HIGHEST_QUALIFICATION	= models.CharField(max_length=255)
    GRADUATION_YEAR	= models.DateField()
    class Meta:
        verbose_name = 'Dc_education'
        verbose_name_plural = 'Dc_education'
      
