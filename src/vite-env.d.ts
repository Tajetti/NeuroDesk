/// <reference types="vite/client" />

import type {
    CreateModuleInput,
    Module,
    UpdateModuleInput
} from './modules/moduleType';

declare global {
    interface Window {
        modulesApi: {
            create(input:CreateModuleInput): Promise<Module>
            list(): Promise<Module[]>
            remove(id: string): Promise<boolean>
            update(module:UpdateModuleInput): Promise<Module>
        }
    }
}