from rest_framework.routers import DefaultRouter
from correspondence_api.views import *
from django.urls import path,include
router = DefaultRouter()
router.register('correspondance',CorrespondanceModelView,basename='correspondanceApi')

urlpatterns = [
    path('',include(router.urls))
]


