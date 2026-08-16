import { getDatabase } from "../database/connection";
import type { Section } from "./sectionType";

type NextPositionRow = {
    next_position: number
}

type SectionRow = {
    id: string,
    module_id: string,
    name: string,
    content: string,
    position: number,
    created_at: string,
    updated_at: string
}

export function createSection(section: Section): Section {
    const database = getDatabase()

    const statement = database.prepare(`
        INSERT INTO sections(
            id, module_id, name, content, position, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    statement.run(
        section.id,
        section.moduleId,
        section.name,
        section.content,
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
        SELECT id, module_id, name, content, position, created_at, updated_at
        FROM sections 
        WHERE module_id = ? 
        ORDER BY position ASC
    `)

    const rows = statement.all(moduleId) as SectionRow[]

    return rows.map((row) => ({
        id: row.id,
        moduleId: row.module_id,
        name: row.name,
        content: row.content,
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

export function updateSection(id: string, name: string, updated_at: string) : Section{
    const database = getDatabase()

    const statement = database.prepare(`
        UPDATE sections
        SET name = ?, updated_at = ?
        WHERE id = ?
        RETURNING id, name, module_id, content, position, created_at, updated_at
    `)

    const result = statement.get(
        name,
        updated_at,
        id
    ) as SectionRow | undefined

    if(result === undefined) {
        throw new Error("Seção não encontrada")
    }

    return {
        id: result.id,
        name: result.name,
        moduleId: result.module_id,
        content: result.content,
        position: result.position,
        createdAt: result.created_at,
        updatedAt: result.updated_at
    }
}

export function updateSectionContent(id: string, content: string, updatedAt: string): Section {
    const row = getDatabase().prepare(`
        UPDATE sections
        SET content = ?, updated_at = ?
        WHERE id = ?
        RETURNING id, module_id, name, content, position, created_at, updated_at
    `).get(content, updatedAt, id) as SectionRow | undefined

    if (!row) {
        throw new Error("Seção não encontrada")
    }

    return {
        id: row.id,
        moduleId: row.module_id,
        name: row.name,
        content: row.content,
        position: row.position,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }
}
