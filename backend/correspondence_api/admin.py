from django.contrib import admin
from .models import *
# Register your models here.
class correspondance_admin(admin.ModelAdmin):
    list_display = ['TRG_ID','CASE_NUM','TRG_STATUS','NOTICE']
 
admin.site.register(correspondance_module,correspondance_admin)