import { getDatabase } from "../database/connection";
import type { Module } from "./moduleType";

export function createModule(module: Module) {
    const database = getDatabase()

    const statement = database.prepare(`
        INSERT INTO modules(
            id, name, acronym, summary, tag, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    statement.run(
        module.id,
        module.name,
        module.acronym,
        module.summary,
        module.tag,
        module.createdAt,
        module.updatedAt
    )

    return module
}

type ModuleRow = {
    id: string,
    name: string,
    acronym: string,
    summary: string,
    tag: string,
    created_at: string,
    updated_at: string
}

export function listModule(): Module[] {
    const database = getDatabase()

    const statement = database.prepare(`
        SELECT 
            id,
            name,
            acronym,
            summary,
            tag,
            created_at,
            updated_at
            FROM modules
            ORDER BY created_at DESC
    `)
    const rows = statement.all() as ModuleRow[];

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        acronym: row.acronym,
        summary: row.summary,
        tag: row.tag,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }));
}

export function deleteModule(id: string): boolean {
    const database = getDatabase()

    const statement = database.prepare(`
        DELETE FROM modules 
        WHERE id = ?
    `)

    const result = statement.run(id)

    return result.changes > 0
}

export function updateModule(module: Module): Module {
    const database = getDatabase()

    const statement = database.prepare(`
        UPDATE modules
            SET name = ?, acronym = ?, summary = ?, tag = ?, updated_at = ?
            WHERE id = ?
    `)

    const result = statement.run(
        module.name,
        module.acronym,
        module.summary,
        module.tag,
        module.updatedAt,
        module.id,
    )

    if(result.changes === 0) {
        throw new Error("Módulo não encontrado")
    }

    return module
}