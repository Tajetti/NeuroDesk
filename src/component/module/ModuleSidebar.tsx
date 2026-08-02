import { ArrowLeft } from "lucide-react";
import type { Module } from "../../modules/moduleType";

type ModuleSidebarProps = {
    module: Module
    onOpenLibrary: () => void
}

export default function ModuleSidebar({ module, onOpenLibrary }: ModuleSidebarProps) {
    return (
        <aside className="min-h-screen w-80 border-r border-[var(--border-color)] bg-white">
            <div className="px-6 py-8">
                <button
                    type="button"
                    onClick={onOpenLibrary}
                    className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--description-letter)] transition hover:text-[var(--logo-color)]"
                >
                    <ArrowLeft size={19} aria-hidden="true" />
                    Voltar aos módulos
                </button>

                <div className="mt-10 flex items-center gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--logo-color)]/10 text-lg font-bold text-[var(--logo-color)]">
                        {module.acronym}
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-[var(--title-letter)]">
                            {module.name}
                        </h2>

                        <p className="mt-1 truncate text-sm text-[var(--description-letter)]">
                            {module.tag}
                        </p>
                    </div>
                </div>
            </div>
            <hr className="mx-6 border-0 border-t border-slate-200" />
        </aside>
    )
} 
