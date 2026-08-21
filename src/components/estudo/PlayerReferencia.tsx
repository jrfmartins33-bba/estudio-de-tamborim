import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Repeat,
  FlagTriangleRight,
  Eraser,
  Video,
  Bookmark,
  Loader2,
} from "lucide-react";
import type { ExecucaoDeReferencia } from "@/data/types";

const VELOCIDADES = [0.5, 0.6, 0.7, 0.8, 0.9, 1];

/** Pedido externo para estudar um trecho salvo (token força reaplicação). */
export type PedidoDeEstudo = { inicio: number; fim: number; token: number };

export function formatarTempo(segundos: number) {
  if (!Number.isFinite(segundos) || segundos < 0) segundos = 0;
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  execucao: ExecucaoDeReferencia;
  /** ação de conexão do vídeo real (renderizada no estado vazio) */
  conector?: ReactNode;
  erroVideo?: boolean;
  /** persiste o intervalo A–B atual como trecho */
  aoSalvarTrecho?: (inicio: number, fim: number) => Promise<void> | void;
  salvandoTrecho?: boolean;
  /** trecho salvo escolhido para estudo */
  pedidoDeEstudo?: PedidoDeEstudo | null;
  /** notifica o tempo efetivo do vídeo */
  aoTempoMudar?: (segundos: number) => void;
};

