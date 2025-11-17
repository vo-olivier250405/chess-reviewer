from django.core.exceptions import ValidationError
import re

MAX_PGN_SIZE = 100_000  # 100 KB

PGN_BASIC_PATTERN = re.compile(r"(\[\w+\s+\".*?\"\])|(\d+\.\s*\S+)", re.DOTALL)


def validate_pgn(value: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError("PGN must be a non-empty string.")

    elif len(value) > MAX_PGN_SIZE:
        raise ValidationError(
            f"PGN is too large ({len(value)} bytes). Limit is {MAX_PGN_SIZE} bytes."
        )

    forbidden_patterns = [
        r"<script\b",
        r"</script>",
        r"SELECT\s",
        r"INSERT\s",
        r"DELETE\s",
        r"UPDATE\s",
        r"DROP\s",
        r"\b(function|=>)\b",
    ]

    for pattern in forbidden_patterns:
        if re.search(pattern, value, re.IGNORECASE):
            raise ValidationError("PGN contains forbidden or dangerous content.")

    if not PGN_BASIC_PATTERN.search(value):
        raise ValidationError(
            "Invalid PGN format. Ensure it contains valid tags or move sequences."
        )

    return value
