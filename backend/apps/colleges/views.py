from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import College
from .serializers import CollegeSerializer, CollegeListSerializer


class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['state', 'city', 'is_featured']
    search_fields = ['name', 'city', 'state']
    ordering_fields = ['rating', 'name', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CollegeListSerializer
        return CollegeSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
