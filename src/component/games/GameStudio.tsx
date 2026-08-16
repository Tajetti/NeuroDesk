import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, BookOpen, Brain, CheckCircle2, CircleDot, Clock3, GitCompareArrows, Grid2X2, Grid3X3, ListOrdered, MoreHorizontal, PencilLine, Play, Plus, Save, Search, Shapes, Shuffle, Timer, Trash2, X } from "lucide-react"

import type { GameProject, GameType } from "../../games/gameType"
import GameConfigEditor from "./GameConfigEditor"
import GamePlayer from "./GamePlayer"

type GameStudioProps = { onBack: () => void }
type Screen = "library" | "editor" | "preview"

const templates: Array<{ type: GameType; title: string; description: string; group: string; icon: typeof Grid2X2 }> = [
    { type: "quiz", title: "Quiz", description: "Perguntas com alternativas", group: "Perguntas e respostas", icon: Brain },
    { type: "true-false", title: "Verdadeiro ou falso", description: "Afirmações para avaliar", group: "Perguntas e respostas", icon: CheckCircle2 },
    { type: "memory", title: "Jogo da memória", description: "Pares de palavras ou imagens", group: "Memorização", icon: Grid2X2 },
    { type: "flashcards", title: "Cartões de estudo", description: "Conteúdo com frente e verso", group: "Memorização", icon: BookOpen },
    { type: "association", title: "Associação", description: "Itens e seus correspondentes", group: "Organização", icon: GitCompareArrows },
    { type: "sequence", title: "Colocar em ordem", description: "Etapas ou acontecimentos", group: "Organização", icon: ListOrdered },
    { type: "scramble", title: "Desembaralhar", description: "Palavras acompanhadas de pistas", group: "Palavras e dinâmicas", icon: Shuffle },
    { type: "wheel", title: "Roleta", description: "Sorteios, perguntas ou desafios", group: "Palavras e dinâmicas", icon: CircleDot },
    { type: "fill-blank", title: "Complete a frase", description: "Frases com palavras faltando", group: "Palavras e dinâmicas", icon: PencilLine },
    { type: "categories", title: "Classificação", description: "Organize itens em grupos", group: "Organização", icon: Shapes },
    { type: "bingo", title: "Bingo", description: "Cartela para dinâmica em grupo", group: "Dinâmicas em sala", icon: Grid3X3 },
    { type: "rapid-response", title: "Resposta rápida", description: "Perguntas para revisão oral", group: "Dinâmicas em sala", icon: Timer }
]

const groups = ["Perguntas e respostas", "Memorização", "Organização", "Palavras e dinâmicas", "Dinâmicas em sala"]

function templateFor(type: GameType) {
    return templates.find((template) => template.type === type) ?? templates[0]
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value))
}

