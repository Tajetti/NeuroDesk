import { useEffect, useMemo, useRef, useState } from "react"
import type { ConnectDotsGameConfig, FaceBuilderGameConfig, GameConfig, PatternGameConfig, RecallSequenceGameConfig, ResponseControlGameConfig, RhythmGameConfig, SoundMatchGameConfig, VisualChoiceGameConfig, WordSearchGameConfig } from "../../games/gameType"
import type { GameResult } from "./GamePlayer"

type Finish = (result: GameResult) => void
type SpecialConfig = Extract<GameConfig, { kind: "visual-choice" | "recall-sequence" | "pattern" | "word-search" | "response-control" | "sound-match" | "rhythm" | "connect-dots" | "face-builder" }>

export default function SpecialGamePlayer({config,onFinish}:{config:SpecialConfig;onFinish:Finish}) {
    if(config.kind==="visual-choice") return <VisualChoice config={config} onFinish={onFinish}/>
    if(config.kind==="recall-sequence") return <RecallSequence config={config} onFinish={onFinish}/>
    if(config.kind==="pattern") return <Pattern config={config} onFinish={onFinish}/>
    if(config.kind==="word-search") return <WordSearch config={config} onFinish={onFinish}/>
    if(config.kind==="response-control") return <ResponseControl config={config} onFinish={onFinish}/>
    if(config.kind==="sound-match") return <SoundMatch config={config} onFinish={onFinish}/>
    if(config.kind==="rhythm") return <Rhythm config={config} onFinish={onFinish}/>
    if(config.kind==="connect-dots") return <ConnectDots config={config} onFinish={onFinish}/>
    return <FaceBuilder config={config} onFinish={onFinish}/>
}

