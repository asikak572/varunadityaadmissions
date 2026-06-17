from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView

def health_check(request):
    return JsonResponse({'status': 'healthy'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health'),
    path('api/auth/', include('apps.users.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/colleges/', include('apps.colleges.urls')),
    path('api/courses/', include('apps.courses.urls')),
    path('api/applications/', include('apps.applications.urls')),
    path('api/scholarships/', include('apps.scholarships.urls')),
    path('api/contact/', include('apps.contact.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
