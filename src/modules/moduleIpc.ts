import { ipcMain } from "electron";
import { createModule, listModules, deleteModule } from "./moduleService";
import type { CreateModuleInput } from "./moduleType";

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
}