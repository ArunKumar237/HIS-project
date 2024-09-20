from django.db import models

# Create your models here.


class eligibilityDetermination(models.Model):
    ELIG_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.IntegerField()
    PLAN_NAME = models.CharField(max_length=255)
    PLAN_STATUS = models.CharField(max_length=255)
    PLAN_START_DATE = models.DateField(null=True, blank=True)
    PLAN_END_DATE = models.DateField(null=True, blank=True)
    BENEFIT_AMT = models.IntegerField(null=True, blank=True)
    DENIAL_REASON = models.CharField(max_length=255, null=True, blank=True)