const shell=(color:string)=>({backgroundColor:color})
const WORD_SEARCH_ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
function normalizeWordSearchWord(word:string){return word.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Z]/g,"")}
function wordSearchDirections(directions:Array<"horizontal"|"vertical"|"diagonal">,allowReverse:boolean){
    const result:number[][]=[]
    if(directions.includes("horizontal"))result.push([0,1])
    if(directions.includes("vertical"))result.push([1,0])
    if(directions.includes("diagonal"))result.push([1,1],[1,-1])
    return allowReverse?[...result,...result.map(([r,c])=>[-r,-c])]:result
}
function buildWordSearchGrid(words:string[],directions:Array<"horizontal"|"vertical"|"diagonal">,allowReverse:boolean,requestedRows:number,requestedColumns:number){
    const availableDirections=wordSearchDirections(directions,allowReverse)
    const rows=Math.max(6,Math.min(20,requestedRows))
    const columns=Math.max(6,Math.min(20,requestedColumns))
    const grid:string[][]=Array.from({length:rows},()=>Array.from({length:columns},()=>""))
    for(const word of words){
        let placed=false
        for(let attempt=0;attempt<300&&!placed;attempt++){
            const [dr,dc]=availableDirections[Math.floor(Math.random()*availableDirections.length)]
            const row=Math.floor(Math.random()*rows);const col=Math.floor(Math.random()*columns)
            const endRow=row+dr*(word.length-1);const endCol=col+dc*(word.length-1)
            if(endRow<0||endRow>=rows||endCol<0||endCol>=columns)continue
            let fits=true
            for(let i=0;i<word.length;i++){const r=row+dr*i,c=col+dc*i;if(grid[r][c]!==""&&grid[r][c]!==word[i]){fits=false;break}}
            if(!fits)continue
            for(let i=0;i<word.length;i++){const r=row+dr*i,c=col+dc*i;grid[r][c]=word[i]}
            placed=true
        }
        if(!placed){const [dr,dc]=availableDirections[0];const capacity=dr===0?columns:dc===0?rows:Math.min(rows,columns);const row=dr<0?rows-1:0;const col=dc<0?columns-1:0;for(let i=0;i<Math.min(word.length,capacity);i++)grid[row+dr*i][col+dc*i]=word[i]}
    }
    for(let r=0;r<rows;r++)for(let c=0;c<columns;c++)if(!grid[r][c])grid[r][c]=WORD_SEARCH_ALPHABET[Math.floor(Math.random()*WORD_SEARCH_ALPHABET.length)]
    return {grid,rows,columns}
}
const visualChoiceModeLabel:Record<VisualChoiceGameConfig["mode"],string>={odd:"Ache o diferente",find:"Encontre o objeto",count:"Conte os objetos",missing:"O que está faltando?"}
function VisualChoice({config,onFinish}:{config:VisualChoiceGameConfig;onFinish:Finish}){
    const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [errors,setErrors]=useState(0);const [chosen,setChosen]=useState<number|null>(null)
    const round=config.rounds[index];if(!round)return <Empty/>
    const isLast=index===config.rounds.length-1
    const choose=(choice:number)=>{if(chosen!==null)return;setChosen(choice);if(choice===round.correctIndex)setScore(v=>v+1);else setErrors(v=>v+1)}
    const next=()=>{if(isLast){onFinish({correct:score,incorrect:errors,completed:config.rounds.length});return}setIndex(v=>v+1);setChosen(null)}
    return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}>
        <p className="text-sm font-semibold text-[var(--description-letter)]">{visualChoiceModeLabel[config.mode]} · Desafio {index+1} de {config.rounds.length} · Acertos: {score}</p>
        <h3 className="mt-4 text-2xl font-bold text-[var(--title-letter)]">{round.prompt}</h3>
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">{round.options.map((option,i)=>{const isCorrect=i===round.correctIndex;const showState=chosen!==null&&(isCorrect||chosen===i);return <button key={`${option}-${i}`} type="button" disabled={chosen!==null} onClick={()=>choose(i)} className={`min-h-28 cursor-pointer rounded-2xl border-2 bg-white p-5 text-3xl font-bold shadow-sm transition disabled:cursor-not-allowed ${showState?isCorrect?"border-emerald-500 bg-emerald-50":"border-red-400 bg-red-50":"border-transparent"}`}>{option}</button>})}</div>
        {chosen!==null&&<p className={`mt-6 text-lg font-semibold ${chosen===round.correctIndex?"text-emerald-600":"text-red-500"}`}>{chosen===round.correctIndex?"Muito bem! Resposta correta.":"Não foi dessa vez. A resposta certa está destacada em verde."}</p>}
        {chosen!==null&&<button type="button" onClick={next} className="mt-6 cursor-pointer rounded-xl bg-[var(--bg-button)] px-5 py-3 font-semibold text-white">{isLast?"Ver resultado":"Próximo desafio"}</button>}
    </section>
}

