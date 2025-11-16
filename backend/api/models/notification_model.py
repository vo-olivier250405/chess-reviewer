import uuid
from django.db import models
from django.conf import settings
from api.validators import validate_redirection


class Notification(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    is_read = models.BooleanField(default=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    # Object reference
    object_type = models.CharField(max_length=100, null=True, blank=True)
    object_id = models.UUIDField(null=True, blank=True)

    title = models.CharField(max_length=255, null=False, blank=False)
    message = models.TextField(null=False, blank=False)

    # Redirection data for the client
    redirection = models.JSONField(
        null=True,
        blank=True,
        validators=[validate_redirection],
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        object_type = self.object_type or "No Object"
        return f"{self.title} - {object_type}"
