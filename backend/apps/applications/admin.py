from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('applicant_name', 'email', 'college', 'course', 'status', 'created_at')
    list_filter = ('status', 'college', 'course')
    search_fields = ('applicant_name', 'email', 'phone')
    list_editable = ('status',)
    ordering = ('-created_at',)
