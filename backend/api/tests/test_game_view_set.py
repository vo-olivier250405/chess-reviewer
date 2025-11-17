import pytest
from unittest.mock import patch
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from knox.models import AuthToken
from api.models import Game
from api.tests.utils import (
    get_accuracies_only,
    get_classifications_only,
    get_positions_only,
)

User = get_user_model()


@pytest.mark.django_db
class TestGameAPI:

    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="password123"
        )
        self.token = AuthToken.objects.create(self.user)[1]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token}")

        self.games_url = reverse("game-list")
        self.analyze_url = reverse("game-analyze")

        self.mock_accuracies = get_accuracies_only()
        self.mock_classifications = get_classifications_only()
        self.mock_positions = get_positions_only()
        self.mock_game_data = {
            "name": "Test Game",
            "accuracies": self.mock_accuracies,
            "classifications": self.mock_classifications,
            "positions": self.mock_positions,
        }


def test_should_create_game(self):
    data = {
        "name": "My Game",
        "accuracies": self.mock_accuracies,
        "classifications": self.mock_classifications,
        "positions": self.mock_positions[:2],
    }

    response = self.client.post(self.games_url, data, format="json")

    assert response.status_code == 201
    assert Game.objects.count() == 1
    assert Game.objects.first().name == "My Game"
    assert Game.objects.first().user == self.user


@patch("api.tasks.analyze_pgn.delay")
def test_should_reject_analysis_when_env_missing(self, mock_delay, settings):
    settings.ANALYZER_API_TOKEN = None
    game_count_before = Game.objects.count()
    user_notifications_before = self.user.notifications.count()
    data = {"pgn": "1. e4 e5", "name": "Broken"}

    response = self.client.post(self.analyze_url, data, format="json")
    game_count_after = Game.objects.count()
    user_notifications_after = self.user.notifications.count()

    assert response.status_code == 500
    assert game_count_before == game_count_after
    assert user_notifications_before == user_notifications_after
    mock_delay.assert_not_called()
