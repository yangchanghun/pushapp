import django_filters
from django.utils.timezone import make_aware
from datetime import datetime
from .models import Visitors


class VisitorsFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(method="filter_start_date")
    end_date = django_filters.DateFilter(method="filter_end_date")

    class Meta:
        model = Visitors
        fields = ["status", "is_checked", "professor"]

    def filter_start_date(self, queryset, name, value):
        # YYYY-MM-DD → 00:00:00
        start_dt = make_aware(datetime.combine(value, datetime.min.time()))
        return queryset.filter(created_at__gte=start_dt)

    def filter_end_date(self, queryset, name, value):
        # YYYY-MM-DD → 23:59:59
        end_dt = make_aware(datetime.combine(value, datetime.max.time()))
        return queryset.filter(created_at__lte=end_dt)
