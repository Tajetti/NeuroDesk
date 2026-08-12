import type { Module } from "../../modules/moduleType"
import ModuleSidebar from "./ModuleSidebar"

type ModuleDetailsProps = {
    module: Module
    onOpenLibrary: () => void
}

export default function ModuleDetails({ onOpenLibrary, module }: ModuleDetailsProps) {
    return (
        <div className="">
            <ModuleSidebar onOpenLibrary={onOpenLibrary} 
            module={module}/>
        </div>
    )
}