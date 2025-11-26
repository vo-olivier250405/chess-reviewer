from api.models import Notification, Game, User


def create_game_analyzed_notification(
    user: User,
    game: Game,
    label: str = "View details",
) -> Notification:
    title = "Game Analysis Complete"
    message = f"Your analysis for the game '{game.name}' is complete. You can now review the results."
    object_type = "game"
    object_id = game.id
    redirection = {"url": f"/games/{game.id}/", "label": label}

    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        object_type=object_type,
        object_id=object_id,
        redirection=redirection,
    )
