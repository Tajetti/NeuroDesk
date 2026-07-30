import { Module } from "../../modules/moduleType"

type ModuleDetailsProps = {
    module: Module
    onOpenLibrary: () => void
}

export default function ModuleDetails({ onOpenLibrary, module }: ModuleDetailsProps) {
    return (
        <div className="">
            <header>
                <button type='button' onClick={onOpenLibrary}>
                    Voltar
                </button>
            </header>

            <main>
                <h1>Detalhes do módulo</h1>
                <p> {module.name} </p>
                <button type='button'>
                    Adicionar material
                </button>
            </main>
            
        </div>
    )
}