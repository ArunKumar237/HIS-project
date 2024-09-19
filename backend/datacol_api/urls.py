from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DcCasesModelViews, DcIncomeModelView, DcChildrensModelView, DcEducationsModelView, get_latest_case, get_plan_names

# Define the router for viewsets
router = DefaultRouter()
router.register('Dc_cases', DcCasesModelViews, basename='DC_case')
router.register('Dc_income', DcIncomeModelView, basename='DC_income')
router.register('Dc_children', DcChildrensModelView, basename='DC_children')
router.register('Dc_education', DcEducationsModelView, basename='DC_education')

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('get-latest-case-number/', get_latest_case, name='get_latest_case_number'),
    path('get-plan-names/', get_plan_names, name='get_plan_names'),
]
