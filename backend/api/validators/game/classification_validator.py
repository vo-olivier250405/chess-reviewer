from django.core.exceptions import ValidationError
from api.models.switches import CLASSIFICATION_TYPES


def validate_classifications(value):
    """
    Validate that all classifications field follows the expected structure:
    {
        "white": {"blunder": int, "mistake": int, ...},
        "black": {"blunder": int, "mistake": int, ...}
    }
    """
    if not isinstance(value, dict):
        raise ValidationError("Classifications doit être un objet/dictionnaire")

    if "white" not in value or "black" not in value:
        raise ValidationError(
            "Classifications must contain the keys 'white' and 'black'"
        )

    for color in ["white", "black"]:
        color_data = value[color]

        if not isinstance(color_data, dict):
            raise ValidationError(
                f"Classifications.{color} must be an object/dictionary"
            )

        for classification_type in CLASSIFICATION_TYPES:
            if classification_type not in color_data:
                raise ValidationError(
                    f"Classifications.{color} must contain the key '{classification_type}'"
                )

            count = color_data[classification_type]
            if not isinstance(count, int) or count < 0:
                raise ValidationError(
                    f"Classifications.{color}.{classification_type} must be a non-negative integer"
                )

        extra_keys = set(color_data.keys()) - set(CLASSIFICATION_TYPES)
        if extra_keys:
            raise ValidationError(
                f"Classifications.{color} contains unauthorized keys: {extra_keys}"
            )

    extra_keys = set(value.keys()) - {"white", "black"}
    if extra_keys:
        raise ValidationError(
            f"Classifications contains unauthorized keys: {extra_keys}"
        )

    return value
