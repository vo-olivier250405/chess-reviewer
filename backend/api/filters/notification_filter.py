import django_filters
from api.models import Notification


class NotificationFilter(django_filters.FilterSet):

    user = django_filters.UUIDFilter(field_name="user__id")
    is_read = django_filters.BooleanFilter(field_name="is_read")
    title = django_filters.CharFilter(field_name="title", lookup_expr="icontains")
    message = django_filters.CharFilter(field_name="message", lookup_expr="icontains")

    created_at = django_filters.DateTimeFromToRangeFilter(field_name="created_at")
    updated_at = django_filters.DateTimeFromToRangeFilter(field_name="updated_at")

    class Meta:
        model = Notification
        fields = [
            "user",
            "is_read",
            "title",
            "message",
            "created_at",
            "updated_at",
        ]
