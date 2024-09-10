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
    list_display=['CATEGORY_ID','CATEGORY_NAME','ACTIVE_SW','CREATE_DATE','UPDATE_DATE','CREATED_BY','UPDATED_BY']

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

    def save_model(self, request, obj, form, change):
        # Call the parent method to save the CaseWorkerAcct instance
        super().save_model(request, obj, form, change)
        
        if not change:  # Only create User if this is a new CaseWorkerAcct
            # Ensure that EMAIL is unique or handle accordingly
            if User.objects.filter(username=obj.USERNAME).exists():
                raise ValidationError("User with this email already exists.")
            
            # Generate a default password
            default_password = get_random_string(length=8)  # Adjust length as needed
            obj.PWD = default_password

            # Create the User
            user = User.objects.create_user(
                username=obj.USERNAME,
                email=obj.EMAIL,
                password=default_password
            )

            # Optionally set other fields if needed
            user.first_name = obj.FULLNAME.split(' ')[0]  # Example: setting first name
            user.last_name = ' '.join(obj.FULLNAME.split(' ')[1:])  # Example: setting last name
            user.save()

            # Link the User with CaseWorkerAcct
            obj.user = user
            obj.save()


            # Optionally send an email with the default password
            subject='Reset your password'
            message=(
                f"""Your account has been created.\nYour username is: {obj.USERNAME}\nYour default password is: {default_password}\nplease login into our portal"""
            )
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [obj.EMAIL]
            
            send_mail(
                subject,
                message,
                from_email,
                recipient_list,
                fail_silently=False
            )

admin.site.register(PlanCategory,PlanCategoryAdmin)
admin.site.register(PlanMaster,PlanMasterAdmin)
admin.site.register(CaseWorkerAcct,CaseWorkerAcctAdmin)

# Unregister the original User admin
admin.site.unregister(User)

# Register the new User admin with the customized display
admin.site.register(User, UserAdmin)