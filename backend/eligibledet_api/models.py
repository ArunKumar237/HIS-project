from django.db import models
from appreg_api.models import AppReg

# Create your models here.


class eligibilityDetermination(models.Model):
    ELIG_ID = models.AutoField(primary_key=True)
    CASE_NUM = models.IntegerField(unique=True)
    PLAN_NAME = models.CharField(max_length=255)
    PLAN_STATUS = models.CharField(max_length=255)
    PLAN_START_DATE = models.DateField(null=True, blank=True)
    PLAN_END_DATE = models.DateField(null=True, blank=True)
    BENEFIT_AMT = models.IntegerField(null=True, blank=True)
    DENIAL_REASON = models.CharField(max_length=255, null=True, blank=True)
    MAIL_SENT = models.BooleanField(default=False)
    EMAIL = models.CharField(default=None, max_length=100)

    app_reg = models.ForeignKey(AppReg, on_delete=models.CASCADE, related_name='eligibility_determinations', default=1)