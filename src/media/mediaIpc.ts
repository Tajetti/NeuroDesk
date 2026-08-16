import { ipcMain } from "electron"

import { saveMedia } from "./mediaService"
import type { SaveMediaInput } from "./mediaType"

export function registerMediaHandlers() {
    ipcMain.handle("media:save", (_event, input: SaveMediaInput) => saveMedia(input))
}
