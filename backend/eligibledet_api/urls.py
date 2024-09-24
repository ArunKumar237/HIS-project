from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import include
from .views import *



router = DefaultRouter()
router.register('eligibility',eligibilityModelViews,basename = 'eligibility')
router.register('searchNotice',NoticeViewSet,basename = 'searchNotice')
router.register('pendingNotices',PendingNoticeViewSet,basename = 'pendingNotices')
router.register('historyNotices',HistoryNoticeViewSet,basename = 'historyNotices')
router.register('eligibilityFilter', EligibilityFilterViewSet,basename='eligibilityFilter')




urlpatterns = [
   
    path('',include(router.urls)),
   
]