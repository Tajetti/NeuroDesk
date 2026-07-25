import { ipcMain } from "electron";
import { createModule } from "./moduleService";
import type { CreateModuleInput } from "./moduleType";

export function registerModuleHandler() {
    ipcMain.handle(
        "modules:create",
        (_event, input:CreateModuleInput) => {
            return createModule(input);
        },
    );
}