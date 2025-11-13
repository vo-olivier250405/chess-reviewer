import uuid
from django.db import models
from django.conf import settings
from api.validators import (
    validate_classifications,
    validate_accuracies,
    validate_positions,
)


class Game(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(max_length=255, null=False, blank=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="games",
    )
    accuracies = models.JSONField(
        null=False,
        blank=False,
        validators=[validate_accuracies],
    )
    classifications = models.JSONField(
        null=False,
        blank=False,
        validators=[validate_classifications],
    )
    positions = models.JSONField(
        null=False,
        blank=False,
        validators=[validate_positions],
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
