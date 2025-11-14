from celery import shared_task
import logging


@shared_task(time_limit=0, soft_time_limit=0)
def analyze_pgn(
    user_id: str,
    token: str,
    analyzer_api_url: str,
    pgn: str,
    name: str = "Untitled Game",
) -> None:
    from api.models import Game, User
    from requests import post

    if analyzer_api_url:
        try:
            headers = {
                "Authorization": f"Token {token}",
                "Content-Type": "application/json",
            }

            response = post(
                f"{analyzer_api_url}/analyze/",
                json={"pgn": pgn},
                headers=headers,
            )
            response.raise_for_status()
        except Exception as e:
            logging.error(f"Failed to connect to Analyzer API: {str(e)}")
            return

        data = response.json()
        analyzed_game = data.get("analyzedPositions", {})

        try:
            user = User.objects.get(id=user_id)
            Game.objects.create(
                name=name,
                user=user,
                accuracies=analyzed_game.get("accuracies", {}),
                classifications=analyzed_game.get("classifications", {}),
                positions=analyzed_game.get("positions", {}),
            )
        except User.DoesNotExist:
            logging.error(f"User with id {user_id} does not exist")
