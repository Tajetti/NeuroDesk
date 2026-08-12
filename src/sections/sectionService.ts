import { randomUUID } from 'node:crypto'

import {  
    createSection as saveSection, 
    getNextPosition, 
    listSection as findSectionsByModule,
    deleteSection as removeSection
} from "./sectionRepository"
import type { CreateSectionInput, Section } from "./sectionType"

export function createSection(input: CreateSectionInput): Section {
    const moduleId = input.moduleId.trim()
    const name = input.name.trim()

    if(!moduleId ) {
        throw new Error("O ID do módulo é necessário")
    } 

    if(!name) {
        throw new Error("O nome da seção é obrigatório")
    }

    const now = new Date().toISOString()

    const section: Section = {
        id: randomUUID(),
        moduleId,
        name,
        position: getNextPosition(moduleId),
        createdAt: now,
        updatedAt: now
    }

    return saveSection(section)
}

export function listSections(moduleId: string): Section[] {
    const normalizedModuleId = moduleId.trim()

    if(!normalizedModuleId) {
        throw new Error("O ID do módulo é necessário")
    }

    return findSectionsByModule(normalizedModuleId)
}

export function deleteSection(id: string) {
    const normalizedId = id.trim()

    if(!normalizedId) {
        throw new Error("O ID da seção é obrigatório")
    }

    const deleted = removeSection(normalizedId)

    if(!deleted) {
        throw new Error("A seção não foi encontrada!")
    }

    return true
}