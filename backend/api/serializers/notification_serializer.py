from api.serializers import BaseSerializer, UserSerializer
from api.models import Notification


class NotificationSerializer(BaseSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "is_read",
            "user",
            "title",
            "message",
            "object_type",
            "object_id",
            "redirection",
            "created_at",
        ]


class NotificationUpdateSerializer(BaseSerializer):
    class Meta:
        model = Notification
        fields = ["is_read"]
