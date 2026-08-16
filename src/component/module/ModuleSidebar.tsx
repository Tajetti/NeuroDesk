import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Plus, Trash, Pen } from "lucide-react";

import type { Module } from "../../modules/moduleType";
import type { CreateSectionInput, Section, UpdateSectionInput } from "../../sections/sectionType";

type ModuleSidebarProps = {
    module: Module
    onOpenLibrary: () => void
    selectedSection: Section | null
    onSelectSection: (section: Section | null) => void
}

export default function ModuleSidebar({ module, onOpenLibrary, selectedSection, onSelectSection }: ModuleSidebarProps) {
    const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false)
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
    const [sections, setSections] = useState<Section[]>([])
    const selectedSectionId = selectedSection?.id ?? null

    useEffect(() => {
        if (!selectedSection) return
        setSections((currentSections) =>
            currentSections.map((section) =>
                section.id === selectedSection.id ? selectedSection : section
            )
        )
    }, [selectedSection])

    useEffect(() => {
        async function loadSections() {
            try {
                const result = await window.sectionsApi.list(module.id)
                setSections(result)
                onSelectSection(result[0] ?? null)
            } catch(error) {
                console.error("Error ao carregar as seções: ", error)
            }
        }
        loadSections()
    }, [module.id, onSelectSection])

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
            onSelectSection(createdResponse)
        } catch (error) {
            console.error("Erro ao criar a seção: "+ error);
        }
    }

    async function handleDelete(id: string) {
        const section = sections.find((currentSection) => currentSection.id === id)
        const confirmed = window.confirm(
            `Excluir a seção "${section?.name ?? "Sem título"}"? Todo o conteúdo dessa anotação será perdido.`
        )

        if (!confirmed) return

        try{
            const deleted = await window.sectionsApi.delete(id)

            setSections((currentSections) => 
                currentSections.filter((section) => section.id !== id))
            if (selectedSectionId === id) {
                const remainingSections = sections.filter((section) => section.id !== id)
                onSelectSection(remainingSections[0] ?? null)
            }

        } catch (error) {
            console.error("Não é possível deletar a seção")
        }
    }

    async function handleEditSubmit(event: FormEvent<HTMLFormElement>, id: string) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const input: UpdateSectionInput = {
            id,
            name: String(formData.get("name") ?? "")
        }

        try {
            const updatedSection = await window.sectionsApi.update(input)

            setSections((currentSections) =>
                currentSections.map((section) =>
                    section.id === updatedSection.id ? updatedSection : section
                )
            )
            if (selectedSectionId === updatedSection.id) {
                onSelectSection(updatedSection)
            }
            setEditingSectionId(null)
        } catch (error) {
            console.error("Erro ao editar a seção: ", error)
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

                    </div>
                </div>
            </div>

            <hr className="mx-6 border-0 border-t border-slate-200" />
            <nav className="mx-3 mt-3 space-y-1" aria-label="Seções do módulo">

                {sections.map((section) => {
                    if (editingSectionId === section.id) {
                        return (
                            <form
                                key={section.id}
                                onSubmit={(event) => handleEditSubmit(event, section.id)}
                                className="flex h-10 w-full items-center gap-3 rounded-2xl bg-[var(--hover-section)] px-3"
                            >
                                <span className="size-1.5 shrink-0 rounded-full bg-[#dfe7ea]" />
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={section.name}
                                    autoFocus
                                    onKeyDown={(event) => {
                                        if (event.key === "Escape") {
                                            setEditingSectionId(null)
                                        }
                                    }}
                                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--primary-text)] outline-none"
                                />
                            </form>
                        )
                    }

                    return(
                        <div
                            key={section.id}
                            className={`group/section flex min-w-0 cursor-pointer justify-between overflow-hidden rounded-2xl text-sm transition-colors hover:bg-[var(--hover-section)] ${selectedSectionId === section.id ? "bg-[var(--hover-section)]" : ""}`}
                        >
                            <button
                                type="button"
                                onClick={() => onSelectSection(section)}
                                className={`flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-3 overflow-hidden px-3 font-medium transition-colors ${selectedSectionId === section.id ? "text-[var(--primary-text)]" : "text-[var(--description-letter)] hover:text-[var(--primary-text)]"}`}
                            >
                                <span className="size-1.5 shrink-0 rounded-full bg-[#dfe7ea] transition-colors" />
                                <span className="min-w-0 flex-1 truncate text-left">
                                    {section.name}
                                </span>
                            </button>
                            <div className="flex shrink-0 items-center opacity-0 transition-opacity duration-150 group-hover/section:opacity-100 focus-within:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingSectionId(section.id)}
                                    aria-label={`Editar seção ${section.name}`}
                                    className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-cyan-100 hover:text-cyan-700 focus-visible:outline-2 focus-visible:outline-cyan-500"
                                >
                                    <Pen size={17} aria-hidden="true" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(section.id)}
                                    aria-label={`Excluir seção ${section.name}`}
                                    className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-100 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-400"
                                >
                                    <Trash size={17} aria-hidden="true" />
                                </button>
                            </div>
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
