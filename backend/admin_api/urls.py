from .views import PlanCategoryCRUD, PlanMasterCRUD, CaseWorkerAcctCRUD
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()
router.register('plancat',PlanCategoryCRUD)
router.register('planmat',PlanMasterCRUD)
router.register('casewrkacct',CaseWorkerAcctCRUD)

urlpatterns = [
    path('',include(router.urls)),
]
