import { useMemo, useState } from "react"
import { CheckCircle2, RotateCcw } from "lucide-react"

import type { AssociationGameConfig, BingoGameConfig, CategoriesGameConfig, FillBlankGameConfig, FlashcardGameConfig, GameConfig, QuizGameConfig, RapidResponseGameConfig, ScrambleGameConfig, SequenceGameConfig, TrueFalseGameConfig, WheelGameConfig } from "../../games/gameType"
import MemoryGamePlayer from "./MemoryGamePlayer"

export type GameResult = { correct: number; incorrect: number; completed: number; label?: string }
type PlayerProps<T> = { config: T; onFinish: (result: GameResult) => void }

export default function GamePlayer({ config }: { config: GameConfig }) {
    const [result,setResult]=useState<GameResult|null>(null); const [session,setSession]=useState(0)
    if(result)return <ResultScreen result={result} onReplay={()=>{setResult(null);setSession(value=>value+1)}} />
    const props={onFinish:setResult}
    if (config.kind === "memory") return <MemoryGamePlayer key={session} config={config} onFinish={setResult} />
    if (config.kind === "quiz") return <QuizPlayer key={session} config={config} {...props} />
    if (config.kind === "true-false") return <TrueFalsePlayer key={session} config={config} {...props} />
    if (config.kind === "association") return <AssociationPlayer key={session} config={config} {...props} />
    if (config.kind === "flashcards") return <FlashcardPlayer key={session} config={config} {...props} />
    if (config.kind === "sequence") return <SequencePlayer key={session} config={config} {...props} />
    if (config.kind === "scramble") return <ScramblePlayer key={session} config={config} {...props} />
    if (config.kind === "wheel") return <WheelPlayer key={session} config={config} {...props} />
    if (config.kind === "fill-blank") return <FillBlankPlayer key={session} config={config} {...props} />
    if (config.kind === "categories") return <CategoriesPlayer key={session} config={config} {...props} />
    if (config.kind === "bingo") return <BingoPlayer key={session} config={config} {...props} />
    return <RapidResponsePlayer key={session} config={config} {...props} />
}

function ResultScreen({result,onReplay}:{result:GameResult;onReplay:()=>void}){const attempts=result.correct+result.incorrect;const percentage=attempts?Math.round(result.correct/attempts*100):100;return <section className="rounded-3xl border border-[var(--border-color)] bg-white p-8 text-center shadow-sm"><span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--hover-section)] text-[var(--logo-color)]"><CheckCircle2 size={32}/></span><p className="mt-5 text-sm font-semibold text-[var(--logo-color)]">Atividade finalizada</p><h2 className="mt-1 text-3xl font-semibold text-[var(--title-letter)]">Resultado da atividade</h2><p className="mt-2 text-[var(--description-letter)]">{result.label??"Veja como foi o desempenho nesta rodada."}</p><div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3"><ResultMetric value={result.correct} label="Acertos" tone="success"/><ResultMetric value={result.incorrect} label="Erros" tone="error"/><ResultMetric value={`${percentage}%`} label="Aproveitamento" tone="neutral"/></div><p className="mt-5 text-sm text-[var(--secondary-text)]">{result.completed} {result.completed===1?"item concluído":"itens concluídos"}</p><button type="button" onClick={onReplay} className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--bg-button)] px-5 py-3 font-semibold text-white"><RotateCcw size={17}/> Jogar novamente</button></section>}
function ResultMetric({value,label,tone}:{value:number|string;label:string;tone:"success"|"error"|"neutral"}){const color=tone==="success"?"text-emerald-600":tone==="error"?"text-red-600":"text-[var(--logo-color)]";return <div className="rounded-2xl bg-[var(--background-input)] p-5"><strong className={`block text-3xl ${color}`}>{value}</strong><span className="mt-1 block text-sm text-[var(--description-letter)]">{label}</span></div>}

