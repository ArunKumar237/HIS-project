# filters.py
from django_filters import rest_framework as filters
from .models import eligibilityDetermination

class EligibilityDeterminationFilter(filters.FilterSet):
    GENDER = filters.CharFilter(field_name='app_reg__GENDER')
    PLAN_START_DATE = filters.DateFilter(field_name='PLAN_START_DATE', lookup_expr='gte', label='Plan Start Date')
    PLAN_END_DATE = filters.DateFilter(field_name='PLAN_END_DATE', lookup_expr='lte', label='Plan End Date')
    


    class Meta:
        model = eligibilityDetermination
        fields = ['PLAN_NAME', 'PLAN_STATUS', 'GENDER', 'PLAN_START_DATE', 'PLAN_END_DATE']