export default function GameStudio({ onBack }: GameStudioProps) {
    const [games, setGames] = useState<GameProject[]>([])
    const [draft, setDraft] = useState<GameProject | null>(null)
    const [screen, setScreen] = useState<Screen>("library")
    const [previewOrigin, setPreviewOrigin] = useState<"library" | "editor">("library")
    const [showTemplates, setShowTemplates] = useState(false)
    const [gameToDelete, setGameToDelete] = useState<GameProject | null>(null)
    const [search, setSearch] = useState("")
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved")
    const lastSaved = useRef("")

    useEffect(() => {
        window.gamesApi.list().then(setGames).catch((error) => console.error("Erro ao carregar jogos: ", error))
    }, [])

    const filteredGames = useMemo(() => {
        const term = search.trim().toLocaleLowerCase("pt-BR")
        if (!term) return games
        return games.filter((game) => game.name.toLocaleLowerCase("pt-BR").includes(term) || templateFor(game.type).title.toLocaleLowerCase("pt-BR").includes(term))
    }, [games, search])

    useEffect(() => {
        if (!draft || screen !== "editor") return
        const signature = JSON.stringify({ name: draft.name, config: draft.config })
        if (signature === lastSaved.current) return
        setSaveStatus("saving")
        const timeout = window.setTimeout(async () => {
            try {
                const updated = await window.gamesApi.update({ id: draft.id, name: draft.name.trim() || "Atividade sem título", config: draft.config })
                lastSaved.current = signature
                setGames((current) => current.map((game) => game.id === updated.id ? updated : game))
                setSaveStatus("saved")
            } catch (error) {
                console.error("Erro ao salvar jogo: ", error)
                setSaveStatus("error")
            }
        }, 600)
        return () => window.clearTimeout(timeout)
    }, [draft, screen])

    function openGame(game: GameProject) {
        setDraft(game)
        lastSaved.current = JSON.stringify({ name: game.name, config: game.config })
        setSaveStatus("saved")
        setScreen("editor")
    }

    function playGame(game: GameProject) {
        setDraft(game)
        lastSaved.current = JSON.stringify({ name: game.name, config: game.config })
        setPreviewOrigin("library")
        setScreen("preview")
    }

    async function createGame(type: GameType) {
        const model = templateFor(type)
        const created = await window.gamesApi.create({ name: `Nova atividade de ${model.title.toLocaleLowerCase("pt-BR")}`, type })
        setGames((current) => [created, ...current])
        setShowTemplates(false)
        openGame(created)
    }

    async function persistBeforeLeaving(nextScreen: Screen) {
        if (!draft) return
        const signature = JSON.stringify({ name: draft.name, config: draft.config })
        if (signature !== lastSaved.current) {
            try {
                setSaveStatus("saving")
                const updated = await window.gamesApi.update({ id: draft.id, name: draft.name.trim() || "Atividade sem título", config: draft.config })
                lastSaved.current = signature
                setGames((current) => current.map((game) => game.id === updated.id ? updated : game))
                setSaveStatus("saved")
            } catch (error) {
                console.error("Erro ao salvar jogo: ", error)
                setSaveStatus("error")
                return
            }
        }
        setScreen(nextScreen)
    }

    async function deleteGame() {
        if (!draft || !window.confirm(`Excluir a atividade “${draft.name}”?`)) return
        await window.gamesApi.delete(draft.id)
        setGames((current) => current.filter((game) => game.id !== draft.id))
        setDraft(null)
        setScreen("library")
    }

    async function confirmLibraryDelete() {
        if (!gameToDelete) return
        await window.gamesApi.delete(gameToDelete.id)
        setGames((current) => current.filter((game) => game.id !== gameToDelete.id))
        if (draft?.id === gameToDelete.id) setDraft(null)
        setGameToDelete(null)
    }

    return (
        <div className={`min-h-screen text-[var(--primary-text)] ${screen === "editor" ? "bg-white" : "bg-[var(--bg-color)]"}`}>
            {screen === "library" && <header className="border-b border-[var(--border-color)] bg-white">
                <div className="mx-auto flex h-20 max-w-[var(--page-max-width)] items-center justify-between px-5 md:px-[var(--page-padding)]">
                    <button type="button" onClick={onBack} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--description-letter)] transition hover:text-[var(--logo-color)]"><ArrowLeft size={18} /> Biblioteca</button>
                    <span className="text-base font-semibold tracking-tight text-[var(--title-letter)]">Jogos</span>
                    <button type="button" onClick={() => setShowTemplates(true)} className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--bg-button)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_3px_8px_var(--control-shadow)] transition hover:brightness-95 active:scale-[0.98]"><Plus size={17} /> Nova atividade</button>
                </div>
            </header>}

            {screen === "library" && <Library games={filteredGames} total={games.length} search={search} onSearch={setSearch} onPlay={playGame} onEdit={openGame} onDelete={setGameToDelete} onCreate={() => setShowTemplates(true)} />}
            {draft && screen === "editor" && <Editor draft={draft} saveStatus={saveStatus} onChange={setDraft} onBack={() => persistBeforeLeaving("library")} onPreview={() => { setPreviewOrigin("editor"); persistBeforeLeaving("preview") }} onComplete={() => persistBeforeLeaving("library")} onDelete={deleteGame} />}
            {draft && screen === "preview" && <Preview draft={draft} returnTo={previewOrigin} onBack={() => setScreen(previewOrigin)} />}
            {showTemplates && <TemplateGallery onClose={() => setShowTemplates(false)} onChoose={createGame} />}
            {gameToDelete && <DeleteGameDialog game={gameToDelete} onCancel={() => setGameToDelete(null)} onConfirm={confirmLibraryDelete} />}
        </div>
    )
}