function QuizPlayer({ config,onFinish }: PlayerProps<QuizGameConfig>) {
    const [index, setIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [answered, setAnswered] = useState<number | null>(null)
    const question = config.questions[index]
    if (!question) return <EmptyGame />

    function answer(optionIndex: number) {
        if (answered !== null) return
        setAnswered(optionIndex)
        if (optionIndex === question.correctIndex) setScore((value) => value + 1)
    }
    function next(){if(index===config.questions.length-1){onFinish({correct:score,incorrect:config.questions.length-score,completed:config.questions.length});return}setIndex(index+1);setAnswered(null)}

    return (
        <div className="rounded-3xl p-8" style={{ backgroundColor: config.backgroundColor }}>
            <p className="text-sm font-semibold text-slate-500">Pergunta {index + 1} de {config.questions.length} · Pontos: {score}</p>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">{question.prompt}</h3>
            <div className="mt-6 grid gap-3">
                {question.options.map((option, optionIndex) => (
                    <button key={optionIndex} type="button" onClick={() => answer(optionIndex)} className={`cursor-pointer rounded-2xl border bg-white p-4 text-left font-semibold ${answered !== null && optionIndex === question.correctIndex ? "border-emerald-500 text-emerald-700" : answered === optionIndex ? "border-red-400 text-red-600" : "border-slate-200"}`}>{option}</button>
                ))}
            </div>
            {answered !== null && <button type="button" onClick={next} className="mt-6 cursor-pointer rounded-xl bg-cyan-700 px-5 py-3 font-semibold text-white">{index===config.questions.length-1?"Ver resultado":"Próxima pergunta"}</button>}
        </div>
    )
}

function TrueFalsePlayer({ config,onFinish }: PlayerProps<TrueFalseGameConfig>) {
    const [index, setIndex] = useState(0)
    const [answer, setAnswer] = useState<boolean | null>(null)
    const [score,setScore]=useState(0)
    const statement = config.statements[index]
    if (!statement) return <EmptyGame />
    const correct = answer === statement.answer
    const next=()=>{const finalScore=score+(correct?1:0);if(index===config.statements.length-1){onFinish({correct:finalScore,incorrect:config.statements.length-finalScore,completed:config.statements.length});return}setScore(finalScore);setIndex(index+1);setAnswer(null)}
    return (
        <div className="rounded-3xl p-8 text-center" style={{ backgroundColor: config.backgroundColor }}>
            <p className="text-sm font-semibold text-slate-500">Afirmação {index + 1} de {config.statements.length}</p>
            <h3 className="mx-auto mt-8 max-w-2xl text-2xl font-bold">{statement.text}</h3>
            <div className="mt-8 flex justify-center gap-4">
                <button type="button" onClick={() => setAnswer(true)} className="cursor-pointer rounded-2xl bg-emerald-600 px-8 py-4 font-bold text-white">Verdadeiro</button>
                <button type="button" onClick={() => setAnswer(false)} className="cursor-pointer rounded-2xl bg-red-500 px-8 py-4 font-bold text-white">Falso</button>
            </div>
            {answer !== null && <div className={`mt-6 rounded-2xl bg-white p-4 font-semibold ${correct ? "text-emerald-700" : "text-red-600"}`}><p>{correct ? "Acertou!" : "Tente lembrar:"}</p><p className="mt-1 font-normal text-slate-600">{statement.explanation}</p><button type="button" onClick={next} className="mt-4 cursor-pointer text-cyan-700">{index===config.statements.length-1?"Ver resultado":"Continuar →"}</button></div>}
        </div>
    )
}

function AssociationPlayer({ config,onFinish }: PlayerProps<AssociationGameConfig>) {
    const rightItems = useMemo(() => [...config.pairs].sort(() => Math.random() - 0.5), [config])
    const [selected, setSelected] = useState<string | null>(null)
    const [matched, setMatched] = useState<string[]>([])
    const [errors,setErrors]=useState(0)

    function chooseRight(pairId: string) {
        if (!selected) return
        if (selected === pairId) { const next=[...matched,pairId];setMatched(next);if(next.length===config.pairs.length)window.setTimeout(()=>onFinish({correct:config.pairs.length,incorrect:errors,completed:config.pairs.length}),500) }
        else setErrors(value=>value+1)
        setSelected(null)
    }

    return (
        <div className="rounded-3xl p-8" style={{ backgroundColor: config.backgroundColor }}>
            <p className="mb-5 text-center font-semibold text-slate-600">Escolha um item da esquerda e encontre seu par.</p>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">{config.pairs.map((pair) => <button key={pair.id} disabled={matched.includes(pair.id)} type="button" onClick={() => setSelected(pair.id)} className={`w-full cursor-pointer rounded-2xl bg-white p-4 font-semibold disabled:opacity-30 ${selected === pair.id ? "ring-2 ring-cyan-500" : ""}`}>{pair.left}</button>)}</div>
                <div className="space-y-3">{rightItems.map((pair) => <button key={pair.id} disabled={matched.includes(pair.id)} type="button" onClick={() => chooseRight(pair.id)} className="w-full cursor-pointer rounded-2xl bg-white p-4 font-semibold disabled:bg-emerald-100 disabled:text-emerald-700">{pair.right}</button>)}</div>
            </div>
            {matched.length === config.pairs.length && <p className="mt-6 text-center font-bold text-emerald-700">Tudo associado corretamente!</p>}
        </div>
    )
}

function FlashcardPlayer({ config,onFinish }: PlayerProps<FlashcardGameConfig>) {
    const [index, setIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [correct,setCorrect]=useState(0)
    const card = config.cards[index]
    if (!card) return <EmptyGame />
    const assess=(gotIt:boolean)=>{const nextCorrect=correct+(gotIt?1:0);if(index===config.cards.length-1){onFinish({correct:nextCorrect,incorrect:config.cards.length-nextCorrect,completed:config.cards.length,label:"Cartões lembrados e conteúdos para revisar."});return}setCorrect(nextCorrect);setIndex(index+1);setFlipped(false)}
    return <div className="rounded-3xl p-8 text-center" style={{backgroundColor:config.backgroundColor}}><p className="text-sm font-semibold text-slate-500">Cartão {index+1} de {config.cards.length}</p><button type="button" onClick={()=>setFlipped(!flipped)} className="mx-auto mt-6 flex min-h-64 w-full max-w-xl cursor-pointer items-center justify-center rounded-3xl bg-white p-10 text-2xl font-bold shadow-md">{flipped?card.back:card.front}</button><p className="mt-3 text-sm text-slate-500">Clique no cartão para virar</p>{flipped&&<div className="mt-5 flex justify-center gap-3"><button type="button" onClick={()=>assess(false)} className="cursor-pointer rounded-xl border border-[var(--border-color)] bg-white px-5 py-3 font-semibold text-[var(--description-letter)]">Preciso revisar</button><button type="button" onClick={()=>assess(true)} className="cursor-pointer rounded-xl bg-[var(--bg-button)] px-5 py-3 font-semibold text-white">Acertei</button></div>}</div>
}

function SequencePlayer({ config,onFinish }: PlayerProps<SequenceGameConfig>) {
    const shuffled = useMemo(()=>[...config.items].sort(()=>Math.random()-.5),[config])
    const [nextIndex,setNextIndex]=useState(0)
    const [message,setMessage]=useState("")
    const [errors,setErrors]=useState(0)
    const choose=(id:string)=>{if(id===config.items[nextIndex]?.id){const next=nextIndex+1;setNextIndex(next);setMessage("Muito bem!");if(next===config.items.length)window.setTimeout(()=>onFinish({correct:config.items.length,incorrect:errors,completed:config.items.length}),500)}else{setErrors(value=>value+1);setMessage("Tente outra opção.")}}
    return <div className="rounded-3xl p-8" style={{backgroundColor:config.backgroundColor}}><h3 className="text-center text-xl font-bold">Clique nos itens na ordem correta</h3><div className="mt-6 grid gap-3">{shuffled.map(item=><button key={item.id} disabled={config.items.findIndex(value=>value.id===item.id)<nextIndex} type="button" onClick={()=>choose(item.id)} className="cursor-pointer rounded-2xl bg-white p-4 font-semibold disabled:bg-emerald-100 disabled:text-emerald-700">{item.text}</button>)}</div><p className="mt-4 text-center font-semibold text-cyan-800">{nextIndex===config.items.length?"Sequência concluída!":message}</p></div>
}

function ScramblePlayer({ config,onFinish }: PlayerProps<ScrambleGameConfig>) {
    const [index,setIndex]=useState(0); const [guess,setGuess]=useState(""); const [message,setMessage]=useState("")
    const [errors,setErrors]=useState(0)
    const item=config.words[index]
    const shuffled=useMemo(()=>item?.word.split("").sort(()=>Math.random()-.5).join(" ") ?? "",[item])
    if(!item)return <EmptyGame />
    const verify=()=>{if(guess.trim().toLocaleUpperCase("pt-BR")===item.word.trim().toLocaleUpperCase("pt-BR")){setMessage("Acertou!")}else{setErrors(value=>value+1);setMessage("Ainda não. Tente novamente.")}}
    const next=()=>{if(index===config.words.length-1){onFinish({correct:config.words.length,incorrect:errors,completed:config.words.length});return}setIndex(index+1);setGuess("");setMessage("")}
    return <div className="rounded-3xl p-8 text-center" style={{backgroundColor:config.backgroundColor}}><p className="text-sm font-semibold text-slate-500">Dica: {item.hint}</p><p className="mt-8 text-4xl font-bold tracking-widest">{shuffled}</p><input value={guess} onChange={e=>setGuess(e.target.value)} onKeyDown={e=>e.key==="Enter"&&verify()} className="module-input mx-auto mt-8 max-w-md text-center" placeholder="Digite a palavra"/><div><button type="button" onClick={verify} className="mt-4 cursor-pointer rounded-xl bg-cyan-700 px-6 py-3 font-bold text-white">Conferir</button></div><p className="mt-4 font-semibold">{message}</p>{message==="Acertou!"&&<button type="button" onClick={next} className="mt-2 cursor-pointer text-cyan-800">{index===config.words.length-1?"Ver resultado":"Próxima palavra →"}</button>}</div>
}

function WheelPlayer({ config,onFinish }: PlayerProps<WheelGameConfig>) {
    const [result,setResult]=useState(""); const [spinning,setSpinning]=useState(false)
    const [rounds,setRounds]=useState(0)
    const spin=()=>{setSpinning(true);setResult("");window.setTimeout(()=>{setResult(config.options[Math.floor(Math.random()*config.options.length)]?.text??"");setRounds(value=>value+1);setSpinning(false)},900)}
    if(!config.options.length)return <EmptyGame />
    return <div className="rounded-3xl p-10 text-center" style={{backgroundColor:config.backgroundColor}}><div className={`mx-auto flex size-72 items-center justify-center rounded-full border-[14px] border-dashed border-cyan-600 bg-white p-8 text-2xl font-bold shadow-lg ${spinning?"animate-spin":""}`}>{spinning?"":"Gire a roleta"}</div><div className="mt-8 flex justify-center gap-3"><button type="button" disabled={spinning} onClick={spin} className="cursor-pointer rounded-xl bg-cyan-700 px-8 py-4 text-lg font-bold text-white disabled:opacity-50">{spinning?"Girando...":"Girar"}</button>{rounds>0&&<button type="button" disabled={spinning} onClick={()=>onFinish({correct:rounds,incorrect:0,completed:rounds,label:"Resumo dos sorteios realizados nesta rodada."})} className="cursor-pointer rounded-xl border border-[var(--border-color)] bg-white px-6 py-4 font-semibold">Finalizar</button>}</div>{result&&<p className="mx-auto mt-6 max-w-lg rounded-2xl bg-white p-5 text-2xl font-bold text-cyan-800">{result}</p>}</div>
}

function FillBlankPlayer({ config,onFinish }: PlayerProps<FillBlankGameConfig>) {
    const [index,setIndex]=useState(0); const [answer,setAnswer]=useState(""); const [message,setMessage]=useState("")
    const [errors,setErrors]=useState(0)
    const item=config.items[index]
    if(!item)return <EmptyGame />
    const verify=()=>{if(answer.trim().toLocaleLowerCase("pt-BR")===item.answer.trim().toLocaleLowerCase("pt-BR"))setMessage("Muito bem!");else{setErrors(value=>value+1);setMessage("Tente novamente.")}}
    const next=()=>{if(index===config.items.length-1){onFinish({correct:config.items.length,incorrect:errors,completed:config.items.length});return}setIndex(index+1);setAnswer("");setMessage("")}
    return <div className="rounded-3xl p-8 text-center" style={{backgroundColor:config.backgroundColor}}><p className="text-sm font-semibold text-[var(--description-letter)]">Frase {index+1} de {config.items.length}</p><h3 className="mx-auto mt-8 max-w-3xl text-2xl font-bold text-[var(--title-letter)]">{item.sentence}</h3><input value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==="Enter"&&verify()} className="module-input mx-auto mt-8 max-w-md text-center" placeholder="Digite a palavra que falta"/><div><button type="button" onClick={verify} className="mt-4 cursor-pointer rounded-xl bg-[var(--bg-button)] px-6 py-3 font-semibold text-white">Conferir</button></div><p className="mt-4 font-semibold text-[var(--logo-color)]">{message}</p>{message==="Muito bem!"&&<button type="button" onClick={next} className="mt-2 cursor-pointer font-semibold text-[var(--logo-color)]">{index===config.items.length-1?"Ver resultado":"Próxima frase →"}</button>}</div>
}

function CategoriesPlayer({ config,onFinish }: PlayerProps<CategoriesGameConfig>) {
    const items=useMemo(()=>config.groups.flatMap(group=>group.items.filter(Boolean).map((text,index)=>({id:`${group.id}-${index}`,text,groupId:group.id}))).sort(()=>Math.random()-.5),[config])
    const [index,setIndex]=useState(0); const [score,setScore]=useState(0); const [errors,setErrors]=useState(0); const [message,setMessage]=useState("")
    const item=items[index]
    if(!item)return <EmptyGame />
    const choose=(groupId:string)=>{if(groupId===item.groupId){const nextScore=score+1;setScore(nextScore);setMessage("Correto!");window.setTimeout(()=>{if(index===items.length-1)onFinish({correct:nextScore,incorrect:errors,completed:items.length});else{setIndex(index+1);setMessage("")}},600)}else{setErrors(value=>value+1);setMessage("Esse item pertence a outro grupo.")}}
    return <div className="rounded-3xl p-8 text-center" style={{backgroundColor:config.backgroundColor}}><p className="text-sm font-semibold text-[var(--description-letter)]">Item {index+1} de {items.length} · Acertos: {score}</p><h3 className="mt-8 text-3xl font-bold text-[var(--title-letter)]">{item.text}</h3><p className="mt-2 text-[var(--description-letter)]">A qual grupo esse item pertence?</p><div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">{config.groups.map(group=><button key={group.id} type="button" onClick={()=>choose(group.id)} className="cursor-pointer rounded-2xl border border-[var(--border-color)] bg-white p-4 font-semibold text-[var(--primary-text)] hover:border-[var(--logo-color)]">{group.name}</button>)}</div><p className="mt-5 font-semibold text-[var(--logo-color)]">{message}</p></div>
}

function BingoPlayer({ config,onFinish }: PlayerProps<BingoGameConfig>) {
    const words=useMemo(()=>[...config.words].sort(()=>Math.random()-.5),[config]); const [marked,setMarked]=useState<string[]>([])
    const visible=words.slice(0,9)
    if(!visible.length)return <EmptyGame />
    const toggle=(id:string)=>setMarked(current=>current.includes(id)?current.filter(value=>value!==id):[...current,id])
    const bingo=visible.length>=3&&[0,1,2].some(row=>visible.slice(row*3,row*3+3).every(word=>marked.includes(word.id)))
    return <div className="rounded-3xl p-8 text-center" style={{backgroundColor:config.backgroundColor}}><h3 className="text-2xl font-bold text-[var(--title-letter)]">Bingo</h3><p className="mt-2 text-[var(--description-letter)]">Clique em uma palavra quando ela for sorteada.</p><div className="mx-auto mt-7 grid max-w-2xl grid-cols-3 gap-3">{visible.map(word=><button key={word.id} type="button" onClick={()=>toggle(word.id)} className={`min-h-24 cursor-pointer rounded-2xl border p-3 font-semibold transition ${marked.includes(word.id)?"border-[var(--logo-color)] bg-[var(--logo-color)] text-white":"border-[var(--border-color)] bg-white text-[var(--primary-text)]"}`}>{word.text}</button>)}</div>{bingo&&<div className="mt-6"><p className="text-2xl font-bold text-[var(--logo-color)]">Bingo!</p><button type="button" onClick={()=>onFinish({correct:marked.length,incorrect:0,completed:marked.length,label:"Cartela concluída com uma linha de bingo."})} className="mt-4 cursor-pointer rounded-xl bg-[var(--bg-button)] px-5 py-3 font-semibold text-white">Ver resultado</button></div>}</div>
}

function RapidResponsePlayer({ config,onFinish }: PlayerProps<RapidResponseGameConfig>) {
    const [index,setIndex]=useState(0); const [revealed,setRevealed]=useState(false); const [correct,setCorrect]=useState(0); const item=config.prompts[index]
    if(!item)return <EmptyGame />
    const assess=(gotIt:boolean)=>{const nextCorrect=correct+(gotIt?1:0);if(index===config.prompts.length-1){onFinish({correct:nextCorrect,incorrect:config.prompts.length-nextCorrect,completed:config.prompts.length,label:"Respostas conhecidas e perguntas para revisar."});return}setCorrect(nextCorrect);setIndex(index+1);setRevealed(false)}
    return <div className="rounded-3xl p-8 text-center" style={{backgroundColor:config.backgroundColor}}><p className="text-sm font-semibold text-[var(--description-letter)]">Pergunta {index+1} de {config.prompts.length}</p><h3 className="mx-auto mt-10 max-w-3xl text-3xl font-bold text-[var(--title-letter)]">{item.question}</h3>{revealed?<div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-white p-6"><p className="text-sm font-semibold text-[var(--description-letter)]">Resposta</p><p className="mt-2 text-2xl font-bold text-[var(--logo-color)]">{item.answer}</p></div>:<button type="button" onClick={()=>setRevealed(true)} className="mt-8 cursor-pointer rounded-xl bg-[var(--bg-button)] px-6 py-3 font-semibold text-white">Mostrar resposta</button>}{revealed&&<div className="mt-6 flex justify-center gap-3"><button type="button" onClick={()=>assess(false)} className="cursor-pointer rounded-xl border border-[var(--border-color)] bg-white px-5 py-3 font-semibold text-[var(--description-letter)]">Preciso revisar</button><button type="button" onClick={()=>assess(true)} className="cursor-pointer rounded-xl bg-[var(--bg-button)] px-5 py-3 font-semibold text-white">Acertei</button></div>}</div>
}

function EmptyGame() {
    return <p className="rounded-2xl bg-amber-50 p-5 text-amber-800">Adicione conteúdo antes de testar este jogo.</p>
}
