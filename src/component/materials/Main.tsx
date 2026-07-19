export default function Main() {
    return (
        <main className="mx-auto w-full max-w-[var(--page-max-width)] px-[var(--page-padding)] py-16">
                <p className="text-[var(--sm-letter)] text-sm font-medium text-primary">Materiais</p>

                <h2 className="text-[var(--title-letter)] mt-2 text-3xl font-semibold tracking-tight text-foreground">Materiais de apoio</h2>

            <div className="text-header flex justify-between">
                <p className="text-[var(--description-letter)] mt-2 max-w-2xl text-muted-foreground">
                    Documentos, imagens, vídeos e áudios organizados por módulo para uso em atendimento.
                </p>


                <button
                        type="button"
                        className="flex h-9 cursor-pointer items-center gap-1.5 self-start rounded-xl bg-[var(--logo-color)] px-4 text-xs font-semibold text-white shadow-[0_3px_8px_var(--control-shadow)] transition hover:brightness-95 active:scale-[0.98]"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="size-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M12 16V4" />
                            <path d="m7 9 5-5 5 5" />
                            <path d="M5 14v5h14v-5" />
                        </svg>

                        Enviar material
                </button>
            </div>
        </main>
    )
}
