from api.models import Game
from api.views import BaseViewSet
from api.serializers import (
    LiteGameSerializer,
    GameCreateSerializer,
    BaseGameSerializer,
)


class GameViewSet(BaseViewSet):

    def get_serializer_class(self):
        if self.action in ["create"]:
            return GameCreateSerializer
        elif self.action in ["list"]:
            return LiteGameSerializer
        return BaseGameSerializer

    def get_queryset(self):
        if self.user:
            return Game.objects.all().filter(user=self.user)
        return Game.objects.none()
