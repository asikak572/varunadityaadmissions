from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from .models import Course, STREAM_CHOICES
from .serializers import CourseSerializer, CourseListSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['stream', 'is_popular']
    search_fields = ['name', 'short_name', 'stream']
    ordering_fields = ['name', 'duration_years', 'avg_salary_max']

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular = self.get_queryset().filter(is_popular=True)[:8]
        return Response(CourseListSerializer(popular, many=True).data)

    @action(detail=False, methods=['get'])
    def streams(self, request):
        data = []
        for value, label in STREAM_CHOICES:
            count = Course.objects.filter(stream=value, is_active=True).count()
            data.append({'stream': value, 'label': label, 'count': count})
        return Response(data)
