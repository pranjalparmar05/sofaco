from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SofaProductViewSet

router = DefaultRouter()
router.register(r'sofas', SofaProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]