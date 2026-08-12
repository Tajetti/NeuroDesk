import { ipcMain } from "electron";
import { createSection, listSections, deleteSection } from "./sectionService";
import type { CreateSectionInput } from "./sectionType";

export function registerSectionHandler() { 
    ipcMain.handle(
        "sections:create",
        (_event, input:CreateSectionInput) => {
            return createSection(input)
        }
    )

    ipcMain.handle(
        "sections:list",
        (_event, moduleId: string) => {
            return listSections(moduleId)
        } 
    )

    ipcMain.handle(
        "sections:delete",
        (_event, id: string) => {
            return deleteSection(id)
        }
    )
}