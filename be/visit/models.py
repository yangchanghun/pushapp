import uuid
from django.db import models
from professors.models import Professors

class Visitors(models.Model):
    STATUS_CHOICES = [
        ('대기', '대기'),
        ('수락', '수락'),
        ('거절', '거절'),
    ]

    name = models.CharField(max_length=100)
    phonenumber = models.CharField(max_length=20)
    visit_purpose = models.CharField(max_length=255)
    professor = models.ForeignKey(
        Professors, on_delete=models.CASCADE, related_name="visitors"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='대기')
    created_at = models.DateTimeField(auto_now_add=True)
    is_checked = models.BooleanField(default=False)
    # ✅ 토큰 추가
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    def __str__(self):
        return f"{self.name} → {self.professor.name} ({self.status})"
