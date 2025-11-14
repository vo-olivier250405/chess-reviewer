from api.models import Game
from api.views import BaseViewSet
from api.serializers import (
    LiteGameSerializer,
    GameCreateSerializer,
    BaseGameSerializer,
    AnalyzeGameSerializer,
)
from api.tasks import analyze_pgn
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from os import environ


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

        analyze_pgn.delay(
            user=self.user.id,
            analyzer_api_url=analyzer_api_url,
            pgn=pgn,
            name=name,
        )
        return Response(
            "Your game analysis is in progress.",
            status=status.HTTP_202_ACCEPTED,
        )
