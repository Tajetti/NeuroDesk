import { Pen, Trash2 } from "lucide-react";
import type { Module } from "../../modules/moduleType";

type ModuleCardProps = {
    module: Module
    onOpen: (module: Module) => void
    onDelete: (module: Module) => void
    onEdit: (module: Module) => void
}

export default function ModuleCard({module, onOpen, onDelete, onEdit}: ModuleCardProps) {
    return (
        <article
            onClick={() => onOpen(module)}
            className="group flex min-h-64 min-w-0 cursor-pointer flex-col overflow-hidden rounded-3xl border border-[var(--border-color)] bg-white p-6 shadow-[0_10px_30px_rgba(23,37,50,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[var(--logo-color)]/40 hover:shadow-[0_16px_36px_rgba(23,37,50,0.10)]"
          >
          <div className="flex items-start justify-between gap-4">
            <div className="flex size-12 min-w-0 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--logo-color)]/10 px-1 text-sm font-bold tracking-wide text-[var(--logo-color)]">
              <span className="block max-w-full truncate">{module.acronym}</span>
            </div>

          </div>

          <h3 className="mt-5 line-clamp-2 min-h-[3.5rem] overflow-hidden break-words text-xl font-semibold leading-snug text-[var(--title-letter)] [overflow-wrap:anywhere]">
            {module.name}
          </h3>

          <p className="mt-3 line-clamp-3 overflow-hidden break-words text-sm leading-6 text-[var(--description-letter)] [overflow-wrap:anywhere]">
            {module.summary || "Sem resumo cadastrado."}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-[var(--logo-color)]">
              Abrir módulo
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Editar módulo"
                aria-label={`Editar módulo ${module.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onEdit(module)
                }}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-500"
              >
                <Pen size={17} aria-hidden="true" />
              </button>

              <button
                type="button"
                title="Excluir módulo"
                aria-label={`Excluir módulo ${module.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete(module)
                }}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
          </article>
    )
}
