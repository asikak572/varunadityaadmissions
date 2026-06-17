from django.contrib import admin
from .models import Scholarship


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ('name', 'provider', 'amount', 'stream', 'last_date', 'is_active')
    list_filter = ('stream', 'is_active')
    search_fields = ('name', 'provider')
