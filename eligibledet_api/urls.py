from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import include
from .views import *



router = DefaultRouter()
router.register('eligibility',eligibilityModelViews,basename = 'eligibility')




urlpatterns = [
   
    path('',include(router.urls)),
   
]