function RecallSequence({config,onFinish}:{config:RecallSequenceGameConfig;onFinish:Finish}){
    const duration=Math.max(1800,config.sequence.length*650)
    const [watching,setWatching]=useState(true);const [chosen,setChosen]=useState<string[]>([]);const [errors,setErrors]=useState(0);const [wrong,setWrong]=useState(false);const [progress,setProgress]=useState(100)
    useEffect(()=>{const timer=setTimeout(()=>setWatching(false),duration);return()=>clearTimeout(timer)},[config])
    useEffect(()=>{if(!watching)return;setProgress(100);const frame=requestAnimationFrame(()=>setProgress(0));return()=>cancelAnimationFrame(frame)},[config,watching])
    const options=useMemo(()=>[...new Set(config.sequence)].sort(()=>Math.random()-.5),[config])
    const choose=(value:string)=>{
        const expected=config.sequence[chosen.length]
        if(value!==expected){setErrors(v=>v+1);setWrong(true);setTimeout(()=>setWrong(false),500);return}
        const next=[...chosen,value];setChosen(next)
        if(next.length===config.sequence.length)onFinish({correct:next.length,incorrect:errors,completed:next.length})
    }
    const rewatch=()=>{setChosen([]);setWatching(true);setTimeout(()=>setWatching(false),duration)}
    return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}>
        <h3 className="text-2xl font-bold text-[var(--title-letter)]">{watching?"Memorize a sequência":"Repita a sequência na mesma ordem"}</h3>
        {watching
            ? <>
                <div className="mx-auto mt-10 flex flex-wrap justify-center gap-4">{config.sequence.map((v,i)=><span key={i} className="flex size-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">{v}</span>)}</div>
                <div className="mx-auto mt-7 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-[var(--hover-section)]"><div className="h-full rounded-full bg-[var(--logo-color)]" style={{width:`${progress}%`,transition:`width ${duration}ms linear`}}/></div>
              </>
            : <>
                <p className="mt-3 text-sm font-semibold text-[var(--description-letter)]">{chosen.length} de {config.sequence.length} · Erros: {errors}</p>
                <div className="mx-auto mt-6 flex flex-wrap justify-center gap-3">{config.sequence.map((v,i)=><span key={i} className={`flex size-14 items-center justify-center rounded-xl text-2xl font-bold ${i<chosen.length?"bg-emerald-100 text-emerald-700":"border-2 border-dashed border-[var(--border-color)] text-[var(--secondary-text)]"}`}>{i<chosen.length?chosen[i]:"?"}</span>)}</div>
                <div className={`mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-4 ${wrong?"animate-pulse":""}`}>{options.map(v=><button key={v} type="button" onClick={()=>choose(v)} className="size-24 cursor-pointer rounded-2xl bg-white text-4xl shadow-sm transition hover:scale-105">{v}</button>)}</div>
                {wrong&&<p className="mt-4 font-semibold text-red-500">Ops, essa não é a próxima da sequência.</p>}
                <button type="button" onClick={rewatch} className="mt-6 cursor-pointer text-sm font-semibold text-[var(--logo-color)]">Ver a sequência de novo</button>
              </>
        }
    </section>
}

function Pattern({config,onFinish}:{config:PatternGameConfig;onFinish:Finish}){
    const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [errors,setErrors]=useState(0);const [chosen,setChosen]=useState<string|null>(null)
    const round=config.rounds[index];if(!round)return <Empty/>
    const isLast=index===config.rounds.length-1
    const choose=(value:string)=>{if(chosen!==null)return;setChosen(value);if(value===round.answer)setScore(v=>v+1);else setErrors(v=>v+1)}
    const next=()=>{if(isLast){onFinish({correct:score,incorrect:errors,completed:config.rounds.length});return}setIndex(v=>v+1);setChosen(null)}
    return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}>
        <p className="text-sm font-semibold text-[var(--description-letter)]">Desafio {index+1} de {config.rounds.length} · Acertos: {score}</p>
        <h3 className="mt-2 text-xl font-bold text-[var(--title-letter)]">O que vem depois?</h3>
        <p className="mt-8 text-4xl tracking-widest text-[var(--primary-text)]">{round.sequence} <span className="text-[var(--logo-color)]">?</span></p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{round.options.map((v,i)=>{const isCorrect=v===round.answer;const showState=chosen!==null&&(isCorrect||chosen===v);return <button key={i} type="button" disabled={chosen!==null} onClick={()=>choose(v)} className={`min-w-24 cursor-pointer rounded-2xl border-2 bg-white p-5 text-3xl transition disabled:cursor-not-allowed ${showState?isCorrect?"border-emerald-500 bg-emerald-50":"border-red-400 bg-red-50":"border-transparent"}`}>{v}</button>})}</div>
        {chosen!==null&&<p className={`mt-6 text-lg font-semibold ${chosen===round.answer?"text-emerald-600":"text-red-500"}`}>{chosen===round.answer?"Isso aí! Você completou o padrão.":"Quase lá! A resposta certa está em verde."}</p>}
        {chosen!==null&&<button type="button" onClick={next} className="mt-6 cursor-pointer rounded-xl bg-[var(--bg-button)] px-5 py-3 font-semibold text-white">{isLast?"Ver resultado":"Próximo desafio"}</button>}
    </section>
}


