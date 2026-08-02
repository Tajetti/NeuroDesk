import { ipcMain } from "electron";
import { createModule, listModules, deleteModule, updateModule } from "./moduleService";
import type { CreateModuleInput, UpdateModuleInput } from "./moduleType";

export function registerModuleHandler() {
    ipcMain.handle(
        "modules:create",
        (_event, input:CreateModuleInput) => {
            return createModule(input);
        },
    )

    ipcMain.handle( "modules:list", () => {
            return listModules();
    })

    ipcMain.handle(
        "modules:delete", 
        (_event, id: string) => {
            return deleteModule(id)
        })

    ipcMain.handle(
        "modules:update",
        (_event, input: UpdateModuleInput) => {
            return updateModule(input)
        }
    )
}
