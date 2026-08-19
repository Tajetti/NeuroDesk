export type MemoryPair = {
    id: string
    label: string
    imageUrl: string
}

export type MemoryGameConfig = {
    kind: "memory"
    pairs: MemoryPair[]
    backgroundColor: string
}

export type QuizQuestion = {
    id: string
    prompt: string
    options: string[]
    correctIndex: number
}

export type QuizGameConfig = {
    kind: "quiz"
    questions: QuizQuestion[]
    backgroundColor: string
}

export type TrueFalseStatement = {
    id: string
    text: string
    answer: boolean
    explanation: string
}

export type TrueFalseGameConfig = {
    kind: "true-false"
    statements: TrueFalseStatement[]
    backgroundColor: string
}

export type AssociationPair = {
    id: string
    left: string
    right: string
}

export type AssociationGameConfig = {
    kind: "association"
    pairs: AssociationPair[]
    backgroundColor: string
}

export type FlashcardGameConfig = {
    kind: "flashcards"
    cards: Array<{ id: string; front: string; back: string }>
    backgroundColor: string
}

export type SequenceGameConfig = {
    kind: "sequence"
    items: Array<{ id: string; text: string }>
    backgroundColor: string
}

export type ScrambleGameConfig = {
    kind: "scramble"
    words: Array<{ id: string; word: string; hint: string }>
    backgroundColor: string
}

export type WheelGameConfig = {
    kind: "wheel"
    options: Array<{ id: string; text: string }>
    backgroundColor: string
}

export type FillBlankGameConfig = {
    kind: "fill-blank"
    items: Array<{ id: string; sentence: string; answer: string }>
    backgroundColor: string
}

export type CategoriesGameConfig = {
    kind: "categories"
    groups: Array<{ id: string; name: string; items: string[] }>
    backgroundColor: string
}

export type RapidResponseGameConfig = {
    kind: "rapid-response"
    prompts: Array<{ id: string; question: string; answer: string }>
    backgroundColor: string
}

export type VisualChoiceGameConfig = {
    kind: "visual-choice"
    mode: "odd" | "find" | "count" | "missing"
    rounds: Array<{ id: string; prompt: string; options: string[]; correctIndex: number }>
    backgroundColor: string
}

export type RecallSequenceGameConfig = {
    kind: "recall-sequence"
    sequence: string[]
    backgroundColor: string
}

export type PatternGameConfig = {
    kind: "pattern"
    rounds: Array<{ id: string; sequence: string; options: string[]; answer: string }>
    backgroundColor: string
}

export type WordSearchGameConfig = {
    kind: "word-search"
    words: string[]
    directions?: Array<"horizontal" | "vertical" | "diagonal">
    allowReverse?: boolean
    gridRows?: number
    gridColumns?: number
    backgroundColor: string
}

export type ResponseControlGameConfig = {
    kind: "response-control"
    target: string
    distractors: string[]
    rounds: number
    roundSeconds: number
    backgroundColor: string
}

export type SoundMatchGameConfig = {
    kind: "sound-match"
    rounds: Array<{ id: string; sound: string; options: string[]; correctIndex: number }>
    backgroundColor: string
}

export type RhythmGameConfig = {
    kind: "rhythm"
    pattern: number[]
    backgroundColor: string
}

export type ConnectDotsGameConfig = {
    kind: "connect-dots"
    points: Array<{ id: string; x: number; y: number }>
    backgroundColor: string
}

export type FaceBuilderGameConfig = {
    kind: "face-builder"
    emotion: string
    correctEyes: string
    correctMouth: string
    backgroundColor: string
}

export type GameType = "memory" | "quiz" | "true-false" | "association" | "flashcards" | "sequence" | "scramble" | "wheel" | "fill-blank" | "categories" | "rapid-response" | "visual-choice" | "recall-sequence" | "pattern" | "word-search" | "response-control" | "sound-match" | "rhythm" | "connect-dots" | "face-builder"
export type GameConfig = MemoryGameConfig | QuizGameConfig | TrueFalseGameConfig | AssociationGameConfig | FlashcardGameConfig | SequenceGameConfig | ScrambleGameConfig | WheelGameConfig | FillBlankGameConfig | CategoriesGameConfig | RapidResponseGameConfig | VisualChoiceGameConfig | RecallSequenceGameConfig | PatternGameConfig | WordSearchGameConfig | ResponseControlGameConfig | SoundMatchGameConfig | RhythmGameConfig | ConnectDotsGameConfig | FaceBuilderGameConfig

export type GameProject = {
    id: string
    name: string
    type: GameType
    config: GameConfig
    createdAt: string
    updatedAt: string
}

export type CreateGameInput = {
    name: string
    type: GameType
}

export type UpdateGameInput = {
    id: string
    name: string
    config: GameConfig
}
