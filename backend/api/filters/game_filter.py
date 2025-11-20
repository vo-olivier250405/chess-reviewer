import django_filters
from api.models import Game


class GameFilter(django_filters.FilterSet):

    user = django_filters.UUIDFilter(field_name="user__id")

    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    created_at = django_filters.DateTimeFromToRangeFilter(field_name="created_at")
    updated_at = django_filters.DateTimeFromToRangeFilter(field_name="updated_at")
    accuracies = django_filters.CharFilter(method="filter_accuracies")

    class Meta:
        model = Game
        fields = [
            "user",
            "accuracies",
            "created_at",
            "updated_at",
        ]

    def filter_accuracies(self, queryset, name, value):
        if not value:
            return queryset

        white_accuracy = queryset.filter(accuracies__white__icontains=value)
        black_accuracy = queryset.filter(accuracies__black__icontains=value)

        return white_accuracy | black_accuracy
