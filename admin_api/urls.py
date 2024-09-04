from .views import PlanCategoryCRUD, PlanMasterCRUD
from rest_framework import routers
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register('plancat',PlanCategoryCRUD)
router.register('planmat',PlanMasterCRUD)

urlpatterns = [
    path('api/',include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]