function WordSearch({config,onFinish}:{config:WordSearchGameConfig;onFinish:Finish}){
    const directions:Array<"horizontal"|"vertical"|"diagonal">=config.directions?.length?config.directions:["horizontal","vertical","diagonal"]
    const allowReverse=config.allowReverse??false
    const requestedRows=config.gridRows??10;const requestedColumns=config.gridColumns??10
    const {words,grid,rows,columns}=useMemo(()=>{const words=config.words.map(normalizeWordSearchWord).filter(Boolean);const built=buildWordSearchGrid(words,directions,allowReverse,requestedRows,requestedColumns);return {words,...built}},[config.words,directions.join("-"),allowReverse,requestedRows,requestedColumns])
    const [found,setFound]=useState<Record<string,{r:number,c:number}[]>>({})
    const [path,setPath]=useState<{r:number,c:number}[]>([])
    const [wrong,setWrong]=useState(false)
    if(!words.length)return <Empty/>
    const cellKey=(r:number,c:number)=>`${r}-${c}`
    const foundCellKeys=new Set(Object.values(found).flat().map(({r,c})=>cellKey(r,c)))
    const pathKeys=new Set(path.map(({r,c})=>cellKey(r,c)))
    const reject=(next:{r:number,c:number}[])=>{setPath(next);setWrong(true);window.setTimeout(()=>{setPath([]);setWrong(false)},550)}
    const selectLetter=(r:number,c:number)=>{
        if(wrong||foundCellKeys.has(cellKey(r,c))||pathKeys.has(cellKey(r,c)))return
        const point={r,c}
        if(path.length){
            const last=path[path.length-1]
            const dr=r-last.r,dc=c-last.c
            const isNeighbor=Math.max(Math.abs(dr),Math.abs(dc))===1
            const direction=dr===0?"horizontal":dc===0?"vertical":"diagonal"
            const directionAllowed=directions.includes(direction)
            const keepsDirection=path.length<2||(dr===path[1].r-path[0].r&&dc===path[1].c-path[0].c)
            if(!isNeighbor||!directionAllowed||!keepsDirection){reject([...path,point]);return}
        }
        const next=[...path,point]
        const text=next.map(position=>grid[position.r][position.c]).join("")
        const available=words.filter(word=>!found[word])
        const match=available.find(word=>word===text||(allowReverse&&[...word].reverse().join("")===text))
        if(match){
            const nextFound={...found,[match]:next}
            setFound(nextFound);setPath([])
            if(Object.keys(nextFound).length===words.length)window.setTimeout(()=>onFinish({correct:words.length,incorrect:0,completed:words.length}),650)
            return
        }
        const isPrefix=available.some(word=>word.startsWith(text)||(allowReverse&&[...word].reverse().join("").startsWith(text)))
        if(isPrefix)setPath(next);else reject(next)
    }
    return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}>
        <h3 className="text-2xl font-bold text-[var(--title-letter)]">Encontre as palavras na grade</h3>
        <p className="mt-2 text-sm font-semibold text-[var(--description-letter)]">Clique nas letras, uma por vez e em linha reta, para formar cada palavra.</p>
        <div className="mx-auto mt-6 grid max-w-2xl select-none gap-1" style={{gridTemplateColumns:`repeat(${columns}, minmax(0, 1fr))`,maxWidth:`min(100%, ${Math.max(28,columns*3.1)}rem)`}}>
            {grid.map((row,r)=>row.map((letter,c)=>{
                const key=cellKey(r,c);const isFound=foundCellKeys.has(key);const isSelecting=pathKeys.has(key)
                return <button type="button" key={key} onClick={()=>selectLetter(r,c)} className={`flex aspect-square cursor-pointer items-center justify-center rounded font-mono text-sm font-bold transition ${isFound?"bg-emerald-500 text-white":isSelecting&&wrong?"association-wrong bg-red-500 text-white":isSelecting?"bg-[var(--logo-color)] text-white":"bg-white text-[var(--primary-text)] hover:bg-[var(--hover-section)]"}`}>{letter}</button>
            }))}
        </div>
        <p className="mt-3 text-xs text-[var(--secondary-text)]">Grade com {rows} linhas e {columns} colunas</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{words.map(word=><span key={word} className={`rounded-full px-4 py-2 font-semibold ${found[word]?"bg-emerald-500 text-white line-through":"bg-white text-[var(--primary-text)]"}`}>{word}</span>)}</div>
        <p className="mt-4 text-sm text-[var(--secondary-text)]">{Object.keys(found).length} de {words.length} encontradas</p>
    </section>
}

