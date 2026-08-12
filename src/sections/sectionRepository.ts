import { getDatabase } from "../database/connection";
import type { Section } from "./sectionType";

type NextPositionRow = {
    next_position: number
}

type SectionRow = {
    id: string,
    module_id: string,
    name: string,
    position: number,
    created_at: string,
    updated_at: string
}

export function createSection(section: Section): Section {
    const database = getDatabase()

    const statement = database.prepare(`
        INSERT INTO sections(
            id, module_id, name, position, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
    `)

    statement.run(
        section.id,
        section.moduleId,
        section.name,
        section.position,
        section.createdAt,
        section.updatedAt
    )

    return section
}

export function getNextPosition(moduleId: string): number {
    const database = getDatabase()

    const statement = database.prepare(`
        select COALESCE(MAX(position), 0) + 1 as next_position 
            from sections
            where module_id = ?
    `)

    const position  = statement.get(moduleId) as NextPositionRow

    return position.next_position
}

export function listSection(moduleId: string): Section[] {
    const database = getDatabase()

    const statement = database.prepare(`
        SELECT id, module_id, name, position, created_at, updated_at
        FROM sections 
        WHERE module_id = ? 
        ORDER BY position ASC
    `)

    const rows = statement.all(moduleId) as SectionRow[]

    return rows.map((row) => ({
        id: row.id,
        moduleId: row.module_id,
        name: row.name,
        position: row.position,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }))
}

export function deleteSection (id: string): boolean {
    const database = getDatabase()

    const statement = database.prepare(`
        DELETE FROM sections WHERE id = ?
    `)

    const result = statement.run(id)

    return result.changes > 0
}