import Database from "better-sqlite3"; // import da biblioteca que controla o sqlite
import path from "node:path"; // biblioteca para construir caminhos no node (compativel com mac, windows e linux)

let database : Database.Database | null = null; // Reservando uma variavel para conexao com o sqlite

export function getDatabase() {
    if(database){ 
        return database 
    } // verificamos se já existe uma conexao. Se houver, retornamos o database

    const databasePath = path.join(
        process.cwd(),
        "database",
        "neurodesk-dev.db"
    ) // aqui pegamos onde o projeto está e pegamos o caminho do arquivo neurodesk-dev.db

    database = new Database(databasePath); // estou passando um path para o Database, ele entra em contato com o sqlite. O sqlite retorna uma conexão e coloca dentro da database

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
            position integer not null,
            created_at text not null, 
            updated_at text not null,
            foreign key (module_id) 
            references modules(id)
            on delete cascade
        )
    `)
}