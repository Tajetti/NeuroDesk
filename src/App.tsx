import { useState } from "react";
import HeaderLibrary from "./component/library/Header";
import MainLibrary from "./component/library/Main"

import HeaderMaterials from './component/materials/Header';
import MainMaterials from './component/materials/Main';
import ContentQuantity from './component/materials/ContentQuantity';

export default function App() {

    const [currentScreen, setCurrentScreen] = useState('materials');

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            {currentScreen == 'library' && (
                <>
                <HeaderLibrary onOpenMaterials={() => setCurrentScreen('materials')} />
                <MainLibrary />
                </>
            )}

            {currentScreen == 'materials' && (
                <>
                    <HeaderMaterials onOpenLibrary={() => setCurrentScreen('library')}/>
                    <MainMaterials />
                    <ContentQuantity />
                </>
            )}
        </div>
    );
}