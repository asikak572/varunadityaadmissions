from rest_framework import serializers
from .models import College


class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'


class CollegeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ('id', 'name', 'slug', 'city', 'state', 'image_url', 'rating', 'review_count', 'is_featured')
