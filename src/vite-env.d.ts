/// <reference types="vite/client" />

import type {
    CreateModuleInput,
    Module,
    UpdateModuleInput
} from './modules/moduleType';

import type {
    CreateSectionInput,
    Section
} from './sections/sectionType'

declare global {
    interface Window {
        modulesApi: {
            create(input:CreateModuleInput): Promise<Module>
            list(): Promise<Module[]>
            remove(id: string): Promise<boolean>
            update(module:UpdateModuleInput): Promise<Module>
        }
    
        sectionsApi: {
            create(input:CreateSectionInput): Promise<Section>
            list(moduleId: string): Promise<Section[]>
            delete(id:string): Promise<boolean>
        }
        
    }
}