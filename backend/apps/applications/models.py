from django.db import models
from django.conf import settings


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('admitted', 'Admitted'),
    ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='applications', null=True, blank=True)
    college = models.ForeignKey('colleges.College', on_delete=models.CASCADE, related_name='applications')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applicant_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    marks_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    stream = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'applications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.applicant_name} -> {self.college.name}"
