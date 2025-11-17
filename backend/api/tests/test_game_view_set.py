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
        self.auth_header = {"HTTP_AUTHORIZATION": f"Token {self.token}"}
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

    # def test_should_block_access_without_auth(self):
    #     response = self.client.get(self.games_url)
    #     assert response.status_code == 401

    # def test_should_list_user_games(self):
    #     Game.objects.create(
    #         name="Test Game",
    #         user=self.user,
    #         accuracies=self.mock_accuracies,
    #         classifications=self.mock_classifications,
    #         positions=self.mock_positions,
    #     )

    #     response = self.client.get(self.games_url, **self.auth_header)

    #     assert response.status_code == 200
    #     assert len(response.data["data"]) == 1
    #     assert response.data["data"][0]["name"] == "Test Game"

    # def test_should_return_empty_list_for_new_user(self):
    #     response = self.client.get(self.games_url, **self.auth_header)
    #     assert response.status_code == 200
    #     assert response.data["data"] == []

    def test_should_create_game(self):
        data = {
            "name": "My Game",
            "accuracies": self.mock_accuracies,
            "classifications": self.mock_classifications,
            "positions": self.mock_positions[:2],
        }

        response = self.client.post(
            self.games_url, data, format="json", **self.auth_header
        )

        assert response.status_code == 201
        assert Game.objects.count() == 1
        assert Game.objects.first().name == "My Game"
        assert Game.objects.first().user == self.user

    # def test_should_fail_with_invalid_data(self):
    #     data = {"name": "", "accuracies": {}, "classifications": {}, "positions": []}

    #     response = self.client.post(
    #         self.games_url, data, format="json", **self.auth_header
    #     )

    #     assert response.status_code == 400

    # @patch("api.views.analyze_pgn.delay")
    # def test_should_trigger_analysis_task(self, mock_delay):
    #     data = {"pgn": "1. e4 e5 2. Nf3 Nc6", "name": "Analyze Game"}

    #     response = self.client.post(
    #         self.analyze_url, data, format="json", **self.auth_header
    #     )

    #     assert response.status_code == 202
    #     mock_delay.assert_called_once()

    @patch("api.views.analyze_pgn.delay")
    def test_should_reject_analysis_when_env_missing(
        self,
        mock_delay,
        settings,
    ):
        settings.ANALYZER_API_TOKEN = None
        game_count_before = Game.objects.count()
        user_notifications_before = self.user.notifications.count()
        data = {"pgn": "1. e4 e5", "name": "Broken"}

        response = self.client.post(
            self.analyze_url, data, format="json", **self.auth_header
        )
        game_count_after = Game.objects.count()
        user_notifications_after = self.user.notifications.count()

        assert response.status_code == 500
        assert game_count_before == game_count_after
        assert user_notifications_before == user_notifications_after

        mock_delay.assert_not_called()
