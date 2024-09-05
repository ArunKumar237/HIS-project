from django.db import models

# Create your models here.


class DC_Cases(models.Model):
    CASE_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.CharField(max_length=6,null=True,blank=True)
    APP_ID = models.CharField(max_length=6)
    PLAN_ID = models.CharField(max_length=6)
    class Meta:
        verbose_name = 'Dc_case'
        verbose_name_plural = 'Dc_cases'
        
        
class DC_Income(models.Model):
    INCOME_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(DC_Cases, on_delete=models.CASCADE,null=True,blank=True )
    EMP_INCOME = models.CharField(max_length=6)
    PROPERTY_INCOME = models.CharField(max_length=6)
    class Meta:
        verbose_name = 'Dc_income'
        verbose_name_plural = 'Dc_income'
      