export function PlayerReferencia({
  execucao,
  conector,
  erroVideo = false,
  aoSalvarTrecho,
  salvandoTrecho = false,
  pedidoDeEstudo = null,
  aoTempoMudar,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [tocando, setTocando] = useState(false);
  const [tempo, setTempo] = useState(0);
  const [duracao, setDuracao] = useState(execucao.duracaoSegundos);
  const [velocidade, setVelocidade] = useState(1);
  const [pontoA, setPontoA] = useState<number | null>(null);
  const [pontoB, setPontoB] = useState<number | null>(null);
  const [loopAtivo, setLoopAtivo] = useState(false);
  const temVideo = Boolean(execucao.videoUrl);
  useEffect(() => { const v=videoRef.current; if(v){v.preservesPitch=true;v.playbackRate=velocidade;} }, [velocidade, temVideo]);
  const alternarPlay=useCallback(()=>{const v=videoRef.current;if(!v)return;if(v.paused)void v.play();else v.pause();},[]);
  const irPara=useCallback((segundos:number)=>{const v=videoRef.current;const alvo=Math.min(Math.max(segundos,0),duracao||0);setTempo(alvo);aoTempoMudar?.(alvo);if(v)v.currentTime=alvo;},[duracao,aoTempoMudar]);
  const pular=(delta:number)=>irPara(tempo+delta);
  useEffect(()=>{if(!pedidoDeEstudo)return;setPontoA(pedidoDeEstudo.inicio);setPontoB(pedidoDeEstudo.fim);setLoopAtivo(true);const v=videoRef.current;setTempo(pedidoDeEstudo.inicio);aoTempoMudar?.(pedidoDeEstudo.inicio);if(v)v.currentTime=pedidoDeEstudo.inicio;},[pedidoDeEstudo,aoTempoMudar]);
  const loopRef=useRef({loopAtivo,pontoA,pontoB});loopRef.current={loopAtivo,pontoA,pontoB};
  const tempoMudarRef=useRef(aoTempoMudar);tempoMudarRef.current=aoTempoMudar;
  const rafRef=useRef<number|null>(null);
  const sincronizarTempo=useCallback(()=>{const v=videoRef.current;if(!v)return;const atual=v.currentTime;const {loopAtivo:la,pontoA:a,pontoB:b}=loopRef.current;if(la&&a!==null&&b!==null&&b>a){if(atual>=b||atual<a-0.05){v.currentTime=a;setTempo(a);tempoMudarRef.current?.(a);return;}}setTempo(atual);tempoMudarRef.current?.(atual);},[]);
  const aoAtualizarTempo=sincronizarTempo;
  const pararFrames=useCallback(()=>{if(rafRef.current!==null){cancelAnimationFrame(rafRef.current);rafRef.current=null;}},[]);
  const iniciarFrames=useCallback(()=>{pararFrames();const passo=()=>{sincronizarTempo();rafRef.current=requestAnimationFrame(passo);};rafRef.current=requestAnimationFrame(passo);},[pararFrames,sincronizarTempo]);
  useEffect(()=>pararFrames,[pararFrames]);
  const marcarA=()=>{const v=videoRef.current;const a=v?v.currentTime:tempo;setTempo(a);setPontoA(a);if(pontoB!==null&&pontoB<=a)setPontoB(null);};
  const marcarB=()=>{const v=videoRef.current;const b=v?v.currentTime:tempo;if(pontoA!==null&&b<=pontoA)return;setTempo(b);setPontoB(b);};
  const limparAB=()=>{setPontoA(null);setPontoB(null);setLoopAtivo(false);};
  const podeLoop=pontoA!==null&&pontoB!==null&&pontoB>pontoA;
  const progresso=duracao>0?(tempo/duracao)*100:0;
  return <div className="space-y-5">
    <div className="relative mx-auto w-full overflow-hidden rounded-3xl" style={{background:"var(--gradient-palco)",boxShadow:"var(--shadow-suave)",aspectRatio:execucao.orientacao==="vertical"?"9 / 16":"16 / 9",maxHeight:"70vh",maxWidth:execucao.orientacao==="vertical"?"26rem":"100%"}}>
      {temVideo?<video ref={videoRef} src={execucao.videoUrl??undefined} playsInline className="h-full w-full object-contain" onLoadedMetadata={(e)=>{const v=e.currentTarget;v.preservesPitch=true;v.playbackRate=velocidade;if(Number.isFinite(v.duration))setDuracao(v.duration);}} onTimeUpdate={aoAtualizarTempo} onPlay={()=>{setTocando(true);iniciarFrames();}} onPause={()=>{setTocando(false);pararFrames();sincronizarTempo();}} onEnded={()=>{setTocando(false);pararFrames();}} onClick={alternarPlay}/>:<div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-primary-foreground/10"><Video className="size-7 text-primary-foreground"/></span><p className="text-base font-semibold text-primary-foreground">{erroVideo ? "Não foi possível carregar o vídeo agora. Tente novamente." : "Vídeo de referência pronto para ser conectado"}</p>{erroVideo ? null : <p className="max-w-xs text-sm text-primary-foreground/70">Assim que o arquivo do professor for conectado, ele aparece aqui com todos os controles de estudo já ativos.</p>}{conector?<div className="mt-2 w-full max-w-xs">{conector}</div>:null}</div>}
    </div>
    <div className="space-y-2"><Slider value={[Math.min(tempo,duracao)]} min={0} max={duracao||1} step={0.1} disabled={!temVideo} onValueChange={(valores)=>irPara(valores[0]??0)} aria-label="Barra de progresso"/><div className="relative h-4">{podeLoop&&duracao>0&&<div className="absolute -top-6 h-2 rounded-full bg-accent/70" style={{left:`${(pontoA!/duracao)*100}%`,width:`${((pontoB!-pontoA!)/duracao)*100}%`}} aria-hidden/>}<div className="flex justify-between text-sm tabular-nums text-muted-foreground"><span>{formatarTempo(tempo)}</span><span>{formatarTempo(duracao)}</span></div></div><span className="sr-only">{Math.round(progresso)}% reproduzido</span></div>
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Button variant="secondary" size="lg" className="h-14 rounded-2xl text-base" disabled={!temVideo} onClick={()=>pular(-5)}><RotateCcw className="size-5"/>5s</Button><Button size="lg" className="size-16 rounded-full" disabled={!temVideo} onClick={alternarPlay} aria-label={tocando?"Pausar":"Reproduzir"}>{tocando?<Pause className="size-7"/>:<Play className="size-7"/>}</Button><Button variant="secondary" size="lg" className="h-14 rounded-2xl text-base" disabled={!temVideo} onClick={()=>pular(5)}>5s<RotateCw className="size-5"/></Button></div>
    <section aria-label="Velocidade de reprodução" className="space-y-2"><h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Velocidade</h3><div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{VELOCIDADES.map(v=><Button key={v} variant={velocidade===v?"default":"outline"} className="h-12 rounded-xl text-base font-semibold" onClick={()=>setVelocidade(v)}>{Math.round(v*100)}%</Button>)}</div><p className="text-xs text-muted-foreground">O tom do áudio é preservado sempre que o navegador permitir.</p></section>
    <section aria-label="Loop A–B" className="space-y-3 rounded-2xl bg-muted/70 p-4"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h3 className="truncate text-base font-semibold">Loop A–B</h3><span className="shrink-0 text-sm tabular-nums text-muted-foreground">{pontoA!==null?formatarTempo(pontoA):"--:--"} → {pontoB!==null?formatarTempo(pontoB):"--:--"}</span></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Button variant="outline" className="h-12 rounded-xl" disabled={!temVideo} onClick={marcarA}><FlagTriangleRight className="size-4"/>Início (A)</Button><Button variant="outline" className="h-12 rounded-xl" disabled={!temVideo} onClick={marcarB}><FlagTriangleRight className="size-4 scale-x-[-1]"/>Fim (B)</Button><Button variant={loopAtivo?"default":"outline"} className="h-12 rounded-xl" disabled={!podeLoop} onClick={()=>setLoopAtivo(x=>!x)}><Repeat className="size-4"/>{loopAtivo?"Repetindo":"Repetir"}</Button><Button variant="ghost" className="h-12 rounded-xl" disabled={pontoA===null&&pontoB===null} onClick={limparAB}><Eraser className="size-4"/>Limpar</Button></div>{podeLoop&&aoSalvarTrecho?<Button className="h-12 w-full rounded-xl" disabled={salvandoTrecho} onClick={()=>void aoSalvarTrecho(pontoA!,pontoB!)}>{salvandoTrecho?<Loader2 className="size-4 animate-spin"/>:<Bookmark className="size-4"/>}Salvar trecho</Button>:null}</section>
  </div>;
}
