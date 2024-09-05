from .views import PlanCategoryCRUD, PlanMasterCRUD
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()
router.register('plancat',PlanCategoryCRUD)
router.register('planmat',PlanMasterCRUD)

urlpatterns = [
    path('',include(router.urls)),
]
