from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import include
from .views import *



router = DefaultRouter()
router.register('Dc_cases',DcCasesModelViews,basename = 'DC_case')
router.register('Dc_income',DcIncomeModelView,basename = 'DC_income')



urlpatterns = [
   
    path('',include(router.urls)),
   
]