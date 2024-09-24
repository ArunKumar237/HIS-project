# filters.py
from django_filters import rest_framework as filters
from .models import eligibilityDetermination

class EligibilityDeterminationFilter(filters.FilterSet):
    PLAN_NAME = filters.CharFilter(field_name='PLAN_NAME', lookup_expr='icontains')
    PLAN_STATUS = filters.CharFilter(field_name='PLAN_STATUS', lookup_expr='icontains')
    GENDER = filters.CharFilter(field_name='EMAIL__GENDER', lookup_expr='iexact')
    PLAN_START_DATE = filters.DateFilter(field_name='PLAN_START_DATE', lookup_expr='gte')
    PLAN_END_DATE = filters.DateFilter(field_name='PLAN_END_DATE', lookup_expr='lte')

    class Meta:
        model = eligibilityDetermination
        fields = ['PLAN_NAME', 'PLAN_STATUS', 'GENDER', 'PLAN_START_DATE', 'PLAN_END_DATE']
