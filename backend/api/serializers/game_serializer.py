from api.serializers import BaseSerializer
from api.models import Game
from api.validators import (
    validate_classifications,
    validate_accuracies,
    validate_positions,
)


class GameSerializer(BaseSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class GameCreateSerializer(GameSerializer):

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
