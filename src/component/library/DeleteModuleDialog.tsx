import { AlertTriangle, Trash2, X } from "lucide-react";

type DeleteModuleDialogProp = {
    moduleName: string,
    isDeleting: boolean,
    error: string,
    onCancel: () => void,
    onConfirm: () => void
}

export default function SureDelete({
  moduleName,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteModuleDialogProp) {
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