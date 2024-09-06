from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import DjangoModelPermissions
from .serializers import PlanCategorySerializer, PlanMasterSerializer, CaseWorkerAcctSerializer
from .models import PlanCategory, PlanMaster, CaseWorkerAcct

class PlanCategoryCRUD(ModelViewSet):
    serializer_class = PlanCategorySerializer
    queryset = PlanCategory.objects.all()
    permission_classes=[DjangoModelPermissions,]

class PlanMasterCRUD(ModelViewSet):
    serializer_class = PlanMasterSerializer
    queryset = PlanMaster.objects.all()
    permission_classes=[DjangoModelPermissions,]

class CaseWorkerAcctCRUD(ModelViewSet):
    serializer_class = CaseWorkerAcctSerializer
    queryset = CaseWorkerAcct.objects.all()
    permission_classes=[DjangoModelPermissions,]