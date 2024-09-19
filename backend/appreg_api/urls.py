from rest_framework.routers import DefaultRouter
from appreg_api.views import AppReg_CRUD
from django.urls import path,include

router = DefaultRouter()
router.register('appRegister',AppReg_CRUD,basename='appRegister')

urlpatterns = [
   
    path('',include(router.urls)),
   
]