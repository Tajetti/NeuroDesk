import { Trash2 } from "lucide-react";
import type { Module } from "../../modules/moduleType";

type ModuleCardProps = {
    module: Module
    onOpen: (module: Module) => void
    onDelete: (module: Module) => void
}

export default function ModuleCard({module, onOpen, onDelete}: ModuleCardProps) {
    return (
        <article
            onClick={() => onOpen(module)}
            className="group flex min-h-64 cursor-pointer flex-col rounded-3xl border border-[var(--border-color)] bg-white p-6 shadow-[0_10px_30px_rgba(23,37,50,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[var(--logo-color)]/40 hover:shadow-[0_16px_36px_rgba(23,37,50,0.10)]"
          >
          <div className="flex items-start justify-between gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--logo-color)]/10 text-sm font-bold tracking-wide text-[var(--logo-color)]">
              {module.acronym}
            </div>

            <span className="inline-flex max-w-[70%] rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-[var(--description-letter)]">
              <span className="truncate">{module.tag}</span>
            </span>
          </div>

          <h3 className="mt-5 text-xl font-semibold leading-snug text-[var(--title-letter)]">
            {module.name}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--description-letter)]">
            {module.summary}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-[var(--logo-color)]">
              Abrir módulo
            </span>

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
          </article>
    )
}