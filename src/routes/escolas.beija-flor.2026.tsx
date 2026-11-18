import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ListMusic, Music4, Play } from "lucide-react";
import { ConectarVideoReal } from "@/components/estudo/ConectarVideoReal";
import { ConhecaEsteDesenho } from "@/components/estudo/ConhecaEsteDesenho";
import {
  PlayerReferencia,
  formatarTempo,
  type PedidoDeEstudo,
} from "@/components/estudo/PlayerReferencia";
import { Button } from "@/components/ui/button";
import { beijaFlor2026 } from "@/data/beija-flor-2026";
import { listarVideosReferencia } from "@/lib/video-referencia.functions";
import { listarTrechos, salvarTrecho } from "@/lib/trechos.functions";
import { obterSessaoRitmista } from "@/lib/auth.functions";
import { PrimeiroAcesso } from "@/components/auth/PrimeiroAcesso";

export const Route = createFileRoute("/escolas/beija-flor/2026")({
  head: () => ({
    meta: [
      { title: "Estúdio de Tamborim | Beija-Flor 2026 — Tamborim" },
      {
        name: "description",
        content:
          "Estude o desenho de tamborim da Beija-Flor 2026 com controle de velocidade, navegação de 5 segundos e loop A–B.",
      },
      {
        property: "og:title",
        content: "Estúdio de Tamborim | Beija-Flor 2026 — Tamborim",
      },
      {
        property: "og:description",
        content:
          "Player de estudo para o desenho de tamborim da Beija-Flor 2026.",
      },
    ],
  }),
  beforeLoad: async () => {
    const sessao = await obterSessaoRitmista();
    if (!sessao?.usuario) {
      throw redirect({ to: "/" });
    }
    return { usuario: sessao.usuario };
  },
  component: PaginaEstudo,
});

