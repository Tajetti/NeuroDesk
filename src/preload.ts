// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import type { CreateModuleInput, Module } from './modules/moduleType';

contextBridge.exposeInMainWorld("modulesApi", {
    create(input:CreateModuleInput):Promise<Module> {
        return ipcRenderer.invoke(
            "modules:create",
            input,
        );
    }
})

