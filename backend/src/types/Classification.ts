export type Classification = "blunder" |
    "mistake" |
    "inaccuracy" |
    "good" |
    "great" |
    "excellent" |
    "brilliant" |
    "forced" |
    "theoretical" |
    "best";

export type ClassificationWithScore = Record<Classification, number>;