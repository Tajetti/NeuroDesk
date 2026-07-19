import logo from '../../assets/logo.png';

type HeaderProps = {
  onOpenMaterials: () => void;
}

export default function Header({ onOpenMaterials }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[var(--page-max-width)] items-center justify-between px-[var(--page-padding)]">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo do NeuroDesk"
            className="size-12 object-contain"
          />

          <div>
            <h1 className="text-xl font-bold text-slate-900">NeuroDesk</h1>
            <p className="text-sm text-slate-500">
              Apoio terapêutico profissional
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button className="cursor-pointer font-medium text-slate-900">
            Biblioteca
          </button>

          <button 
          type='button'
          onClick={onOpenMaterials}
          className="cursor-pointer font-medium text-slate-500 hover:text-slate-900"
          >
            Materiais
          </button>
        </nav>
      </div>
    </header>
  );
}