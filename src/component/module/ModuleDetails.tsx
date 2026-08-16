import { useCallback, useState } from "react"
import type { Module } from "../../modules/moduleType"
import type { Section } from "../../sections/sectionType"
import ModuleSidebar from "./ModuleSidebar"
import SectionEditor from "../notes/SectionEditor"

type ModuleDetailsProps = {
    module: Module
    onOpenLibrary: () => void
}

export default function ModuleDetails({ onOpenLibrary, module }: ModuleDetailsProps) {
    const [selectedSection, setSelectedSection] = useState<Section | null>(null)
    const handleSelectSection = useCallback((section: Section | null) => {
        setSelectedSection(section)
    }, [])

    return (
        <div className="flex min-h-screen">
            <ModuleSidebar
                onOpenLibrary={onOpenLibrary}
                module={module}
                selectedSection={selectedSection}
                onSelectSection={handleSelectSection}
            />
            <SectionEditor
                section={selectedSection}
                onSectionUpdated={handleSelectSection}
            />
        </div>
    )
}
