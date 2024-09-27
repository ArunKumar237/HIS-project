from django.db import models

# Create your models here.
class correspondance_module(models.Model):
    TRG_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.IntegerField(unique=True)
    GEN_DATE = models.DateField(null=True, auto_now_add=True)
    NOTICE	 = models.BinaryField()