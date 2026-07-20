import { Download, FileText, ListFilter, Search } from "lucide-react";

const filters = [
    { label: "Todos", count: 12, active: true },
    { label: "Documentos", count: 6 },
    { label: "Imagens", count: 3 },
    { label: "Vídeos", count: 1 },
    { label: "Áudios", count: 2 },
];

const materials = [
    {
        title: "Cartões de emoções (imprimir)",
        description: "Conjunto de 24 cartões ilustrados para trabalhar reconhecimento emocional.",
        module: "TEA",
        size: "1,2 MB",
        updatedAt: "há 2 dias",
    },
    {
        title: "Rotina visual — modelo editável",
        description: "Template de rotina diária com pictogramas.",
        module: "TEA",
        size: "780 KB",
        updatedAt: "há 1 semana",
    },
];

export default function MaterialsTable() {
    return (
        <section className="mx-auto w-full max-w-[var(--page-max-width)] px-4 pb-16 pt-9 sm:px-8 lg:px-[var(--page-padding)]">
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
                <label className="flex h-12 items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-white px-4 shadow-[0_2px_5px_var(--control-shadow)] focus-within:border-[var(--logo-color)] focus-within:ring-2 focus-within:ring-cyan-100">
                    <Search size={18} className="shrink-0 text-[var(--description-letter)]" aria-hidden="true" />
                    <input
                        type="search"
                        placeholder="Pesquisar material..."
                        aria-label="Pesquisar material"
                        className="w-full bg-transparent text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]"
                    />
                </label>

                <button
                    type="button"
                    className="flex h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-white px-4 text-sm font-medium text-[var(--primary-text)] shadow-[0_2px_5px_var(--control-shadow)] transition hover:border-slate-300"
                >
                    <ListFilter size={18} className="text-[var(--description-letter)]" aria-hidden="true" />
                    Todos os módulos
                </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar materiais por tipo">
                {filters.map(({ label, count, active }) => (
                    <button
                        type="button"
                        key={label}
                        className={`h-8 cursor-pointer rounded-full px-4 text-xs font-semibold transition ${
                            active
                                ? "bg-[var(--logo-color)] text-white"
                                : "bg-[#e2f1f4] text-[var(--primary-text)] hover:bg-[#d5ebef]"
                        }`}
                    >
                        {label} <span className={active ? "text-cyan-100" : "text-[var(--description-letter)]"}>({count})</span>
                    </button>
                ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-[22px] border border-[var(--border-color)] bg-white">
                <div className="hidden grid-cols-[minmax(360px,2.5fr)_minmax(130px,.75fr)_100px_130px_64px] gap-4 border-b border-[var(--border-color)] bg-[#f3f8fa] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--description-letter)] md:grid">
                    <span>Material</span>
                    <span>Módulo</span>
                    <span>Tamanho</span>
                    <span>Atualizado</span>
                    <span className="text-right">Ação</span>
                </div>

                <div className="divide-y divide-[var(--border-color)]">
                    {materials.map((material) => (
                        <article
                            key={material.title}
                            className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(360px,2.5fr)_minmax(130px,.75fr)_100px_130px_64px] md:items-center"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--document-bg)] text-white">
                                    <FileText size={18} strokeWidth={1.8} aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-[var(--primary-text)]">{material.title}</h3>
                                    <p className="mt-1 truncate text-xs text-[var(--description-letter)]">{material.description}</p>
                                </div>
                            </div>

                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#e2f1f4] px-3 py-1 text-xs font-semibold text-[var(--primary-text)]">
                                    <span className="size-1.5 rounded-full bg-[#2eb4cb]" />
                                    {material.module}
                                </span>
                            </div>
                            <span className="text-xs text-[var(--description-letter)]">{material.size}</span>
                            <span className="text-xs text-[var(--description-letter)]">{material.updatedAt}</span>
                            <button
                                type="button"
                                aria-label={`Baixar ${material.title}`}
                                className="flex size-9 cursor-pointer items-center justify-center justify-self-start rounded-xl border border-[var(--border-color)] text-[var(--description-letter)] transition hover:border-[var(--logo-color)] hover:text-[var(--logo-color)] md:justify-self-end"
                            >
                                <Download size={17} aria-hidden="true" />
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
