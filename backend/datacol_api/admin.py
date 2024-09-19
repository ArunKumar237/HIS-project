from django.contrib import admin
from .models import DC_Cases, DC_Income,DC_Childrens,DC_Education

class DC_CasesAdmin(admin.ModelAdmin):
    list_display=['CASE_ID','CASE_NUM','APP_ID','PLAN_NAME']

    def get_case_num(self, obj):
        return obj.CASE_NUM.CASE_NUM  # Display the case number from AppReg
    get_case_num.admin_order_field = 'CASE_NUM'
    get_case_num.short_description = 'Case Number'

    def get_plan_name(self, obj):
        return obj.PLAN_NAME.PLAN_NAME
    get_plan_name.admin_order_field = 'PLAN_NAME'
    get_plan_name.short_description = "Plan Name"

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
