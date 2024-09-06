from django.contrib import admin
from .models import DC_Cases, DC_Income

class DC_CasesAdmin(admin.ModelAdmin):
    list_display=['CASE_ID','CASE_NUM','APP_ID','PLAN_ID']

class DC_IncomeAdmin(admin.ModelAdmin):
    list_display=['INCOME_ID','CASE_NUM','EMP_INCOME','PROPERTY_INCOME']


admin.site.register(DC_Cases,DC_CasesAdmin)
admin.site.register(DC_Income,DC_IncomeAdmin)
