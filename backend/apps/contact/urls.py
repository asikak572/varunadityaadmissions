from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin', views.InquiryAdminViewSet, basename='inquiry-admin')

urlpatterns = [
    path('', views.InquiryCreateView.as_view(), name='inquiry-create'),
    path('', include(router.urls)),
]
