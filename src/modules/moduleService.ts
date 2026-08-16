import { randomUUID } from 'node:crypto';
import { createModule as saveModule } from './moduleRepository';
import { listModule  as findAllModules} from './moduleRepository';
import  { deleteModule as removeModules } from './moduleRepository';
import { updateModule as updateModuleRepository } from './moduleRepository';

import type { UpdateModuleInput, CreateModuleInput, Module } from './moduleType';

export function createModule(input: CreateModuleInput): Module  {
    const name = input.name.trim();
    const acronym = input.acronym.trim();
    const summary = (input.summary ?? "").trim();
    const tag = "";

    if(!name || !acronym) {
        throw new Error("Nome e sigla precisam estar preenchidos!")
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

export function listModules(): Module[] {
    return  findAllModules();
}

export function deleteModule(id: string): boolean {
    const normalizedId = id.trim()

    if(!normalizedId) {
        throw new Error("O ID do módulo é obrigatório")
    }

    const deleted = removeModules(normalizedId)

    if(!deleted) {
        throw new Error("Módulo não encontrado!")
    }

    return true
}

export function updateModule(input: UpdateModuleInput): Module {
    const id = input.id.trim()
    const name = input.name.trim()
    const acronym = input.acronym.trim()
    const summary = (input.summary ?? "").trim()
    const tag = ""

    if(!id) {
        throw new Error("O ID do módulo é obrigatório!")
    }
    if(!name || !acronym) {
        throw new Error("Nome e sigla precisam estar preenchidos!")
    }

    const updatedModule: Module = {
        id,
        name,
        acronym,
        summary,
        tag,
        createdAt: input.createdAt,
        updatedAt: new Date().toISOString()
    }

    return updateModuleRepository(updatedModule)
}
