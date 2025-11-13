from django.core.exceptions import ValidationError
from api.models.switches import CLASSIFICATION_TYPES


def validate_positions(value):
    """
    Validate that the positions field is a list of strings representing FEN positions.
    """
    if not isinstance(value, list):
        raise ValidationError("Positions must be a list")

    for index, position in enumerate(value):
        # Validate position structure
        if "fen" not in position or not "move" in position:
            raise ValidationError(
                f"Each position must contain 'fen' and 'move' keys (error at index {index})"
            )
        if "move" in position:
            if "uci" not in position["move"] or "san" not in position["move"]:
                raise ValidationError(
                    f"Each move must contain 'uci' and 'san' keys (error at index {index})"
                )

        # Validate Evaluated position structure
        if "topLines" in position:
            # Validate topLines structure
            top_lines = position["topLines"]
            if not isinstance(top_lines, list):
                raise ValidationError(
                    f"'topLines' must be a list (error at index {index})"
                )
            for line_index, line in enumerate(top_lines):
                if (
                    "id" not in line
                    or "depth" not in line
                    or "moveSAN" not in line
                    or "evaluation" not in line
                ):
                    raise ValidationError(
                        f"Each topLine must contain 'id', 'depth', 'evaluation', and 'moveSAN' keys (error at index {index}, line {line_index})"
                    )

                evaluation = line["evaluation"]
                if not isinstance(evaluation, dict):
                    raise ValidationError(
                        f"'evaluation' must be an object/dictionary (error at index {index}, line {line_index})"
                    )
                if "type" not in evaluation or "value" not in evaluation:
                    raise ValidationError(
                        f"'evaluation' must contain 'type' and 'value' keys (error at index {index}, line {line_index})"
                    )
                if evaluation["type"] not in ["cp", "mate"]:
                    raise ValidationError(
                        f"'evaluation.type' must be either 'cp' or 'mate' (error at index {index}, line {line_index})"
                    )
                if not isinstance(evaluation["value"], int):
                    raise ValidationError(
                        f"'evaluation.value' must be an integer (error at index {index}, line {line_index})"
                    )

        # Validate opening structure
        if "opening" in position:
            opening = position["opening"]
            if "name" not in opening or "fen" not in opening:
                raise ValidationError(
                    f"'opening' must contain 'name' and 'fen' keys (error at index {index})"
                )

        # Validate classification structure
        if "classification" in position:
            classification = position["classification"]
            if not isinstance(classification, str):
                raise ValidationError(
                    f"'classification' must be a string (error at index {index})"
                )
            if not classification not in CLASSIFICATION_TYPES:
                raise ValidationError(
                    f"'classification' must be one of {CLASSIFICATION_TYPES} (error at index {index})"
                )

    return value
