export type Module = {
    id: string
    name: string
    acronym: string
    summary: string
    tag: string
    createdAt: string
    updatedAt: string
}

export type CreateModuleInput = { 
    name: string
    acronym: string
    summary: string
    tag: string
}

export type UpdateModuleInput = {
    id: string
    name: string
    acronym: string
    summary: string
    tag: string
    createdAt: string
}
