from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('id', 'status', 'student', 'created_at', 'updated_at')


class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('id', 'status')
