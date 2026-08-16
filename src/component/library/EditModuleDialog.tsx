import { Check, X } from "lucide-react"
import { useState, type FormEvent, type ReactNode } from "react"
import type { Module } from "../../modules/moduleType"

type EditModuleDialogProps = {
    module: Module
    onCancel: () => void
    onSave: (module: Module) => void
}

export default function EditModuleDialog({
    module,
    onCancel,
    onSave
}: EditModuleDialogProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState("")

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (isSaving) return

        const formData = new FormData(event.currentTarget)

        setIsSaving(true)
        setSaveError("")

        try {
            const updatedModule = await window.modulesApi.update({
                id: module.id,
                name: String(formData.get("name") ?? ""),
                acronym: String(formData.get("acronym") ?? ""),
                summary: String(formData.get("summary") ?? ""),
                createdAt: module.createdAt
            })

            onSave(updatedModule)
        } catch (error) {
            console.error("Erro ao editar módulo:", error)
            setSaveError("Não foi possível salvar as alterações. Tente novamente.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5">
            <section className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
                <header className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-[var(--title-letter)]">
                            Editar módulo
                        </h2>
                        <p className="mt-1 text-sm text-[var(--description-letter)]">
                            Atualize as informações do módulo.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        aria-label="Fechar"
                        className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="mt-7">
                    <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
                        <Field label="Nome do transtorno" htmlFor="edit-module-name">
                            <input id="edit-module-name" name="name" type="text" defaultValue={module.name} className="module-input" required disabled={isSaving} />
                        </Field>

                        <Field label="Sigla" htmlFor="edit-module-acronym">
                            <input id="edit-module-acronym" name="acronym" type="text" defaultValue={module.acronym} className="module-input uppercase" required disabled={isSaving} />
                        </Field>
                    </div>

                    <div className="mt-5">
                        <Field label="Resumo" htmlFor="edit-module-summary" optional>
                            <textarea id="edit-module-summary" name="summary" rows={5} defaultValue={module.summary} className="module-input min-h-32 resize-y py-3" disabled={isSaving} />
                        </Field>
                    </div>

                    {saveError && (
                        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
                            {saveError}
                        </p>
                    )}

                    <footer className="mt-7 flex justify-end gap-3 border-t border-[var(--border-color)] pt-6">
                        <button type="button" onClick={onCancel} disabled={isSaving} className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-color)] px-5 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                            <X size={17} aria-hidden="true" />
                            Cancelar
                        </button>

                        <button type="submit" disabled={isSaving} className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--bg-button)] px-5 text-sm font-semibold text-white shadow-[0_3px_8px_var(--control-shadow)] transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                            <Check size={17} aria-hidden="true" />
                            {isSaving ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

type FieldProps = {
    label: string
    htmlFor: string
    children: ReactNode
    optional?: boolean
}

function Field({ label, htmlFor, children, optional }: FieldProps) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[var(--primary-text)]">
                {label}
                {!optional && <span className="ml-1 text-[var(--logo-color)]" aria-hidden="true">*</span>}
            </label>
            {children}
        </div>
    )
}
