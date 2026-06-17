from django.contrib import admin
from .models import Course, CareerOpportunity, CollegeCourse

class CareerOpportunityInline(admin.TabularInline):
    model = CareerOpportunity
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_name', 'stream', 'duration_years', 'is_popular', 'is_active')
    list_filter = ('stream', 'is_popular', 'is_active')
    search_fields = ('name', 'short_name')
    inlines = [CareerOpportunityInline]

admin.site.register(CollegeCourse)
