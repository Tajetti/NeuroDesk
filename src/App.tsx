import { useState } from "react";
import HeaderLibrary from "./component/library/Header";
import MainLibrary from "./component/library/Main"

import HeaderMaterials from './component/materials/Header';
import MainMaterials from './component/materials/Main';
import ContentQuantity from './component/materials/ContentQuantity';
import MaterialsTable from './component/materials/MaterialsTable';

import NewModule from "./component/module/NewModule";
import ModuleDetails from "./component/module/ModuleDetails";
import GameStudio from "./component/games/GameStudio";

import type { Module } from './modules/moduleType'

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('library');
    const [selectedModule, setSelectedModule] = useState<Module | null>(null)

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">

            {currentScreen == 'library' && (
                <>
                <HeaderLibrary onOpenGames={() => setCurrentScreen('games')} />
                <MainLibrary 
                    onOpenNewModule={() => setCurrentScreen('newModule')} 
                    onOpenModule={(module) => { 
                            setSelectedModule(module) 
                            setCurrentScreen("moduleDetails") } }
                />
                </>
            )}

            {currentScreen == 'materials' && (
                <>
                    <HeaderMaterials onOpenLibrary={() => setCurrentScreen('library')}/>
                    <MainMaterials />
                    <ContentQuantity />
                    <MaterialsTable />
                </>
            )}

            {currentScreen == 'newModule' && (
                <>
                    <NewModule onOpenLibrary={() => setCurrentScreen('library')} />
                </>
            )}

            { currentScreen == 'moduleDetails' && selectedModule && (
                    <ModuleDetails 
                        module={selectedModule}
                        onOpenLibrary={() => setCurrentScreen('library')} />
            ) }

            {currentScreen == 'games' && (
                <GameStudio onBack={() => setCurrentScreen('library')} />
            )}
        </div>
    );
}
