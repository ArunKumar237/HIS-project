from django.contrib import admin
from .models import *
# Register your models here.
class eligibleAdmin(admin.ModelAdmin):
    list_display=["ELIG_ID","CASE_NUM","PLAN_NAME","PLAN_STATUS","PLAN_START_DATE","PLAN_END_DATE","BENEFIT_AMT","DENIAL_REASON"]

admin.site.register(eligibilityDetermination,eligibleAdmin)