import Header from "./component/Header";
import Main from "./component/Main"

export default function App() {
    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <Header />
            <Main />
        </div>
    );
}