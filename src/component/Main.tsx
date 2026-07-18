export default function Main() {
  return (
    <main className="mx-auto w-full max-w-[var(--page-max-width)] px-[var(--page-padding)] py-16">
      <p className="text-[var(--sm-letter)] text-sm font-medium text-primary">Início</p>

      <h2 className="text-[var(--title-letter)] mt-2 text-3xl font-semibold tracking-tight text-foreground">Escolha um transtorno para começar</h2>

      <p className="text-[var(--description-letter)] mt-2 max-w-2xl text-muted-foreground">
        Cada módulo reúne informações, estratégias, atividades e jogos
        organizados para apoiar seus atendimentos.
      </p>

      <div className="mt-10 flex gap-3">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-white px-4 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0 text-[var(--secondary-text)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="Pesquisar transtorno, sigla ou área..."
            className="w-full bg-transparent text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]"
          />
        </div>

        <button
          type="button"
          className="flex h-12 cursor-pointer items-center gap-2 rounded-2xl border-0 bg-white px-5 text-sm font-semibold text-[var(--primary-text)] shadow-[0_2px_8px_var(--control-shadow)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--logo-color)]"
        >
          <span className="text-xl font-light">+</span>
          Novo módulo
        </button>
      </div>
    </main>
  );
}
