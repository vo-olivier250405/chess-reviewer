export interface AnalyzedMove {
    moveNumber: number
    san: string
    fen: string
    evaluation: Evaluation | null
    comment: Comment | null,
    evalString: string,
}

export type Category = "brillant" | "good" | "inacurracy" | "mistake" | "blender" | "theoretical"

export interface Comment {
    type: Category,
    message: string
}

export interface Evaluation {
    type: "cp" | "mate",
    value: number
}