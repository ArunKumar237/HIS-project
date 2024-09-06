from django.contrib import admin
from .models import DC_Cases, DC_Income,DC_Childrens,DC_Education

class DC_CasesAdmin(admin.ModelAdmin):
    list_display=['CASE_ID','CASE_NUM','APP_ID','PLAN_ID']

class DC_IncomeAdmin(admin.ModelAdmin):
    list_display=['INCOME_ID','CASE_NUM','EMP_INCOME','PROPERTY_INCOME']

class DC_ChildrenAdmin(admin.ModelAdmin):
    list_display=['CHILDREN_ID','CASE_NUM','CHILDREN_DOB','CHILDREN_SSN']
    
class DC_EducationAdmin(admin.ModelAdmin):
    list_display = ['EDU_ID','CASE_NUM','HIGHEST_QUALIFICATION','GRADUATION_YEAR']


admin.site.register(DC_Cases,DC_CasesAdmin)
admin.site.register(DC_Income,DC_IncomeAdmin)
admin.site.register(DC_Childrens,DC_ChildrenAdmin)
admin.site.register(DC_Education,DC_EducationAdmin)
