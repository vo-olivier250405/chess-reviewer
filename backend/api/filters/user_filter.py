import django_filters
from api.models import User


class UserFilter(django_filters.FilterSet):

    created_at = django_filters.DateTimeFromToRangeFilter(field_name="created_at")
    updated_at = django_filters.DateTimeFromToRangeFilter(field_name="updated_at")

    class Meta:
        model = User
        fields = ["created_at", "updated_at"]
