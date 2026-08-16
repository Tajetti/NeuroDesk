export type SaveMediaInput = {
    name: string
    mimeType: string
    data: Uint8Array
}

export type SavedMedia = {
    url: string
    name: string
    mimeType: string
    size: number
}