function Library({ games, total, search, onSearch, onPlay, onEdit, onDelete, onCreate }: { games: GameProject[]; total: number; search: string; onSearch: (value: string) => void; onPlay: (game: GameProject) => void; onEdit: (game: GameProject) => void; onDelete: (game: GameProject) => void; onCreate: () => void }) {
    return (
        <main className="mx-auto max-w-[var(--page-max-width)] px-5 py-12 md:px-[var(--page-padding)]">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div><p className="text-sm font-medium text-[var(--sm-letter)]">Jogos</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--title-letter)]">Suas atividades</h1><p className="mt-2 text-[var(--description-letter)]">Prepare, organize e teste os jogos que serão usados em aula.</p></div>
                {total > 0 && <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-white px-4 shadow-[0_2px_5px_var(--control-shadow)] focus-within:border-[var(--logo-color)] focus-within:ring-2 focus-within:ring-[var(--logo-color)]/15 sm:w-80"><Search size={18} className="text-[var(--secondary-text)]" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar atividade" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]" /></label>}
            </div>

            {total === 0 ? (
                <div className="mt-20 max-w-lg">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--logo-color)]/10 text-[var(--logo-color)]"><BookOpen size={22} /></div>
                    <h2 className="mt-5 text-xl font-semibold text-[var(--title-letter)]">Comece pela sua primeira atividade</h2>
                    <p className="mt-2 leading-7 text-[var(--description-letter)]">Escolha um formato e troque o conteúdo de exemplo pelo assunto que está trabalhando com a turma.</p>
                    <button type="button" onClick={onCreate} className="mt-6 cursor-pointer rounded-xl bg-[var(--bg-button)] px-5 py-3 text-sm font-semibold text-white shadow-[0_3px_8px_var(--control-shadow)] transition hover:brightness-95">Criar atividade</button>
                </div>
            ) : games.length === 0 ? <p className="mt-16 text-[var(--description-letter)]">Nenhuma atividade encontrada para “{search}”.</p> : (
                <div className="mt-9 grid gap-4 lg:grid-cols-2">
                    {games.map((game) => {
                        const model = templateFor(game.type)
                        const Icon = model.icon
                        return <article key={game.id} className="group flex min-h-36 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-white shadow-[0_5px_18px_rgba(23,37,50,0.04)] transition duration-200 hover:border-[var(--logo-color)]/40 hover:shadow-[0_8px_24px_rgba(23,37,50,0.08)]">
                            <button type="button" onClick={() => onPlay(game)} aria-label={`Jogar ${game.name}`} className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 px-5 py-4 text-left">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--logo-color)]/10 text-[var(--logo-color)]"><Icon size={20} /></span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-base font-semibold text-[var(--title-letter)]">{game.name}</span>
                                    <span className="mt-1 block text-sm text-[var(--description-letter)]">{model.title}</span>
                                    <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--secondary-text)]"><span className="flex items-center gap-1.5 transition-colors group-hover:text-[var(--logo-color)]"><Play size={13} /> Clique para jogar</span><span className="flex items-center gap-1.5"><Clock3 size={13} /> {formatDate(game.updatedAt)}</span></span>
                                </span>
                            </button>
                            <div className="flex shrink-0 flex-col justify-center gap-1 border-l border-[var(--border-color)] px-3">
                                <button type="button" onClick={() => onEdit(game)} aria-label={`Editar ${game.name}`} title="Editar" className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-[var(--description-letter)] transition hover:bg-[var(--hover-section)] hover:text-[var(--logo-color)]"><PencilLine size={17} /></button>
                                <button type="button" onClick={() => onDelete(game)} aria-label={`Excluir ${game.name}`} title="Excluir" className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-[var(--description-letter)] transition hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button>
                            </div>
                        </article>
                    })}
                </div>
            )}
        </main>
    )
}

