from rest_framework import serializers
from .models import SofaProduct

class SofaProductSerializer(serializers.ModelSerializer):
    class HeatMeta: # (Ya standard Meta)
        model = SofaProduct
        fields = '__all__'

    class Meta:
        model = SofaProduct
        fields = '__all__'