import { getDatabase } from "../database/connection"
import type { GameConfig, GameProject, GameType } from "./gameType"

type GameRow = {
    id: string
    name: string
    type: GameType
    config: string
    created_at: string
    updated_at: string
}

function mapGame(row: GameRow): GameProject {
    const storedConfig = JSON.parse(row.config) as Record<string, unknown>
    const config = typeof storedConfig.kind === "string" ? storedConfig : { ...storedConfig, kind: row.type }
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        config: config as GameConfig,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }
}

export function createGame(game: GameProject): GameProject {
    getDatabase().prepare(`
        INSERT INTO game_projects(id, name, type, config, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(game.id, game.name, game.type, JSON.stringify(game.config), game.createdAt, game.updatedAt)
    return game
}

export function listGames(): GameProject[] {
    const rows = getDatabase().prepare(`
        SELECT id, name, type, config, created_at, updated_at
        FROM game_projects
        ORDER BY updated_at DESC
    `).all() as GameRow[]
    return rows.map(mapGame)
}

export function updateGame(id: string, name: string, config: GameConfig, updatedAt: string): GameProject {
    const row = getDatabase().prepare(`
        UPDATE game_projects
        SET name = ?, config = ?, updated_at = ?
        WHERE id = ?
        RETURNING id, name, type, config, created_at, updated_at
    `).get(name, JSON.stringify(config), updatedAt, id) as GameRow | undefined

    if (!row) throw new Error("Jogo não encontrado")
    return mapGame(row)
}

export function deleteGame(id: string): boolean {
    return getDatabase().prepare("DELETE FROM game_projects WHERE id = ?").run(id).changes > 0
}
