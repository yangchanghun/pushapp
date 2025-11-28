from django.utils import timezone
from datetime import timedelta
from .models import Visitors

def delete_expired_visitors():
    print("🗑 CRON: 방문자 자동 삭제 실행됨!")

    threshold = timezone.now() - timedelta(days=30)
    count, _ = Visitors.objects.filter(created_at__lt=threshold).delete()

    print(f"🗑 CRON: {count}건 삭제 완료")