function ResponseControl({config,onFinish}:{config:ResponseControlGameConfig;onFinish:Finish}){
    const stimuli=useMemo(()=>Array.from({length:config.rounds},(_,i)=>i%3===0?config.target:config.distractors[i%config.distractors.length]),[config])
    const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [errors,setErrors]=useState(0);const [feedback,setFeedback]=useState<"idle"|"correct"|"wrong">("idle")
    const answeredRef=useRef(false)
    const current=stimuli[index];const isLast=index===stimuli.length-1
    const settle=(goodClick:boolean)=>{
        const nextScore=score+(goodClick?1:0);const nextErrors=errors+(goodClick?0:1)
        setScore(nextScore);setErrors(nextErrors);setFeedback(goodClick?"correct":"wrong")
        setTimeout(()=>{if(isLast)onFinish({correct:nextScore,incorrect:nextErrors,completed:stimuli.length});else setIndex(v=>v+1)},500)
    }
    useEffect(()=>{
        answeredRef.current=false;setFeedback("idle")
        const timer=setTimeout(()=>{if(answeredRef.current)return;answeredRef.current=true;settle(current!==config.target)},(config.roundSeconds??1.6)*1000)
        return ()=>clearTimeout(timer)
    },[index])
    const click=()=>{if(answeredRef.current)return;answeredRef.current=true;settle(current===config.target)}
    return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}>
        <h3 className="text-xl font-bold text-[var(--title-letter)]">Clique somente quando aparecer <span className="text-[var(--logo-color)]">{config.target}</span></h3>
        <p className="mt-2 text-sm font-semibold text-[var(--description-letter)]">Rodada {index+1} de {stimuli.length} · Acertos: {score}</p>
        <button type="button" onClick={click} className={`mx-auto mt-8 flex size-52 cursor-pointer items-center justify-center rounded-3xl text-7xl shadow-md transition ${feedback==="correct"?"bg-emerald-100 ring-4 ring-emerald-400":feedback==="wrong"?"bg-red-100 ring-4 ring-red-400":"bg-white"}`}>{current}</button>
        <p className="mt-5 text-sm text-[var(--secondary-text)]">Clique na imagem só quando ela for o alvo. Se não for, apenas aguarde a próxima.</p>
    </section>
}

