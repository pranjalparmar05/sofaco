from rest_framework import viewsets
from .models import SofaProduct
from .serializers import SofaProductSerializer

class SofaProductViewSet(viewsets.ModelViewSet):
    queryset = SofaProduct.objects.all().order_by('-created_at')
    serializer_class = SofaProductSerializer