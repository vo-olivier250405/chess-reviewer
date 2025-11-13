from api.models import Game
from api.views import BaseViewSet
from api.serializers import (
    LiteGameSerializer,
    GameCreateSerializer,
    BaseGameSerializer,
    AnalyzeGameSerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from os import environ
from requests import post


class GameViewSet(BaseViewSet):

    def get_serializer_class(self):
        if self.action in ["create"]:
            return GameCreateSerializer
        elif self.action in ["list"]:
            return LiteGameSerializer
        elif self.action == "analyze":
            return AnalyzeGameSerializer
        return BaseGameSerializer

    def get_queryset(self):
        if self.user:
            return Game.objects.all().filter(user=self.user)
        return Game.objects.none()

    @action(detail=False, methods=["post"])
    def analyze(self, request):
        analyzer_api_url = environ.get("ANALYZER_API_URL")
        if not analyzer_api_url:
            return Response(
                {"error": "Analyzer API URL is not configured."},
                status=500,
            )

        pgn = request.data.get("pgn", "")
        name = request.data.get("name", "Untitled Game")
        try:
            response = post(
                f"{analyzer_api_url}/analyze/",
                json={"pgn": pgn},
            )
            response.raise_for_status()
        except Exception as e:
            return Response(
                {"error": f"Failed to connect to Analyzer API: {str(e)}"},
                status=502,
            )

        data = response.json()
        analyzed_game = data.get("analyzedPositions", {})
        Game.objects.create(
            name=name,
            user=self.user,
            accuracies=analyzed_game.get("accuracies", {}),
            classifications=analyzed_game.get("classifications", {}),
            positions=analyzed_game.get("positions", {}),
        )
        return Response(analyzed_game, status=response.status_code)
