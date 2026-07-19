type HeaderProps = {
    onOpenLibrary: () => void;
}

export default function Header({ onOpenLibrary }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[var(--page-max-width)] items-center justify-between px-[var(--page-padding)]">
        <div className="flex items-center gap-3">
            <button
                type="button"
                className="flex cursor-pointer items-center gap-2 text-[var(--description-letter)] hover:text-[var(--logo-color)]"
                onClick={ onOpenLibrary }
                >
                <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>

                Voltar
            </button>
        </div>

        <nav className="flex items-center gap-6">
          <button className="cursor-pointer font-medium text-slate-500 hover:text-slate-900" onClick={ onOpenLibrary }>
            Biblioteca
          </button>

          <button className="cursor-pointer font-medium text-slate-900">
            Materiais
          </button>
        </nav>
      </div>
    </header>
  );
}