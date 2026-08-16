export type Section = {
    id: string,
    moduleId: string,
    name: string,
    content: string,
    position: number,
    createdAt: string,
    updatedAt: string
}

export type CreateSectionInput = {
    moduleId: string
    name: string
}

export type UpdateSectionInput = {
    id: string,
    name: string,
}

export type UpdateSectionType = {
    id: string,
    name: string,
    updatedAt: string
}

export type UpdateSectionContentInput = {
    id: string
    content: string
}
