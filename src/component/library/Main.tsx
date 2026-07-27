import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Module } from "../../modules/moduleType";

type MainProps = {
  onOpenNewModule: () => void
}

export function ModuleList() {
  const [modules, setModules] = useState<Module[]>([])
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  async function handleDelete() {
    if (!moduleToDelete || isDeleting) return

    setIsDeleting(true)
    setDeleteError("")

    try {
      const deleted = await window.modulesApi.remove(moduleToDelete.id)

      if (deleted) {
        setModules((currentModules) =>
          currentModules.filter((module) => module.id !== moduleToDelete.id)
        )
        setModuleToDelete(null)
      }
    } catch (error) {
      console.error("Erro ao excluir módulo:", error)
      setDeleteError("Não foi possível excluir o módulo. Tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    async function loadModules() {
      const result = await window.modulesApi.list()
      setModules(result)
    }
    loadModules()
  }, [])

  if (modules.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-[var(--border-color)] bg-white/60 px-6 py-12 text-center">
        <p className="font-semibold text-[var(--primary-text)]">Nenhum módulo cadastrado</p>
        <p className="mt-1 text-sm text-[var(--description-letter)]">
          Crie seu primeiro módulo para começar a organizar os materiais.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <article
            key={module.id}
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
                setDeleteError("")
                setModuleToDelete(module)
              }}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          </div>
          </article>
        ))}
      </div>

      {moduleToDelete && (
        <SureDelete
          moduleName={moduleToDelete.name}
          isDeleting={isDeleting}
          error={deleteError}
          onCancel={() => {
            if (!isDeleting) setModuleToDelete(null)
          }}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}

type SureDeleteProps = {
  moduleName: string
  isDeleting: boolean
  error: string
  onCancel: () => void
  onConfirm: () => void
}

function SureDelete({
  moduleName,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: SureDeleteProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sure-delete-title"
        aria-describedby="sure-delete-description"
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={23} aria-hidden="true" />
          </div>
          <button
            type="button"
            aria-label="Fechar"
            disabled={isDeleting}
            onClick={onCancel}
            className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <h2 id="sure-delete-title" className="mt-5 text-xl font-semibold text-[var(--title-letter)]">
          Excluir módulo?
        </h2>
        <p id="sure-delete-description" className="mt-2 text-sm leading-6 text-[var(--description-letter)]">
          Tem certeza de que deseja excluir <strong>{moduleName}</strong>? Essa ação não pode ser desfeita.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="h-11 cursor-pointer rounded-xl border border-[var(--border-color)] px-5 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-70"
          >
            <Trash2 size={17} aria-hidden="true" />
            {isDeleting ? "Excluindo..." : "Excluir módulo"}
          </button>
        </div>
      </section>
    </div>
  )
}

export default function Main({ onOpenNewModule }: MainProps) {
  return (
    <main className="mx-auto w-full max-w-[var(--page-max-width)] px-[var(--page-padding)] py-16">
      <p className="text-[var(--sm-letter)] text-sm font-medium text-primary">Início</p>

      <h2 className="text-[var(--title-letter)] mt-2 text-3xl font-semibold tracking-tight text-foreground">Escolha um transtorno para começar</h2>

      <p className="text-[var(--description-letter)] mt-2 max-w-2xl text-muted-foreground">
        Cada módulo reúne informações, estratégias, atividades e jogos
        organizados para apoiar seus atendimentos.
      </p>

      <div className="mt-10 flex gap-3">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-white px-4 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0 text-[var(--secondary-text)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="Pesquisar transtorno, sigla ou área..."
            className="w-full bg-transparent text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]"
          />
        </div>

        <button
          type="button"
          onClick={onOpenNewModule}
          className="flex h-12 cursor-pointer items-center gap-2 rounded-2xl border-0 bg-white px-5 text-sm font-semibold text-[var(--primary-text)] shadow-[0_2px_8px_var(--control-shadow)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--logo-color)]"
        >
          <span className="text-xl font-light">+</span>
          Novo módulo
        </button>
      </div>

      <ModuleList />
    </main>
  );
}
