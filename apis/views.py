from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import DjangoModelPermissions
from .serializers import PlanCategorySerializer, PlanMasterSerializer
from .models import PlanCategory, PlanMaster

class PlanCategoryCRUD(ModelViewSet):
    serializer_class = PlanCategorySerializer
    queryset = PlanCategory.objects.all()
    permission_classes=[DjangoModelPermissions,]

class PlanMasterCRUD(ModelViewSet):
    serializer_class = PlanMasterSerializer
    queryset = PlanMaster.objects.all()
    permission_classes=[DjangoModelPermissions,]