function PaginaEstudo() {
  const samba = beijaFlor2026;
  const buscarSessao = useServerFn(obterSessaoRitmista);
  const sessaoQuery = useQuery({
    queryKey: ["sessao-ritmista"],
    queryFn: () => buscarSessao(),
    staleTime: 0,
  });
  const usuario = sessaoQuery.data?.usuario;
  const deveTrocarSenha = usuario?.deveTrocarSenha === true;
  const podeEditar = usuario?.papel === "admin";
  const podeSalvarTrecho = Boolean(usuario);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    samba.execucao.videoUrl,
  );
  const [videos, setVideos] = useState<{ caminho: string; nome: string; url: string }[]>([]);
  const [videoSelecionado, setVideoSelecionado] = useState("");
  const [videoErro, setVideoErro] = useState(false);
  const buscarVideos = useServerFn(listarVideosReferencia);
  useQuery({
    queryKey: ["videos-referencia", samba.execucao.id],
    queryFn: async () => {
      const resultado = await buscarVideos({
        data: { execucaoId: samba.execucao.id },
      });
      setVideos(resultado.videos);
      const inicial = resultado.videos.find((video) => video.caminho === videoSelecionado)
        ?? resultado.videos.find((video) => video.nome.toLowerCase().includes("bossa"))
        ?? resultado.videos[0];
      setVideoSelecionado(inicial?.caminho ?? "");
      setVideoUrl(inicial?.url ?? null);
      setVideoErro(resultado.erroVideo);
      return resultado;
    },
    staleTime: 5 * 60 * 1000,
    enabled: sessaoQuery.isSuccess && !deveTrocarSenha,
  });

  const aoSelecionarVideo = (caminho: string) => {
    const video = videos.find((item) => item.caminho === caminho);
    setVideoSelecionado(caminho);
    setVideoUrl(video?.url ?? null);
  };

  const execucao = { ...samba.execucao, videoUrl };
  const buscarTrechos = useServerFn(listarTrechos);
  const criarTrecho = useServerFn(salvarTrecho);
  const [salvando, setSalvando] = useState(false);
  const [erroTrecho, setErroTrecho] = useState<string | null>(null);
  const [pedidoDeEstudo, setPedidoDeEstudo] =
    useState<PedidoDeEstudo | null>(null);
  const trechosQuery = useQuery({
    queryKey: ["trechos", samba.execucao.id],
    queryFn: () =>
      buscarTrechos({ data: { execucaoId: samba.execucao.id } }),
    enabled: sessaoQuery.isSuccess && !deveTrocarSenha,
  });
  const trechos = trechosQuery.data?.trechos ?? [];

  const aoSalvarTrecho = async (inicio: number, fim: number) => {
    setSalvando(true);
    setErroTrecho(null);
    try {
      const resultado = await criarTrecho({
        data: {
          execucaoId: samba.execucao.id,
          inicioSegundos: inicio,
          fimSegundos: fim,
        },
      });
      if (!resultado.ok) {
        setErroTrecho(resultado.erro);
        return;
      }
      await trechosQuery.refetch();
    } finally {
      setSalvando(false);
    }
  };

  if (!sessaoQuery.isSuccess) {
    return <CarregandoEstudio />;
  }

  if (deveTrocarSenha) {
    return (
      <PrimeiroAcesso
        onConcluido={async () => {
          await sessaoQuery.refetch();
        }}
      />
    );
  }

  const conector = podeEditar ? (
      <ConectarVideoReal
        execucaoId={samba.execucao.id}
        onConectado={setVideoUrl}
        compacto={Boolean(videoUrl)}
      />
    ) : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <Link
          to="/escolas/$slug"
          params={{ slug: "beija-flor" }}
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-primary transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar aos Carnavais
        </Link>

        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Music4 className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {samba.escola} {samba.ano} — {samba.instrumento.nome}
              </p>
              <h1 className="truncate text-2xl font-black tracking-tight sm:text-3xl">
                Estúdio de Tamborim
              </h1>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
          <section aria-label="Player de referência">
            {videos.length > 1 ? (
              <label className="mb-4 block max-w-xl space-y-2 text-sm font-semibold">
                <span>Escolha o vídeo do desenho</span>
                <select
                  value={videoSelecionado}
                  onChange={(evento) => aoSelecionarVideo(evento.currentTarget.value)}
                  className="h-12 w-full rounded-xl border border-border bg-card px-3 text-base"
                >
                  {videos.map((video) => (
                    <option key={video.caminho} value={video.caminho}>{video.nome}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <PlayerReferencia
              key={videoSelecionado || "sem-video"}
              execucao={execucao}
              conector={conector}
              erroVideo={videoErro}
              {...(podeSalvarTrecho
                ? { aoSalvarTrecho, salvandoTrecho: salvando }
                : {})}
              pedidoDeEstudo={pedidoDeEstudo}
            />
            {erroTrecho ? (
              <p className="mt-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive" role="alert">
                {erroTrecho}
              </p>
            ) : null}
            {podeEditar && videoUrl ? <div className="mt-4 max-w-xs">{conector}</div> : null}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold">Referência</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Dado
                  rotulo="Andamento da gravação"
                  valor={
                    execucao.bpmGravacao
                      ? `~${execucao.bpmGravacao} BPM`
                      : "A confirmar"
                  }
                />
                <Dado rotulo="Andamento de bateria/desfile" valor="A confirmar" />
                <Dado
                  rotulo="Duração"
                  valor={`~${formatarTempo(execucao.duracaoSegundos)}`}
                />
                <Dado rotulo="Execução" valor={execucao.executadoPor} />
              </dl>
            </section>

            <section className="rounded-2xl bg-secondary/70 p-5">
              <h2 className="text-base font-bold">Como estudar</h2>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li>Ouça o trecho na velocidade original.</li>
                <li>Marque início (A) e fim (B) do trecho.</li>
                <li>Reduza para 60–70% e repita até ficar limpo.</li>
                <li>Suba a velocidade aos poucos até 100%.</li>
              </ol>
            </section>
          </aside>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-dashed border-border p-6">
            <div className="flex items-center gap-2">
              <ListMusic className="size-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold">Trechos do desenho</h2>
            </div>
            {trechos.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Os trechos oficiais serão definidos a partir da análise do vídeo.
                Entre como ritmista para salvar seus próprios trechos de estudo.
              </p>
            ) : (
              <div className="mt-4 space-y-5">
                <ListaTrechos
                  titulo="Trechos oficiais"
                  trechos={trechos.filter((trecho) => trecho.origem === "oficial")}
                  aoEstudar={(trecho) =>
                    setPedidoDeEstudo({ inicio: trecho.inicio, fim: trecho.fim, token: Date.now() })
                  }
                />
                {usuario ? (
                  <ListaTrechos
                    titulo="Meus trechos"
                    trechos={trechos.filter((trecho) => trecho.origem === "pessoal")}
                    aoEstudar={(trecho) =>
                      setPedidoDeEstudo({ inicio: trecho.inicio, fim: trecho.fim, token: Date.now() })
                    }
                    vazio="Você ainda não salvou um trecho. Marque A e B no player para guardar um recorte só seu."
                  />
                ) : null}
              </div>
            )}
          </section>
        </div>

        <ConhecaEsteDesenho execucaoId={samba.execucao.id} podeEditar={podeEditar} />
      </div>
    </main>
  );
}

function CarregandoEstudio() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-8">
        <p className="text-sm text-muted-foreground">Carregando seu acesso…</p>
      </div>
    </main>
  );
}

type TrechoDaLista = {
  id: string;
  nome: string;
  inicio: number;
  fim: number;
};

function ListaTrechos({
  titulo,
  trechos,
  aoEstudar,
  vazio,
}: {
  titulo: string;
  trechos: TrechoDaLista[];
  aoEstudar: (trecho: TrechoDaLista) => void;
  vazio?: string;
}) {
  return (
    <section>
      <h3 className="text-sm font-bold text-muted-foreground">{titulo}</h3>
      {trechos.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{vazio ?? "Nenhum trecho disponível ainda."}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {trechos.map((trecho) => (
            <li
              key={trecho.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/60 p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{trecho.nome}</p>
                <p className="text-sm tabular-nums text-muted-foreground">
                  {formatarTempo(trecho.inicio)} → {formatarTempo(trecho.fim)} · {formatarTempo(trecho.fim - trecho.inicio)}
                </p>
              </div>
              <Button
                variant="secondary"
                className="h-11 shrink-0 rounded-xl"
                onClick={() => aoEstudar(trecho)}
              >
                <Play className="size-4" aria-hidden="true" />
                Estudar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
      <dt className="min-w-0 text-muted-foreground">{rotulo}</dt>
      <dd className="shrink-0 font-semibold tabular-nums">{valor}</dd>
    </div>
  );
}
