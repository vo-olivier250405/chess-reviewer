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

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        pgn = serializer.validated_data.get("pgn")
        name = serializer.validated_data.get("name")
        analyzer_api_token = environ.get("ANALYZER_API_TOKEN", "")

        analyze_pgn.delay(
            user_id=str(self.user.id),
            token=analyzer_api_token,
            analyzer_api_url=analyzer_api_url,
            pgn=pgn,
            name=name,
        )
        return Response(
            {"message": "Your game analysis is in progress."},
            status=status.HTTP_202_ACCEPTED,
        )