function SoundMatch({config,onFinish}:{config:SoundMatchGameConfig;onFinish:Finish}){
    const [index,setIndex]=useState(0);const [score,setScore]=useState(0);const [chosen,setChosen]=useState<number|null>(null)
    const round=config.rounds[index];if(!round)return <Empty/>
    const play=()=>{speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(round.sound);speech.lang="pt-BR";speech.rate=.9;const voices=speechSynthesis.getVoices();speech.voice=voices.find(voice=>voice.lang.toLocaleLowerCase()==="pt-br")??voices.find(voice=>voice.lang.toLocaleLowerCase().startsWith("pt"))??null;speechSynthesis.speak(speech)}
    const choose=(optionIndex:number)=>{if(chosen!==null)return;setChosen(optionIndex);if(optionIndex===round.correctIndex)setScore(value=>value+1)}
    const next=()=>{if(index===config.rounds.length-1){onFinish({correct:score,incorrect:config.rounds.length-score,completed:config.rounds.length,label:"Associações corretas entre os sons e as imagens."});return}setIndex(value=>value+1);setChosen(null)}
    const correct=chosen===round.correctIndex
    return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}><p className="text-sm font-semibold text-[var(--description-letter)]">Desafio {index+1} de {config.rounds.length} · Acertos: {score}</p><h3 className="mt-2 text-2xl font-bold text-[var(--title-letter)]">Ouça e escolha a opção correspondente</h3><button type="button" onClick={play} className="mt-7 inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-white px-7 py-5 text-lg font-bold text-[var(--logo-color)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"><span className="text-4xl">🔊</span>Ouvir novamente</button><div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">{round.options.map((option,optionIndex)=>{const isCorrect=optionIndex===round.correctIndex;const showCorrect=chosen!==null&&isCorrect;const showWrong=chosen===optionIndex&&!isCorrect;return <button type="button" key={optionIndex} disabled={chosen!==null} onClick={()=>choose(optionIndex)} className={`min-h-28 cursor-pointer rounded-2xl border-2 bg-white p-5 text-xl font-bold transition disabled:cursor-not-allowed ${showCorrect?"border-emerald-500 bg-emerald-50 text-emerald-700":showWrong?"association-wrong border-red-500 bg-red-50 text-red-700":"border-transparent hover:border-[var(--logo-color)]"}`}>{option}</button>})}</div>{chosen!==null&&<div className={`mx-auto mt-6 max-w-xl rounded-2xl p-4 font-semibold ${correct?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}><p>{correct?"Muito bem! Você fez a associação correta.":"Essa não é a opção correta. Observe a alternativa verde."}</p><button type="button" onClick={next} className="mt-4 cursor-pointer rounded-xl bg-[var(--bg-button)] px-5 py-3 font-semibold text-white">{index===config.rounds.length-1?"Ver resultado":"Próximo desafio"}</button></div>}</section>
}

function Rhythm({config,onFinish}:{config:RhythmGameConfig;onFinish:Finish}){const [chosen,setChosen]=useState<number[]>([]);const [errors,setErrors]=useState(0);const play=()=>config.pattern.forEach((beat,i)=>setTimeout(()=>{const audio=new AudioContext();const osc=audio.createOscillator();osc.frequency.value=beat===1?350:550;osc.connect(audio.destination);osc.start();osc.stop(audio.currentTime+.15)},i*400));const choose=(beat:number)=>{if(beat!==config.pattern[chosen.length]){setErrors(v=>v+1);return}const next=[...chosen,beat];setChosen(next);if(next.length===config.pattern.length)onFinish({correct:next.length,incorrect:errors,completed:next.length})};return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}><h3 className="text-2xl font-bold">Ouça e repita o ritmo</h3><button onClick={play} className="mt-7 cursor-pointer rounded-xl bg-white px-6 py-4 font-bold shadow">▶ Ouvir ritmo</button><div className="mt-8 flex justify-center gap-4"><button onClick={()=>choose(1)} className="size-28 cursor-pointer rounded-full bg-cyan-500 text-2xl font-bold text-white">Tum</button><button onClick={()=>choose(2)} className="size-28 cursor-pointer rounded-full bg-amber-500 text-2xl font-bold text-white">Tá</button></div><p className="mt-4">{chosen.length} de {config.pattern.length}</p></section>}

