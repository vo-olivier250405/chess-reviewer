from rest_framework import serializers
from api.serializers import BaseSerializer, UserSerializer
from api.models import Game
from api.validators import (
    validate_classifications,
    validate_accuracies,
    validate_positions,
    validate_pgn,
)


class BaseGameSerializer(BaseSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Game
        fields = [
            "id",
            "name",
            "user",
            "accuracies",
            "classifications",
            "positions",
        ]


class LiteGameSerializer(BaseGameSerializer):

    class Meta:
        model = Game
        fields = [
            "id",
            "name",
            "user",
            "accuracies",
        ]


class GameCreateSerializer(BaseGameSerializer):

    def validate(self, attrs):
        classifications = attrs.get("classifications")
        accuracies = attrs.get("accuracies")
        positions = attrs.get("positions")

        if classifications:
            validate_classifications(classifications)
        if accuracies:
            validate_accuracies(accuracies)
        if positions:
            validate_positions(positions)

        return super().validate(attrs)


class AnalyzeGameSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    pgn = serializers.CharField(required=True)

    def validate_pgn(self, value):
        return validate_pgn(value)