function Editor({ draft, saveStatus, onChange, onBack, onPreview, onComplete, onDelete }: { draft: GameProject; saveStatus: "saved" | "saving" | "error"; onChange: (game: GameProject) => void; onBack: () => void; onPreview: () => void; onComplete: () => void; onDelete: () => void }) {
    const model = templateFor(draft.type)
    return (
        <main className="mx-auto max-w-6xl px-5 py-8 md:px-[var(--page-padding)]">
            <div className="flex items-center justify-between gap-4">
                <button type="button" onClick={onBack} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--description-letter)] transition hover:text-[var(--logo-color)]"><ArrowLeft size={17} /> Atividades</button>
                <div className="flex items-center gap-4">
                    <SaveIndicator status={saveStatus} />
                    <ActivityMenu onPreview={onPreview} onDelete={onDelete} />
                </div>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
                <section className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-white shadow-[0_12px_35px_rgba(23,37,50,0.05)]">
                    <div className="border-b border-[var(--border-color)] px-7 pb-7 pt-7">
                        <div className="flex items-center gap-3 text-sm font-medium text-[var(--sm-letter)]"><span className="flex size-9 items-center justify-center rounded-xl bg-[var(--logo-color)]/10 text-[var(--logo-color)]"><model.icon size={18} /></span>{model.title}</div>
                        <input aria-label="Nome da atividade" value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} className="mt-4 w-full border-none bg-transparent text-4xl font-semibold tracking-tight text-[var(--title-letter)] outline-none placeholder:text-[var(--secondary-text)]" placeholder="Nome da atividade" />
                        <p className="mt-2 text-sm text-[var(--description-letter)]">As alterações são salvas automaticamente enquanto você edita.</p>
                    </div>
                    <div className="px-7 py-2 pb-9"><GameConfigEditor config={draft.config} onChange={(config) => onChange({ ...draft, config })} /></div>
                    <div className="flex justify-end px-7 pb-7">
                        <button type="button" onClick={onComplete} className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--bg-button)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_3px_8px_var(--control-shadow)] transition hover:brightness-95 active:scale-[0.98]">{saveStatus === "saving" ? <Save className="animate-pulse" size={16} /> : <CheckCircle2 size={16} />} {saveStatus === "saving" ? "Salvando…" : "Jogo configurado"}</button>
                    </div>
                </section>

            </div>
        </main>
    )
}

function SaveIndicator({ status }: { status: "saved" | "saving" | "error" }) {
    if (status === "error") return <span className="text-sm font-medium text-red-600">Erro ao salvar</span>
    return <span className="flex items-center gap-2 text-sm text-[var(--secondary-text)]"><span className={`size-2 rounded-full ${status === "saving" ? "animate-pulse bg-amber-400" : "bg-[var(--logo-color)]"}`} />{status === "saving" ? "Salvando…" : "Salvo"}</span>
}

function ActivityMenu({ onPreview, onDelete }: { onPreview: () => void; onDelete: () => void }) {
    return <details className="group relative">
        <summary aria-label="Opções da atividade" className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl text-[var(--description-letter)] transition hover:bg-[var(--hover-section)] hover:text-[var(--primary-text)] [&::-webkit-details-marker]:hidden"><MoreHorizontal size={21} /></summary>
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-white p-1.5 shadow-[0_12px_30px_rgba(23,37,50,0.14)]">
            <button type="button" onClick={onPreview} className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--primary-text)] hover:bg-[var(--hover-section)]"><Play size={16} /> Abrir visualização</button>
            <button type="button" onClick={onDelete} className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"><Trash2 size={16} /> Excluir</button>
        </div>
    </details>
}

