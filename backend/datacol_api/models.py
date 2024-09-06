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
    def __str__(self):
        return self.CASE_NUM
        
        
class DC_Income(models.Model):
    INCOME_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(DC_Cases, on_delete=models.CASCADE,null=True,blank=True )
    EMP_INCOME = models.CharField(max_length=6)
    PROPERTY_INCOME = models.CharField(max_length=6)
    class Meta:
        verbose_name = 'Dc_income'
        verbose_name_plural = 'Dc_income'


class DC_Childrens(models.Model):
    CHILDREN_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(DC_Cases, on_delete=models.CASCADE,null=True,blank=True )
    CHILDREN_DOB = models.IntegerField()
    CHILDREN_SSN = models.IntegerField()
    class Meta:
        verbose_name = 'Dc_children'
        verbose_name_plural = 'Dc_childrens'

class DC_Education(models.Model):
    EDU_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.ForeignKey(DC_Cases, on_delete=models.CASCADE ,null=True,blank=True)		
    HIGHEST_QUALIFICATION	= models.CharField(max_length=255)
    GRADUATION_YEAR		= models.IntegerField()
    class Meta:
        verbose_name = 'Dc_education'
        verbose_name_plural = 'Dc_education'
      
