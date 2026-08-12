// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import type { CreateModuleInput, Module, UpdateModuleInput } from './modules/moduleType';
import type { CreateSectionInput, Section } from "./sections/sectionType";

contextBridge.exposeInMainWorld("modulesApi", {
    create(input:CreateModuleInput):Promise<Module> {
        return ipcRenderer.invoke(
            "modules:create",
            input,
        );
    },

    list(): Promise<Module[]>  {
        return ipcRenderer.invoke("modules:list")
    },

    remove(id: string): Promise<boolean> {
        return ipcRenderer.invoke(
            "modules:delete",
            id,
        )
    },

    update(input:UpdateModuleInput):Promise<Module> {
        return ipcRenderer.invoke(
            "modules:update",
            input,
        )
    }
})

contextBridge.exposeInMainWorld("sectionsApi", {
    create(input:CreateSectionInput): Promise<Section> {
        return ipcRenderer.invoke(
            "sections:create",
            input
        )
    },
    
    list(moduleId: string): Promise<Section[]> {
        return ipcRenderer.invoke(
            "sections:list",
            moduleId
        )
    },

    delete(id: string): Promise<boolean> {
        return ipcRenderer.invoke(
            "sections:delete",
            id
        )
    }
})