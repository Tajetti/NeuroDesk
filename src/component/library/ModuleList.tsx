import { useEffect, useState } from "react";

import type { Module } from "../../modules/moduleType";
import DeleteModuleDialog from "./DeleteModuleDialog"
import ModuleCard from "./ModuleCard";

type ModuleListProps = {
  onOpenModule: (module: Module) => void
}

export default function ModuleList({
  onOpenModule
}: ModuleListProps) {
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
          <ModuleCard
            key={module.id}
            module={module}
            onOpen={onOpenModule}
            onDelete={(module) => {
              setDeleteError("")
              setModuleToDelete(module)
            }}
          />
        ))}
      </div>

      {moduleToDelete && (
        <DeleteModuleDialog
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