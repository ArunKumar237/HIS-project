from django.urls import path, include
from . import views
from rest_framework import routers 

router=routers.DefaultRouter() 
# router.register('login',views.LoginView,basename='login')
router.register('change-password',views.PasswordResetRequestView,basename='change-password')
router.register('reset-password',views.PasswordResetConfirmView,basename='reset-password')
router.register('unlock-account',views.NewUserChangePasswordView,basename='unlock-account')

urlpatterns = [
    path(r'',include(router.urls))
]