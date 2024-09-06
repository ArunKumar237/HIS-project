from django.contrib import admin
from .models import PlanCategory, PlanMaster, CaseWorkerAcct

class PlanCategoryAdmin(admin.ModelAdmin):
    list_display=['CATEGORY_ID','CATEGORY_NAME','ACTIVE_SW','CREATE_DATE','UPDATE_DATE','CREATED_BY','UPDATED_BY']

class PlanMasterAdmin(admin.ModelAdmin):
    list_display=['PLAN_ID','PLAN_NAME','PLAN_START_DATE','PLAN_END_DATE','PLAN_CATEGORY_ID','ACTIVE_SW','CREATE_DATE','UPDATE_DATE','CREATED_BY','UPDATED_BY']

class CaseWorkerAcctAdmin(admin.ModelAdmin):
    list_display=[
        'ACC_ID',
        'FULLNAME',
        'EMAIL',
        'PWD',
        'PHNO',
        'GENDER',
        'SSN',
        'DOB',
        'ACTIVE_SW',
        'CREATE_DATE',
        'UPDATE_DATE',
        'CREATED_BY',
        'UPDATED_BY',
    ]

admin.site.register(PlanCategory,PlanCategoryAdmin)
admin.site.register(PlanMaster,PlanMasterAdmin)
admin.site.register(CaseWorkerAcct,CaseWorkerAcctAdmin)