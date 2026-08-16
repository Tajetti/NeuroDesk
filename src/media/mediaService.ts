import { app } from "electron"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

import type { SaveMediaInput, SavedMedia } from "./mediaType"

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ALLOWED_MIME_PREFIXES = ["image/", "audio/", "video/"]
const ALLOWED_MIME_TYPES = new Set(["application/pdf", "text/plain"])

function isAllowedMimeType(mimeType: string) {
    return ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix))
        || ALLOWED_MIME_TYPES.has(mimeType)
}

function safeExtension(fileName: string) {
    const extension = path.extname(fileName).toLowerCase()
    return /^\.[a-z0-9]{1,10}$/.test(extension) ? extension : ""
}

function mediaCategory(mimeType: string) {
    if (mimeType.startsWith("audio/")) return "audio"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("image/")) return "image"
    return "file"
}

export async function saveMedia(input: SaveMediaInput): Promise<SavedMedia> {
    if (!isAllowedMimeType(input.mimeType)) {
        throw new Error("Tipo de arquivo não permitido")
    }

    const data = Buffer.from(input.data)
    if (data.byteLength === 0) {
        throw new Error("O arquivo está vazio")
    }
    if (data.byteLength > MAX_FILE_SIZE) {
        throw new Error("O arquivo deve ter no máximo 50 MB")
    }

    const mediaDirectory = path.join(app.getPath("userData"), "media")
    await mkdir(mediaDirectory, { recursive: true })

    const fileName = `${randomUUID()}.${mediaCategory(input.mimeType)}${safeExtension(input.name)}`
    await writeFile(path.join(mediaDirectory, fileName), data)

    return {
        url: `neurodesk-media://local/${fileName}`,
        name: path.basename(input.name),
        mimeType: input.mimeType,
        size: data.byteLength
    }
}
