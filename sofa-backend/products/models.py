from django.db import models

class SofaProduct(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    
    # ImageField ki jagah URLField use karein taaki internet ka direct link chal sake
    image = models.URLField(max_length=500, blank=True, null=True)
    
    tag = models.CharField(max_length=50, blank=True, null=True)
    stock = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name