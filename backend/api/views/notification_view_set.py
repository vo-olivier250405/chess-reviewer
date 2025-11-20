from api.models import Notification
from api.views import BaseViewSet
from api.serializers import NotificationSerializer, NotificationUpdateSerializer
from api.filters import NotificationFilter


class NotificationViewSet(BaseViewSet):
    filterset_class = NotificationFilter

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return NotificationUpdateSerializer
        return NotificationSerializer

    def get_queryset(self):
        if self.user:
            return (
                Notification.objects.all()
                .filter(user=self.user)
                .order_by("-created_at")
            )
        return Notification.objects.none()
