from django.core.exceptions import ValidationError


def validate_accuracies(value):
    """
    Validate that accuracy values are between 0 and 100.
    """
    if not isinstance(value, dict):
        raise ValidationError("Accuracies must be an object/dictionary")

    for color in ["white", "black"]:
        if color not in value:
            raise ValidationError(f"Accuracies must contain the key '{color}'")

        accuracy = value[color]
        if not isinstance(accuracy, (int, float)):
            raise ValidationError(f"Accuracies.{color} must be a number")

        if not (0 <= accuracy <= 100):
            raise ValidationError(f"Accuracies.{color} must be between 0 and 100")

    extra_keys = set(value.keys()) - {"white", "black"}
    if extra_keys:
        raise ValidationError(f"Accuracies contains unauthorized keys: {extra_keys}")

    return value
