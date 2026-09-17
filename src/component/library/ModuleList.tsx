import { useEffect, useState } from "react";

import type { Module } from "../../modules/moduleType";
import DeleteModuleDialog from "./DeleteModuleDialog"
import ModuleCard from "./ModuleCard";
import EditModuleDialog from "./EditModuleDialog";


type ModuleListProps = {
  onOpenModule: (module: Module) => void
  search: string
}

export default function ModuleList({
  onOpenModule, search
}: ModuleListProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null)

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

  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR")

  const filteredModules = modules.filter((module) => {
    const name = module.name.toLocaleLowerCase("pt-BR")
    const acronym = module.acronym.toLocaleLowerCase("pt-BR")

    return name.includes(normalizedSearch) || acronym.includes(normalizedSearch)
  })

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
        {filteredModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onOpen={onOpenModule}
            onDelete={(module) => {
              setDeleteError("")
              setModuleToDelete(module)
            }}
            onEdit={(module) => {
              setModuleToEdit(module)
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

      {moduleToEdit && (
        <EditModuleDialog
          module={moduleToEdit}
          onCancel={() => setModuleToEdit(null)}
          onSave={(updatedModule) => {
            setModules((currentModules) =>
              currentModules.map((module) =>
                module.id === updatedModule.id ? updatedModule : module
              )
            )
            setModuleToEdit(null)
          }}
        />
      )}
    </>
  )
}