function DeleteGameDialog({ game, onCancel, onConfirm }: { game: GameProject; onCancel: () => void; onConfirm: () => void }) {
    return <div role="presentation" className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--title-letter)]/40 p-5" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
        <section role="dialog" aria-modal="true" aria-labelledby="delete-game-title" className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_18px_50px_rgba(23,37,50,0.20)]">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Trash2 size={22} /></span>
            <h2 id="delete-game-title" className="mt-5 text-xl font-semibold text-[var(--title-letter)]">Excluir esta atividade?</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--description-letter)]">“{game.name}” será excluída permanentemente. Essa ação não poderá ser desfeita.</p>
            <div className="mt-7 flex justify-end gap-3 border-t border-[var(--border-color)] pt-5">
                <button type="button" onClick={onCancel} className="h-11 cursor-pointer rounded-xl border border-[var(--border-color)] px-5 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-[var(--hover-section)]">Cancelar</button>
                <button type="button" onClick={onConfirm} className="h-11 cursor-pointer rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700">Excluir atividade</button>
            </div>
        </section>
    </div>
}

function Preview({ draft, returnTo, onBack }: { draft: GameProject; returnTo: "library" | "editor"; onBack: () => void }) {
    return <div className="min-h-[calc(100vh-5rem)] bg-[var(--bg-color)]"><div className="border-b border-[var(--border-color)] bg-white px-6 py-3"><div className="mx-auto flex max-w-6xl items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">Modo de jogo</p><p className="mt-0.5 font-semibold text-[var(--title-letter)]">{draft.name}</p></div><button type="button" onClick={onBack} className="cursor-pointer rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-[var(--hover-section)]">{returnTo === "editor" ? "Voltar ao editor" : "Voltar às atividades"}</button></div></div><main className="mx-auto max-w-6xl px-6 py-10"><GamePlayer key={`${draft.id}-${JSON.stringify(draft.config)}`} config={draft.config} /></main></div>
}

function TemplateGallery({ onClose, onChoose }: { onClose: () => void; onChoose: (type: GameType) => void }) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--title-letter)]/40 px-4 py-10">
            <section className="mx-auto w-full max-w-4xl rounded-3xl bg-white shadow-[0_18px_50px_rgba(23,37,50,0.18)]">
                <div className="flex items-start justify-between border-b border-[var(--border-color)] px-7 py-6"><div><p className="text-sm font-medium text-[var(--sm-letter)]">Jogos</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--title-letter)]">Criar uma atividade</h2><p className="mt-1 text-[var(--description-letter)]">Escolha o formato que combina melhor com a sua aula.</p></div><button type="button" aria-label="Fechar" onClick={onClose} className="cursor-pointer rounded-xl p-2 text-[var(--description-letter)] hover:bg-[var(--hover-section)]"><X size={20} /></button></div>
                <div className="space-y-8 px-7 py-7">
                    {groups.map((group) => <div key={group}><h3 className="mb-3 text-sm font-semibold text-[var(--primary-text)]">{group}</h3><div className="grid gap-3 sm:grid-cols-2">
                        {templates.filter((template) => template.group === group).map((template) => { const Icon = template.icon; return <button key={template.type} type="button" onClick={() => onChoose(template.type)} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[var(--border-color)] p-4 text-left transition hover:border-[var(--logo-color)] hover:bg-[var(--hover-section)]"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--logo-color)]/10 text-[var(--logo-color)]"><Icon size={20} /></span><span className="min-w-0"><span className="block font-semibold text-[var(--title-letter)]">{template.title}</span><span className="mt-0.5 block text-sm text-[var(--description-letter)]">{template.description}</span></span></button> })}
                    </div></div>)}
                </div>
            </section>
        </div>
    )
}
