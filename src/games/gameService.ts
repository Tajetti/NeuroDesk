import { randomUUID } from "node:crypto"
import { createGame as saveGame, deleteGame as removeGame, listGames as findGames, updateGame as saveGameChanges } from "./gameRepository"
import type { CreateGameInput, GameProject, UpdateGameInput } from "./gameType"

function createDefaultConfig(type: CreateGameInput["type"]): GameProject["config"] {
    const backgroundColor = "#eef6f8"
    if (type === "quiz") return {
        kind: "quiz",
        backgroundColor,
        questions: [{ id: randomUUID(), prompt: "Qual é a resposta correta?", options: ["Resposta A", "Resposta B", "Resposta C"], correctIndex: 0 }]
    }
    if (type === "true-false") return {
        kind: "true-false",
        backgroundColor,
        statements: [{ id: randomUUID(), text: "Digite uma afirmação", answer: true, explanation: "Explique a resposta" }]
    }
    if (type === "association") return {
        kind: "association",
        backgroundColor,
        pairs: [
            { id: randomUUID(), left: "Gato", right: "Animal" },
            { id: randomUUID(), left: "Maçã", right: "Fruta" }
        ]
    }
    if (type === "flashcards") return {
        kind: "flashcards",
        backgroundColor,
        cards: [
            { id: randomUUID(), front: "Pergunta ou conceito", back: "Resposta ou explicação" },
            { id: randomUUID(), front: "Segundo conceito", back: "Segunda resposta" }
        ]
    }
    if (type === "sequence") return {
        kind: "sequence",
        backgroundColor,
        items: ["Primeiro passo", "Segundo passo", "Terceiro passo"].map((text) => ({ id: randomUUID(), text }))
    }
    if (type === "scramble") return {
        kind: "scramble",
        backgroundColor,
        words: [
            { id: randomUUID(), word: "ESCOLA", hint: "Lugar onde aprendemos" },
            { id: randomUUID(), word: "LIVRO", hint: "Tem páginas e histórias" }
        ]
    }
    if (type === "wheel") return {
        kind: "wheel",
        backgroundColor,
        options: ["Pergunta 1", "Pergunta 2", "Desafio", "Pausa"].map((text) => ({ id: randomUUID(), text }))
    }
    if (type === "fill-blank") return {
        kind: "fill-blank",
        backgroundColor,
        items: [
            { id: randomUUID(), sentence: "A água congela a ___ graus Celsius.", answer: "zero" },
            { id: randomUUID(), sentence: "O Brasil fica na América do ___.", answer: "Sul" }
        ]
    }
    if (type === "categories") return {
        kind: "categories",
        backgroundColor,
        groups: [
            { id: randomUUID(), name: "Animais", items: ["Gato", "Cachorro"] },
            { id: randomUUID(), name: "Frutas", items: ["Maçã", "Banana"] }
        ]
    }
    if (type === "bingo") return {
        kind: "bingo",
        backgroundColor,
        words: ["Escola", "Livro", "Lápis", "Caderno", "Professora", "Aluno", "Leitura", "Recreio", "Tarefa"].map((text) => ({ id: randomUUID(), text }))
    }
    if (type === "rapid-response") return {
        kind: "rapid-response",
        backgroundColor,
        prompts: [
            { id: randomUUID(), question: "Qual é a capital do Brasil?", answer: "Brasília" },
            { id: randomUUID(), question: "Quanto é 5 + 5?", answer: "10" }
        ]
    }
    return {
        kind: "memory",
        backgroundColor,
        pairs: Array.from({ length: 3 }, (_, index) => ({ id: randomUUID(), label: `Par ${index + 1}`, imageUrl: "" }))
    }
}

export function createGame(input: CreateGameInput): GameProject {
    const name = input.name.trim()
    if (!name) throw new Error("O nome do jogo é obrigatório")

    const now = new Date().toISOString()
    return saveGame({
        id: randomUUID(),
        name,
        type: input.type,
        config: createDefaultConfig(input.type),
        createdAt: now,
        updatedAt: now
    })
}

export function listGames() {
    return findGames()
}

export function updateGame(input: UpdateGameInput): GameProject {
    const id = input.id.trim()
    const name = input.name.trim()
    if (!id) throw new Error("O ID do jogo é obrigatório")
    if (!name) throw new Error("O nome do jogo é obrigatório")
    if (input.config.kind === "memory" && input.config.pairs.length < 2) throw new Error("O jogo precisa de pelo menos dois pares")
    if (input.config.kind === "association" && input.config.pairs.length < 2) throw new Error("A associação precisa de pelo menos dois pares")
    return saveGameChanges(id, name, input.config, new Date().toISOString())
}

export function deleteGame(id: string): boolean {
    if (!id.trim()) throw new Error("O ID do jogo é obrigatório")
    if (!removeGame(id.trim())) throw new Error("Jogo não encontrado")
    return true
}
