import { useEffect, useState } from "react"
import type { Block, PartialBlock } from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useCreateBlockNote } from "@blocknote/react"

import type { Section } from "../../sections/sectionType"

type SectionEditorProps = {
    section: Section | null
    onSectionUpdated: (section: Section) => void
}

export default function SectionEditor({ section, onSectionUpdated }: SectionEditorProps) {
    if (!section) {
        return (
            <main className="flex flex-1 items-center justify-center p-10 text-center text-[var(--secondary-text)]">
                <div>
                    <p className="text-lg font-semibold text-[var(--title-letter)]">Selecione uma seção</p>
                    <p className="mt-2 text-sm">Sua anotação aparecerá aqui.</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-w-0 flex-1 overflow-auto bg-[var(--bg-color)] px-6 py-8 lg:px-12">
            <EditableSection
                key={section.id}
                section={section}
                onSectionUpdated={onSectionUpdated}
            />
        </main>
    )
}

function EditableSection({ section, onSectionUpdated }: { section: Section; onSectionUpdated: (section: Section) => void }) {
    const [title, setTitle] = useState(section.name)
    const [titleStatus, setTitleStatus] = useState<"saved" | "saving">("saved")

    useEffect(() => {
        setTitle(section.name)
    }, [section.name])

    useEffect(() => {
        const normalizedTitle = title.trim()
        if (!normalizedTitle || normalizedTitle === section.name) return

        setTitleStatus("saving")
        const timeout = window.setTimeout(async () => {
            try {
                const updatedSection = await window.sectionsApi.update({
                    id: section.id,
                    name: normalizedTitle
                })
                onSectionUpdated(updatedSection)
                setTitleStatus("saved")
            } catch (error) {
                console.error("Erro ao renomear seção: ", error)
            }
        }, 600)

        return () => window.clearTimeout(timeout)
    }, [onSectionUpdated, section.id, section.name, title])

    return (
        <article className="notion-note mx-auto min-h-[calc(100vh-4rem)] max-w-5xl bg-white px-12 py-12 shadow-sm">
            <div className="mb-5 flex items-start gap-4">
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") event.currentTarget.blur()
                    }}
                    aria-label="Título da seção"
                    className="min-w-0 flex-1 bg-transparent text-4xl font-bold tracking-tight text-[var(--title-letter)] outline-none placeholder:text-slate-300"
                    placeholder="Sem título"
                />
                <span className="mt-3 text-xs text-[var(--secondary-text)]">
                    {titleStatus === "saving" ? "Salvando título..." : ""}
                </span>
            </div>
            <BlockEditor section={section} onSectionUpdated={onSectionUpdated} />
        </article>
    )
}

type BlockEditorProps = {
    section: Section
    onSectionUpdated: (section: Section) => void
}

function parseBlocks(content: string): PartialBlock[] | undefined {
    try {
        const blocks = JSON.parse(content) as PartialBlock[]
        return Array.isArray(blocks) && blocks.length > 0 ? blocks : undefined
    } catch {
        return undefined
    }
}

async function uploadMedia(file: File): Promise<string> {
    const savedMedia = await window.mediaApi.save({
        name: file.name,
        mimeType: file.type,
        data: new Uint8Array(await file.arrayBuffer())
    })

    return savedMedia.url
}

function BlockEditor({ section, onSectionUpdated }: BlockEditorProps) {
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved")
    const jsonBlocks = parseBlocks(section.content)
    const editor = useCreateBlockNote({
        initialContent: jsonBlocks,
        uploadFile: uploadMedia
    })

    useEffect(() => {
        if (jsonBlocks || !section.content.trim().startsWith("<")) return

        const blocks = editor.tryParseHTMLToBlocks(section.content)
        editor.replaceBlocks(editor.document, blocks)
    }, [editor, jsonBlocks, section.content])

    useEffect(() => {
        let timeout: number | undefined

        return editor.onChange(() => {
            window.clearTimeout(timeout)
            setSaveStatus("saving")
            timeout = window.setTimeout(async () => {
                try {
                    const updatedSection = await window.sectionsApi.updateContent({
                        id: section.id,
                        content: JSON.stringify(editor.document as Block[])
                    })
                    onSectionUpdated(updatedSection)
                    setSaveStatus("saved")
                } catch (error) {
                    console.error("Erro ao salvar anotação: ", error)
                }
            }, 700)
        })
    }, [editor, onSectionUpdated, section.id])

    return (
        <>
            <div className="mb-2 h-5 text-right text-xs text-[var(--secondary-text)]">
                {saveStatus === "saving" ? "Salvando..." : "Salvo"}
            </div>
            <BlockNoteView editor={editor} theme="light" />
        </>
    )
}
