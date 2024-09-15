from django.contrib import admin
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from .models import PlanCategory, PlanMaster, CaseWorkerAcct
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']
    # You can add other fields to list_display as needed

class PlanCategoryAdmin(admin.ModelAdmin):
    list_display=['CATEGORY_ID','CATEGORY_NAME', 'CREATE_DATE','UPDATE_DATE','CREATED_BY','UPDATED_BY']

class PlanMasterAdmin(admin.ModelAdmin):
    list_display=['PLAN_ID','PLAN_NAME','PLAN_START_DATE','PLAN_END_DATE','PLAN_CATEGORY_ID','ACTIVE_SW','CREATE_DATE','UPDATE_DATE','CREATED_BY','UPDATED_BY']

class CaseWorkerAcctAdmin(admin.ModelAdmin):
    list_display=[
        'ACC_ID',
        'USERNAME',
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

# Unregister the original User admin
admin.site.unregister(User)

# Register the new User admin with the customized display
admin.site.register(User, UserAdmin)