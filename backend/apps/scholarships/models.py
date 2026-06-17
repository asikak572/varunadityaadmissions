from django.db import models


class Scholarship(models.Model):
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    eligibility_criteria = models.TextField()
    last_date = models.DateField(null=True, blank=True)
    stream = models.CharField(max_length=20, blank=True, help_text='Leave blank for all streams')
    link_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'scholarships'
        ordering = ['-created_at']

    def __str__(self):
        return self.name
