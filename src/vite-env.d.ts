/// <reference types="vite/client" />

import type {
    CreateModuleInput,
    Module,
    UpdateModuleInput
} from './modules/moduleType';

import type {
    CreateSectionInput,
    Section,
    UpdateSectionContentInput,
    UpdateSectionInput
} from './sections/sectionType'

import type { SaveMediaInput, SavedMedia } from './media/mediaType'
import type { CreateGameInput, GameProject, UpdateGameInput } from './games/gameType'

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
            update(input: UpdateSectionInput): Promise<Section>
            updateContent(input: UpdateSectionContentInput): Promise<Section>
        }

        mediaApi: {
            save(input: SaveMediaInput): Promise<SavedMedia>
        }
        gamesApi: {
            create(input: CreateGameInput): Promise<GameProject>
            list(): Promise<GameProject[]>
            update(input: UpdateGameInput): Promise<GameProject>
            delete(id: string): Promise<boolean>
        }
        
    }
}
