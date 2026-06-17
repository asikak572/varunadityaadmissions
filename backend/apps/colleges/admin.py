from django.contrib import admin
from .models import College


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'rating', 'is_featured', 'is_active')
    list_filter = ('state', 'is_featured', 'is_active')
    search_fields = ('name', 'city')
    prepopulated_fields = {'slug': ('name',)}
