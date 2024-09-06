from rest_framework.routers import DefaultRouter
from appreg_api.views import appRegModuleModelViewSet
from django.urls import path,include

router = DefaultRouter()
router.register('appRegister',appRegModuleModelViewSet,basename='appReg')

urlpatterns = [
   
    path('',include(router.urls)),
   
]