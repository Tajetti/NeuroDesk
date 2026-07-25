import { randomUUID } from 'node:crypto';
import { createModule as saveModule } from './moduleRepository';
import type { CreateModuleInput, Module } from './moduleType';

export function createModule(input: CreateModuleInput): Module  {
    const name = input.name.trim();
    const acronym = input.acronym.trim();
    const summary = input.summary.trim();
    const tag = input.tag.trim();

    if(!name || !acronym || !summary) {
        throw new Error("Todos os campos precisam estar preenchidos!")
    }

    const now = new Date().toISOString()

    const module: Module = {
        id: randomUUID(),
        name,
        acronym,
        summary,
        tag,
        createdAt: now,
        updatedAt:now
    }

    return saveModule(module)
}