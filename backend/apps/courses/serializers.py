from rest_framework import serializers
from .models import Course, CareerOpportunity


class CareerOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerOpportunity
        fields = ('id', 'job_title')


class CourseSerializer(serializers.ModelSerializer):
    career_opportunities = CareerOpportunitySerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'short_name', 'stream', 'duration_years', 'eligibility', 'avg_salary_min', 'avg_salary_max', 'is_popular')
