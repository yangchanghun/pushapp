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
        Professors,
        on_delete=models.SET_NULL,   # 🔥 교수 삭제해도 visitor 데이터 유지
        null=True,                   # 🔥 SET_NULL 위해 필수
        blank=True,
        related_name="visitors"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='대기')
    created_at = models.DateTimeField(auto_now_add=True)
    is_checked = models.BooleanField(default=False) # 경비원 확인 여부
    # ✅ 토큰 추가
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    is_agreed = models.BooleanField(default=False)
    # agreed_at = models.DateTimeField(null=True, blank=True)
    
    company_name = models.CharField(max_length=100, null=True, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    car_number = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        prof_name = self.professor.name if self.professor else "담당자 없음"
        return f"{self.name} → {prof_name} ({self.status})"
