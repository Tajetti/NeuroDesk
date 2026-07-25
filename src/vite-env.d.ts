/// <reference types="vite/client" />

import type {
    CreateModuleInput,
    Module
} from './modules/moduleType';

declare global {
    interface Window {
        modulesApi: {
            create(
                input:CreateModuleInput,
            ): Promise<Module>
        }
    }
}