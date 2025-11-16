from api.models import Notification, User


def create_error_notification(user: User, error: Exception) -> Notification:
    title = str(error.__class__.__name__)
    message = str(error)
    object_type = "error"

    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        object_type=object_type,
    )
