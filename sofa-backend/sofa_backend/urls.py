"""
URL configuration for sofa_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static

def home_view(request):
    return HttpResponse("Sofa Backend is Live and Running!")

urlpatterns = [
    path('', home_view),  # Ye root URL par message dikhayega
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
]

# Yeh line Render/Production par uploaded images ko dikhane ke liye zaroori hai
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)