from django.core.exceptions import ValidationError


def validate_redirection(value):
    if not isinstance(value, dict):
        raise ValidationError("Redirection URL must be a dict ")

    if "url" not in value:
        raise ValidationError("Redirection URL must contain the key 'url'")

    if "search_params" in value:
        if not isinstance(value["search_params"], dict):
            raise ValidationError("Redirection.search_params must be a dict ")

    if "label" in value:
        if not isinstance(value["label"], str):
            raise ValidationError("Redirection.label must be a string ")
    return value
