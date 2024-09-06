from django.db import models

# Create your models here.
class correspondance_module(models.Model):
    TRG_ID = models.AutoField(primary_key=True)
    CASE_NUM	=models.IntegerField()
    TRG_STATUS	= models.CharField(max_length=255)
    NOTICE		= models.FileField()