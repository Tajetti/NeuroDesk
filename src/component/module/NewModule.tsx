import { ArrowLeft, Check, X } from "lucide-react";
import { useState, type FormEvent } from 'react';
import type { CreateModuleInput } from "../../modules/moduleType";

type NewModuleProps = {
    onOpenLibrary: () => void
}

export default function NewModule({ onOpenLibrary } : NewModuleProps) {
    const [formError, setFormError] = useState("")

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()
        setFormError("")

        const formData = new FormData(event.currentTarget)

        const input: CreateModuleInput = {
            name: String(formData.get("name")?? ""),
            acronym: String(formData.get("acronym")?? ""),
            summary: String(formData.get("summary")?? ""),
            tag: String(formData.get("tag")?? "")
        }

        if(!input.name.trim() || !input.summary.trim() || !input.acronym.trim() || !input.tag.trim()) {
            setFormError("Todos os campos precisam estar preenchidos!")
            return
        }

        if(input.tag.trim().length > 5) {
            setFormError("A tag deve conter no máximo 5 caracteres")
            return
        }

        try {
            await window.modulesApi.create(input);
            onOpenLibrary();
        } catch(error) {
            console.error("Erro ao criar módulo: ", error)
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-20 w-full max-w-[var(--page-max-width)] items-center px-5 md:px-[var(--page-padding)]">
                    <button
                        type="button"
                        onClick={onOpenLibrary}
                        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--description-letter)] transition hover:text-[var(--logo-color)]"
                    >
                        <ArrowLeft size={19} aria-hidden="true" />
                        Voltar para a biblioteca
                    </button>
                </div>
            </header>

            <main className="mx-auto w-full max-w-[var(--page-max-width)] px-5 py-10 md:px-[var(--page-padding)] md:py-14">
                <div className="mx-auto max-w-3xl">
                    <p className="text-sm font-medium text-[var(--sm-letter)]">Biblioteca</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--title-letter)]">
                        Novo módulo
                    </h1>
                    <p className="mt-2 text-[var(--description-letter)]">
                        Cadastre um transtorno para organizar informações e materiais de apoio.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-9 rounded-[24px] border border-[var(--border-color)] bg-white p-5 shadow-[0_12px_35px_rgba(23,37,50,0.06)] sm:p-8">
                        <div className="grid gap-6 sm:grid-cols-[1fr_180px]">
                            <Field label="Nome do transtorno" htmlFor="disorder-name">
                                <input
                                    id="disorder-name"
                                    type="text"
                                    placeholder="Ex.: Transtorno do Espectro Autista"
                                    className="module-input"
                                    name="name"
                                    required
                                />
                            </Field>

                            <Field label="Sigla do transtorno" htmlFor="disorder-acronym">
                                <input
                                    id="disorder-acronym"
                                    name="acronym"
                                    type="text"
                                    placeholder="Ex.: TEA"
                                    className="module-input uppercase"
                                    required
                                />
                            </Field>
                        </div>

                        <div className="mt-6">
                            <Field label="Resumo do transtorno" htmlFor="disorder-summary" hint="Apresente uma descrição breve e objetiva.">
                                <textarea
                                    id="disorder-summary"
                                    rows={5}
                                    placeholder="Descreva as principais características do transtorno..."
                                    className="module-input min-h-32 resize-y py-3"
                                    required
                                    name="summary"
                                />
                            </Field>
                        </div>

                        <div className="mt-6">
                            <Field label="Tag do transtorno" htmlFor="disorder-tag" hint="Use uma categoria para facilitar a busca na biblioteca.">
                                <input
                                    id="disorder-tag"
                                    type="text"
                                    placeholder="Ex.: Neurodesenvolvimento"
                                    className="module-input"
                                    name="tag"
                                    required
                                />
                            </Field>

                            {formError && (
                                <p
                                    role="alert"
                                    className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                                >
                                    {formError}
                                </p>
                            )}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-[var(--border-color)] pt-6">
                            <button
                                type="button"
                                onClick={onOpenLibrary}
                                className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-color)] px-5 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-slate-50"
                            >
                                <X size={17} aria-hidden="true" />
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[var(--bg-button)] px-5 text-sm font-semibold text-white shadow-[0_3px_8px_var(--control-shadow)] transition hover:brightness-95 active:scale-[0.98]"
                            >
                                <Check size={17} aria-hidden="true" />
                                Criar módulo
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

type FieldProps = {
    label: string;
    htmlFor: string;
    hint?: string;
    children: React.ReactNode;
};

function Field({ label, htmlFor, hint, children }: FieldProps) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[var(--primary-text)]">
                {label}
                <span className="ml-1 text-[var(--logo-color)]" aria-hidden="true">*</span>
            </label>
            {children}
            {hint && <p className="mt-2 text-xs text-[var(--secondary-text)]">{hint}</p>}
        </div>
    );
}
