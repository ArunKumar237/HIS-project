from django.contrib import admin
from .models import *
# Register your models here.

class userDataAdmin(admin.ModelAdmin):
    list_display=['ssn','state']

admin.site.register(user_data,userDataAdmin)