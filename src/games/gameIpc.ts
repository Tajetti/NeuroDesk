import { ipcMain } from "electron"
import { createGame, deleteGame, listGames, updateGame } from "./gameService"
import type { CreateGameInput, UpdateGameInput } from "./gameType"

export function registerGameHandlers() {
    ipcMain.handle("games:create", (_event, input: CreateGameInput) => createGame(input))
    ipcMain.handle("games:list", () => listGames())
    ipcMain.handle("games:update", (_event, input: UpdateGameInput) => updateGame(input))
    ipcMain.handle("games:delete", (_event, id: string) => deleteGame(id))
} 