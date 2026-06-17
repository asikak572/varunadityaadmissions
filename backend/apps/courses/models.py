from django.db import models

STREAM_CHOICES = [
    ('engineering', 'Engineering'),
    ('medical', 'Medical'),
    ('management', 'Management'),
    ('commerce', 'Commerce'),
    ('arts', 'Arts & Science'),
    ('law', 'Law'),
    ('design', 'Design'),
    ('pharmacy', 'Pharmacy'),
    ('nursing', 'Nursing'),
]


class Course(models.Model):
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=20)
    stream = models.CharField(max_length=20, choices=STREAM_CHOICES)
    duration_years = models.DecimalField(max_digits=3, decimal_places=1)
    eligibility = models.CharField(max_length=255)
    avg_salary_min = models.IntegerField(default=0, help_text='In lakhs PA')
    avg_salary_max = models.IntegerField(default=0, help_text='In lakhs PA')
    description = models.TextField(blank=True)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        ordering = ['-is_popular', 'name']

    def __str__(self):
        return self.name


class CareerOpportunity(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='career_opportunities')
    job_title = models.CharField(max_length=255)

    class Meta:
        db_table = 'career_opportunities'

    def __str__(self):
        return f"{self.course.short_name} - {self.job_title}"


class CollegeCourse(models.Model):
    college = models.ForeignKey('colleges.College', on_delete=models.CASCADE, related_name='college_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='college_courses')
    fees_per_year = models.IntegerField(default=0)
    seats_available = models.IntegerField(default=0)

    class Meta:
        db_table = 'college_courses'
        unique_together = ('college', 'course')
