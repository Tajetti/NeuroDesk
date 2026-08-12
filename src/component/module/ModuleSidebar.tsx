import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Plus, Trash } from "lucide-react";

import type { Module } from "../../modules/moduleType";
import type { CreateSectionInput, Section } from "../../sections/sectionType";

type ModuleSidebarProps = {
    module: Module
    onOpenLibrary: () => void
}

export default function ModuleSidebar({ module, onOpenLibrary }: ModuleSidebarProps) {
    const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false)
    const [sections, setSections] = useState<Section[]>([])

    useEffect(() => {
        async function loadSections() {
            try {
                const result = await window.sectionsApi.list(module.id)
                setSections(result)
            } catch(error) {
                console.error("Error ao carregar as seções: ", error)
            }
        }
        loadSections()
    }, [module.id])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const input: CreateSectionInput = {
            moduleId: module.id,
            name: String(formData.get("name") ?? "")
        }

        try{
            const createdResponse = await window.sectionsApi.create(input);
            console.log(createdResponse)
            setIsCreateSectionOpen(false)
            setSections((currentSections) => [ 
                ...currentSections,
                createdResponse
            ])
        } catch (error) {
            console.error("Erro ao criar a seção: "+ error);
        }
    }

    async function handleDelete(id: string) {
        try{
            const deleted = await window.sectionsApi.delete(id)

            setSections((currentSections) => 
                currentSections.filter((section) => section.id !== id))

        } catch (error) {
            console.error("Não é possível deletar a seção")
        }
    }

    return (
        <aside className="min-h-screen w-80 border-r border-[var(--border-color)] bg-white">
            <div className="px-6 py-8">
                <button
                    type="button"
                    onClick={onOpenLibrary}
                    className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--description-letter)] transition hover:text-[var(--logo-color)]"
                >
                    <ArrowLeft size={19} aria-hidden="true" />
                    Voltar aos módulos
                </button>

                <div className="mt-10 flex items-center gap-4">
                    <div className="flex size-16 min-w-0 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--logo-color)]/10 px-1 text-lg font-bold text-[var(--logo-color)]">
                        <span className="block max-w-full truncate">
                            {module.acronym}
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="block max-w-full truncate text-base font-semibold text-[var(--title-letter)]">
                            {module.name}
                        </h2>

                        <p className="mt-1 block max-w-full truncate text-sm text-[var(--description-letter)]">
                            {module.tag}
                        </p>
                    </div>
                </div>
            </div>

            <hr className="mx-6 border-0 border-t border-slate-200" />
            <nav className="mx-3 mt-3 space-y-1" aria-label="Seções do módulo">

                {sections.map((section) => {
                    return(
                        <div
                            key={section.id}
                            className="group/section flex min-w-0 cursor-pointer justify-between overflow-hidden rounded-2xl text-sm hover:bg-[var(--hover-section)]"
                        >
                            <button
                                type="button"
                                className="flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 overflow-hidden px-3 font-medium text-[var(--description-letter)] transition-colors hover:text-[var(--primary-text)]"
                            >
                                <span className="size-1.5 shrink-0 rounded-full bg-[#dfe7ea] transition-colors" />
                                <span className="min-w-0 flex-1 truncate text-left">
                                    {section.name}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(section.id)}
                                aria-label={`Excluir seção ${section.name}`}
                                className="group/trash relative flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full opacity-0 transition-opacity duration-150 group-hover/section:opacity-100 focus-visible:opacity-100"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute size-2 scale-0 rounded-full bg-[var(--hover-section-delete)] transition-transform duration-200 ease-out group-hover/trash:scale-[4]"
                                />
                                <Trash
                                    className="relative z-10 text-slate-400 transition-colors duration-200 group-hover/trash:text-slate-950"
                                    size={17}
                                />
                            </button>
                        </div>
                    )
                })}

                {isCreateSectionOpen && (
                    <form 
                        onSubmit={handleSubmit}
                        className="flex h-10 w-full items-center gap-3 rounded-2xl bg-[var(--hover-section)] px-3">
                        <span className="size-1.5 shrink-0 rounded-full bg-[#dfe7ea]" />

                        <input
                            type="text"
                            name="name"
                            placeholder="Nome da seção"
                            autoFocus
                            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--primary-text)] outline-none placeholder:text-[var(--description-letter)]"
                        />

                    </form>
                )}
            </nav>

            <button
                type="button"
                onClick={() => setIsCreateSectionOpen(true)}
                className="mx-4 mt-4 flex h-11 w-[calc(100%_-_2rem)] cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-[var(--border-color)] px-3 text-sm font-semibold text-[var(--description-letter)] transition-colors hover:border-[var(--onclicked-section)] hover:text-[var(--primary-text)]"
            >
                <Plus size={17} strokeWidth={2} aria-hidden="true" />
                Criar seção
            </button>
        </aside>
    )
} 
