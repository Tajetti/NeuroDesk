import { useState } from "react";
import HeaderLibrary from "./component/library/Header";
import MainLibrary from "./component/library/Main"

import HeaderMaterials from './component/materials/Header';
import MainMaterials from './component/materials/Main';
import ContentQuantity from './component/materials/ContentQuantity';
import MaterialsTable from './component/materials/MaterialsTable';

import NewModule from "./component/module/NewModule";

export default function App() {

    const [currentScreen, setCurrentScreen] = useState('library');

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">

            {currentScreen == 'library' && (
                <>
                <HeaderLibrary onOpenMaterials={() => setCurrentScreen('materials')} />
                <MainLibrary onOpenNewModule={() => setCurrentScreen('newModule')}/>
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

        </div>
    );
}
