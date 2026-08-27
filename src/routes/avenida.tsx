import { useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Music4, Sparkles } from "lucide-react";
import {
  escolasCatalogo,
  obterRotaEscola,
  obterStatusEscola,
  type Escola,
} from "@/data/escolas-catalogo";
import {
  obterSessaoRitmista,
  sairRitmista,
} from "@/lib/auth.functions";
import {
  FiltroTecidoPortela,
  PavilhaoProvisorio,
} from "@/components/avenida/Pavilhoes";
import { PrimeiroAcesso } from "@/components/auth/PrimeiroAcesso";

export const Route = createFileRoute("/avenida")({
  head: () => ({
    meta: [
      { title: "Estúdio de Tamborim — Avenida dos Pavilhões" },
      {
        name: "description",
        content: "Escolha uma Escola de Samba para estudar no Estúdio de Tamborim.",
      },
      {
        property: "og:title",
        content: "Estúdio de Tamborim — Avenida dos Pavilhões",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  beforeLoad: async () => {
    const sessao = await obterSessaoRitmista();
    if (!sessao?.usuario) {
      throw redirect({ to: "/" });
    }
    return { usuario: sessao.usuario };
  },
  component: PaginaAvenida,
});

function PaginaAvenida() {
  const router = useRouter();
  const navigate = useNavigate();
  const obterSessao = useServerFn(obterSessaoRitmista);
  const sair = useServerFn(sairRitmista);
  const [saindo, setSaindo] = useState(false);

  const sessao = useQuery({
    queryKey: ["sessao-ritmista"],
    queryFn: () => obterSessao(),
    staleTime: 60_000,
  });

  const usuario = sessao.data?.usuario;
  const deveTrocarSenha = usuario?.deveTrocarSenha === true;

  const aoSair = async () => {
    setSaindo(true);
    try {
      await sair();
      await sessao.refetch();
      router.invalidate();
      await navigate({ to: "/" });
    } finally {
      setSaindo(false);
    }
  };

  if (deveTrocarSenha) {
    return (
      <PrimeiroAcesso
        onConcluido={async () => {
          await sessao.refetch();
          router.invalidate();
        }}
      />
    );
  }

  return (
    <main className="home-shell min-h-screen overflow-hidden bg-[#050811] text-white">
      {/* Topo de navegação e sessão */}
      <header className="relative z-20 border-b border-white/10 bg-[#050811]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-[#ffd37a]"
            aria-label="Estúdio de Tamborim — Início"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#ffd37a] text-[#14233b] sm:size-10">
              <Music4 className="size-5" aria-hidden="true" />
            </span>
            <div className="text-left">
              <p className="text-sm font-black tracking-tight text-white sm:text-base">
                Estúdio de Tamborim
              </p>
              <p className="text-[0.68rem] font-bold tracking-[0.14em] text-[#ffd37a] uppercase">
                Avenida dos Pavilhões
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {usuario ? (
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-white">
                  {usuario.nomeExibicao}
                </p>
                <p className="text-[0.68rem] font-medium text-white/50">
                  {usuario.papel === "admin" ? "Administrador" : "Ritmista"}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void aoSair()}
              disabled={saindo}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/16 bg-white/6 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd37a] disabled:opacity-50"
              aria-label="Encerrar sessão"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              <span>{saindo ? "Saindo…" : "Sair"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Palco principal da Avenida dos Pavilhões */}
      <section
        id="pavilhoes"
        aria-labelledby="titulo-avenida"
        className="avenida-pavilhoes relative min-h-[calc(100vh-4.5rem)] overflow-hidden py-12 text-white sm:py-16"
      >
        <FiltroTecidoPortela />
        <div className="ceu-sapucai" aria-hidden="true">
          <div className="feixes-do-horizonte" />
          <div className="apoteose-silhueta">
            <span className="apoteose-arco" />
            <span className="apoteose-base" />
          </div>
        </div>
        <div className="holofotes-pista" aria-hidden="true" />
        <div className="passarela-cenica" aria-hidden="true">
          <div className="piso-passarela">
            <span className="linha-central-passarela" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="home-kicker text-[#ffd37a]">Área de estudo</p>
            <h1
              id="titulo-avenida"
              className="mt-3 text-4xl leading-[0.96] font-black tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl uppercase"
            >
              Avenida dos Pavilhões
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Escolha uma Escola de Samba para estudar.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-black tracking-[0.15em] text-white/52 uppercase sm:mt-10">
            <span className="h-px w-9 bg-[#ffd37a]/50" />
            Arraste para seguir pela avenida
          </div>

          <div className="trilho-pavilhoes mt-3">
            <div className="pavilhoes-na-pista">
              {escolasCatalogo.map((escola, indice) => (
                <CardPavilhaoAvenida
                  key={escola.id}
                  escola={escola}
                  indice={indice}
                />
              ))}
            </div>
          </div>

          <p className="mt-8 flex max-w-3xl items-start gap-2 text-sm leading-6 text-white/52">
            <Sparkles className="mt-1 size-4 shrink-0 text-[#ffd37a]" aria-hidden="true" />
            Nesta primeira passagem pela avenida, as cores são representações
            visuais. Os pavilhões oficiais entrarão em cena com os arquivos e as
            autorizações adequados.
          </p>
        </div>
      </section>
    </main>
  );
}

function CardPavilhaoAvenida({
  escola,
  indice,
}: {
  escola: Escola;
  indice: number;
}) {
  const status = obterStatusEscola(escola);
  const disponivel = status === "disponivel";

  const textoSubtitulo = disponivel
    ? "Entrar na quadra"
    : status === "em_preparacao"
      ? "Em preparação"
      : "Em breve na avenida";

  const conteudo = (
    <>
      <span className="feixe-pavilhao" aria-hidden="true" />
      <div className="pavilhao-palco relative flex h-36 items-center justify-center">
        <span className="foco-no-piso" aria-hidden="true" />
        <PavilhaoProvisorio escola={escola} indice={indice} />
      </div>
      <div className="etiqueta-pavilhao flex flex-1 flex-col text-center">
        <h3 className="text-sm leading-5 font-black text-white sm:text-[0.95rem]">
          {escola.nome}
        </h3>
        <p
          className={`mt-2 text-[0.68rem] leading-4 font-black tracking-[0.08em] uppercase ${
            disponivel ? "text-[#ffd37a]" : "text-white/48"
          }`}
        >
          {textoSubtitulo}
        </p>
      </div>
    </>
  );

  const pavilhaoReal = Boolean(escola.pavilhaoAsset || escola.id === "portela");
  const classeBase =
    `pavilhao-node group relative flex min-h-60 flex-col px-2 py-3 text-left ${
      pavilhaoReal ? "pavilhao-node-portela" : ""
    }`;
  const classeDisponivel = `${classeBase} transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ffd37a] cursor-pointer`;
  const estiloNo = {
    "--atraso-pavilhao": `${-(indice % 7) * 0.65}s`,
    order: escola.id === "portela" ? -1 : indice,
  } as CSSProperties;

  if (disponivel) {
    return (
      <Link
        to="/escolas/$slug"
        params={{ slug: escola.slug }}
        className={classeDisponivel}
        style={estiloNo}
        aria-label={`Abrir ${escola.nome}`}
      >
        {conteudo}
      </Link>
    );
  }

  return (
    <article
      className={classeBase}
      style={estiloNo}
      aria-label={`${escola.nome}, ${textoSubtitulo}`}
    >
      {conteudo}
    </article>
  );
}