function ConnectDots({config,onFinish}:{config:ConnectDotsGameConfig;onFinish:Finish}){const [next,setNext]=useState(0);const [errors,setErrors]=useState(0);const [wrong,setWrong]=useState<number|null>(null);if(config.points.length<2)return <Empty/>;const choose=(index:number)=>{if(wrong!==null||index<next)return;if(index!==next){setErrors(value=>value+1);setWrong(index);window.setTimeout(()=>setWrong(null),450);return}const value=next+1;setNext(value);if(value===config.points.length)window.setTimeout(()=>onFinish({correct:value,incorrect:errors,completed:value,label:"Todos os pontos foram ligados na ordem correta."}),600)};return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}><p className="text-sm font-semibold text-[var(--description-letter)]">{next} de {config.points.length} pontos ligados</p><h3 className="mt-2 text-2xl font-bold text-[var(--title-letter)]">Ligue os pontos na ordem</h3><p className="mt-2 text-sm text-[var(--description-letter)]">{next===0?"Comece pelo ponto 1.":next===config.points.length?"Caminho completo!":`Agora encontre o ponto ${next+1}.`}</p><div className="relative mx-auto mt-6 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-[var(--border-color)] bg-white shadow-sm"><svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">{config.points.slice(1,next).map((point,index)=>{const previous=config.points[index];return <line key={point.id} x1={previous.x} y1={previous.y} x2={point.x} y2={point.y} stroke="#10b981" strokeWidth="1.4" strokeLinecap="round"/>})}</svg>{config.points.map((point,index)=><button type="button" aria-label={`Ponto ${index+1}`} key={point.id} onClick={()=>choose(index)} style={{left:`${point.x}%`,top:`${point.y}%`}} className={`absolute flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-white text-lg font-bold shadow-md transition hover:scale-110 ${index<next?"bg-emerald-500 text-white":wrong===index?"association-wrong bg-red-500 text-white":"bg-cyan-100 text-cyan-800"}`}>{index+1}</button>)}</div>{wrong!==null&&<p className="mt-5 font-semibold text-red-600">Esse não é o próximo ponto. Procure o número {next+1}.</p>}</section>}


function FaceBuilder({config,onFinish}:{config:FaceBuilderGameConfig;onFinish:Finish}){const eyes=["^ ^","• •","- -"];const mouths=["◡","⌢","○"];const [eye,setEye]=useState("");const [mouth,setMouth]=useState("");const check=()=>onFinish({correct:Number(eye===config.correctEyes)+Number(mouth===config.correctMouth),incorrect:Number(eye!==config.correctEyes)+Number(mouth!==config.correctMouth),completed:2,label:`Expressão: ${config.emotion}`});return <section className="rounded-3xl p-8 text-center" style={shell(config.backgroundColor)}><h3 className="text-2xl font-bold">Monte um rosto: {config.emotion}</h3><div className="mx-auto mt-7 flex size-64 flex-col items-center justify-center rounded-full bg-amber-200 text-5xl"><span>{eye||"? ?"}</span><span className="mt-6">{mouth||"?"}</span></div><p className="mt-6 font-semibold">Olhos</p><div className="mt-2 flex justify-center gap-2">{eyes.map(v=><button key={v} onClick={()=>setEye(v)} className="cursor-pointer rounded-xl bg-white px-5 py-3 text-xl">{v}</button>)}</div><p className="mt-5 font-semibold">Boca</p><div className="mt-2 flex justify-center gap-2">{mouths.map(v=><button key={v} onClick={()=>setMouth(v)} className="cursor-pointer rounded-xl bg-white px-5 py-3 text-2xl">{v}</button>)}</div><button disabled={!eye||!mouth} onClick={check} className="mt-7 cursor-pointer rounded-xl bg-[var(--bg-button)] px-6 py-3 font-bold text-white disabled:opacity-40">Conferir</button></section>}
function Empty(){return <p className="rounded-2xl bg-amber-50 p-5 text-amber-800">Adicione conteúdo antes de testar este jogo.</p>}
