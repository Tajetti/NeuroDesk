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