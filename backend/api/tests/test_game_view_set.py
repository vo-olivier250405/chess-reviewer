import pytest
import secrets
from unittest.mock import patch
from unittest import TestCase
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
from api.tasks import analyze_pgn

User = get_user_model()


@pytest.mark.django_db
class TestGameAPI(TestCase):

    def setUp(self):
        self.client = APIClient()
        test_password = secrets.token_urlsafe(16)
        self.user = User.objects.create_user(
            username="testuser", password=test_password
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

    @patch.object(analyze_pgn, "delay")
    def test_should_reject_analysis_when_env_missing(self, mock_delay):
        with patch.dict(
            "os.environ", {"ANALYZER_API_TOKEN": "", "ANALYZER_API_URL": ""}
        ):
            game_count_before = Game.objects.count()
            user_notifications_before = self.user.notifications.count()
            data = {"pgn": "1. e4 e5", "name": "Broken"}

            response = self.client.post(self.analyze_url, data, format="json")
            game_count_after = Game.objects.count()
            user_notifications_after = self.user.notifications.count()

            self.assertEqual(response.status_code, 500, "Expected status code 500")
            self.assertEqual(
                game_count_before, game_count_after, "Game count should not change"
            )
            self.assertEqual(
                user_notifications_before,
                user_notifications_after,
                "Notification count should not change",
            )
            mock_delay.assert_not_called()
