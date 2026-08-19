import Database from "better-sqlite3"; // import da biblioteca que controla o sqlite
import path from "node:path"; // biblioteca para construir caminhos no node (compativel com mac, windows e linux)
import { mkdirSync } from "node:fs";
import { app } from "electron";

let database : Database.Database | null = null; // Reservando uma variavel para conexao com o sqlite

export function getDatabase() {
    if(database){
        return database
    } // verificamos se já existe uma conexao. Se houver, retornamos o database

    const databaseDirectory = path.join(app.getPath("userData"), "database")
    mkdirSync(databaseDirectory, { recursive: true })

    const databasePath = path.join(
        databaseDirectory,
        "neurodesk.db"
    ) // pasta de dados do usuário do próprio SO (userData), separada do diretório do projeto

    database = new Database(databasePath); // estou passando um path para o Database, ele entra em contato com o sqlite. O sqlite retorna uma conexão e coloca dentro da database
    database.pragma("foreign_keys = ON")

    return database; // retornamos o database
}

export function initializeDatabase() {
    const database = getDatabase();

    database.exec(`
        CREATE TABLE IF NOT EXISTS modules(
            id UUID primary key,
            name text not null,
            acronym text not null,
            summary text not null,
            tag text not null,
            created_at text not null,
            updated_at text not null
        )
    `);

    database.exec(`
        create table if not exists sections(
            id text primary key,
            module_id text not null,
            name text not null, 
            content text not null default '[{"type":"paragraph","content":""}]',
            position integer not null,
            created_at text not null, 
            updated_at text not null,
            foreign key (module_id) 
            references modules(id)
            on delete cascade
        )
    `)

    const sectionColumns = database.pragma("table_info(sections)") as Array<{ name: string }>
    const hasContentColumn = sectionColumns.some((column) => column.name === "content")

    if (!hasContentColumn) {
        database.exec(`
            ALTER TABLE sections
            ADD COLUMN content TEXT NOT NULL DEFAULT '[{"type":"paragraph","content":""}]'
        `)
    }

    database.exec(`
        CREATE TABLE IF NOT EXISTS notes(
            id TEXT PRIMARY KEY,
            section_id TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (section_id)
            REFERENCES sections(id)
            ON DELETE CASCADE
        )
    `)

    if (!hasContentColumn) {
        database.exec(`
            UPDATE sections
            SET content = COALESCE(
                (
                    SELECT notes.content
                    FROM notes
                    WHERE notes.section_id = sections.id
                    ORDER BY notes.updated_at DESC
                    LIMIT 1
                ),
                content
            )
        `)
    }

    database.exec(`
        CREATE TABLE IF NOT EXISTS game_projects(
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            config TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    `)
}
