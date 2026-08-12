export type Section = {
    id: string,
    moduleId: string,
    name: string,
    position: number,
    createdAt: string,
    updatedAt: string
}

export type CreateSectionInput = {
    moduleId: string
    name: string
}