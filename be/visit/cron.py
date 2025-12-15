from django.utils import timezone
from datetime import timedelta
from .models import Visitors

def delete_expired_visitors():
    print("🗑 CRON: 개인정보 5년 경과 방문자 삭제 실행")

    threshold = timezone.now() - timedelta(days=365 * 5)
    count, _ = Visitors.objects.filter(created_at__lt=threshold).delete()

    print(f"🗑 CRON: {count}건 삭제 완료")