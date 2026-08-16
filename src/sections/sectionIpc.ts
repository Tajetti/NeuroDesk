import { ipcMain } from "electron";
import { createSection, listSections, deleteSection, editSection as updateSection, editSectionContent } from "./sectionService";
import type { CreateSectionInput, UpdateSectionContentInput, UpdateSectionInput } from "./sectionType";

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

    ipcMain.handle(
        "sections:update",
        (_event, id: UpdateSectionInput) => {
            return updateSection(id)
        }
    )

    ipcMain.handle(
        "sections:update-content",
        (_event, input: UpdateSectionContentInput) => editSectionContent(input)
    )
}
