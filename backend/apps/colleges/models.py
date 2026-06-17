from django.db import models


class College(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=300)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    established_year = models.IntegerField(null=True, blank=True)
    image_url = models.URLField(blank=True)
    website_url = models.URLField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    review_count = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'colleges'
        ordering = ['-is_featured', '-rating']

    def __str__(self):
        return self.name
