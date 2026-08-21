import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CircleDot,
  Flag,
  Heart,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import {
  escolasCatalogo,
  type EscolaCatalogo,
} from "@/data/escolas-catalogo";
import {
  entrarRitmista,
  obterSessaoRitmista,
  sairRitmista,
} from "@/lib/auth.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Estúdio de Tamborim — Avenida dos Pavilhões" },
      {
        name: "description",
        content:
          "Criado de ritmista para ritmista. Escolha um pavilhão e venha tocar na Avenida dos Pavilhões.",
      },
      {
        property: "og:title",
        content: "Estúdio de Tamborim — Avenida dos Pavilhões",
      },
      {
        property: "og:description",
        content:
          "Cada ritmista tem sua avenida. A nossa começa em Fortaleza.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaInicial,
});

const coresProvisorias: Record<string, string> = {
  azul: "#1d5f9f",
  vermelho: "#c53636",
  verde: "#238653",
  amarelo: "#f0c945",
  rosa: "#e8669a",
  ouro: "#c9972f",
  branco: "#f8f5eb",
};

function PaginaInicial() {
  return (
    <main className="home-shell min-h-screen overflow-hidden bg-[#f8f1df] text-[#14233b]">
      <HeroAvenida />

      <section
        id="pavilhoes"
        aria-labelledby="titulo-pavilhoes"
        className="avenida-pavilhoes relative scroll-mt-6 overflow-hidden py-16 text-white sm:py-20"
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
            <p className="home-kicker text-[#ffd37a]">Avenida dos Pavilhões</p>
            <h2
              id="titulo-pavilhoes"
              className="mt-3 text-4xl leading-[0.96] font-black tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl"
            >
              Escolha uma Escola de Samba e venha tocar.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg" />
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-black tracking-[0.15em] text-white/52 uppercase sm:mt-10">
            <span className="h-px w-9 bg-[#ffd37a]/50" />
            Arraste para seguir pela avenida
          </div>

          <div className="trilho-pavilhoes mt-3">
            <div className="pavilhoes-na-pista">
              {escolasCatalogo.map((escola, indice) => (
                <CardPavilhao key={escola.id} escola={escola} indice={indice} />
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

      <section
        id="nossa-avenida"
        aria-labelledby="titulo-nossa-avenida"
        className="nossa-avenida relative overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="ondas-fortaleza" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,.95fr)]">
            <div>
              <p className="home-kicker text-[#ffd37a]">Nossa Avenida</p>
              <h2
                id="titulo-nossa-avenida"
                className="mt-3 max-w-4xl text-4xl leading-[0.98] font-black tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl"
              >
                Fortaleza é a nossa avenida.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                O Estúdio nasce na Ala de Tamborim do Bloco Unidos da Cachorra e
                conversa com o pré-carnaval vivido entre a Beira-Mar e a Praia de
                Iracema.
              </p>
            </div>

            <div className="space-y-5">
              <div className="rounded-[2rem] border border-white/14 bg-white/9 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
                <p className="text-sm font-black tracking-[0.18em] text-[#ffd37a] uppercase">
                  Criado de ritmista para ritmista
                </p>
                <p className="mt-4 text-xl leading-8 font-semibold text-white">
                  Da quadra para a rua. Nosso espaço de desenhos, encontros e
                  memórias.
                </p>
              </div>
              <LoginAla />
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <PortalCard
              icon={<Users className="size-6" aria-hidden="true" />}
              titulo="Nossa Ala"
              descricao="O espaço dos ritmistas do Bloco Unidos da Cachorra, com identidade, desenhos e memórias coletivas."
            />
            <PortalCard
              icon={<Waves className="size-6" aria-hidden="true" />}
              titulo="Nosso Pré-Carnaval"
              descricao="Esquenta, repertório e referências para viver a Beira-Mar e a Praia de Iracema."
            />
            <PortalCard
              icon={<Heart className="size-6" aria-hidden="true" />}
              titulo="Meu Tamborim"
              descricao="Um canto pessoal para guardar desenhos, preferências, trechos e o seu jeito de tocar."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dccdad] bg-[#f8f1df] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#657083] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-[#26364d]">Estúdio de Tamborim</p>
          <p>Cada ritmista tem sua avenida. A nossa começa em Fortaleza.</p>
        </div>
      </footer>
    </main>
  );
}

function HeroAvenida() {
  return (
    <section className="hero-avenida hero-foto-ala relative min-h-[46rem] overflow-hidden px-4 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex min-h-[46rem] max-w-7xl flex-col">
        <header className="flex items-center justify-between gap-4 py-5 sm:py-7">
          <Link
            to="/"
            aria-label="Estúdio de Tamborim — início"
            className="inline-flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd37a]"
          >
            <span className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <CircleDot className="size-6 text-[#ffd37a]" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-black tracking-[0.16em] text-white/60 uppercase">
                Estúdio de
              </span>
              <span className="block text-lg leading-none font-black">Tamborim</span>
            </span>
          </Link>

          <p className="hidden text-right text-xs font-black tracking-[0.15em] text-white/64 uppercase sm:block">
            Tamborim Arretado
            <span className="block text-[#ffd37a]">Fortaleza</span>
          </p>
        </header>

        <div id="topo" className="flex-1" />

        <div className="hero-frase-rodape pb-6 pt-24 sm:pb-8 sm:pt-32">
          <h1 className="mx-auto max-w-6xl text-center text-2xl leading-tight font-black tracking-[-0.035em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.62)] sm:text-3xl lg:text-4xl">
            Cada ritmista tem sua avenida.
            <span className="text-[#ffd37a]"> A nossa começa em Fortaleza.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}

function LoginAla() {
  const entrar = useServerFn(entrarRitmista);
  const obterSessao = useServerFn(obterSessaoRitmista);
  const sair = useServerFn(sairRitmista);
  const sessao = useQuery({
    queryKey: ["sessao-ritmista"],
    queryFn: () => obterSessao(),
    staleTime: 60_000,
  });
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const usuario = sessao.data?.usuario;

  const aoEntrar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const resultado = await entrar({ data: { email, senha } });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      setSenha("");
      await sessao.refetch();
    } catch {
      setErro("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const aoSair = async () => {
    setEnviando(true);
    try {
      await sair();
      await sessao.refetch();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <aside className="login-ala rounded-[1.8rem] border border-white/18 bg-[#081628]/74 p-5 shadow-2xl backdrop-blur-md sm:p-6">
      <p className="home-kicker text-[#ffd37a]">Seu espaço na ala</p>
      {usuario ? (
        <div className="mt-3 space-y-4">
          <h2 className="text-2xl font-black tracking-[-0.025em]">Acesso ativo</h2>
          <p className="text-sm leading-6 text-white/70">
            {usuario.papel === "admin"
              ? "Acesso de administração liberado."
              : "A avenida está aberta para você estudar."}
          </p>
          <p className="truncate text-xs text-white/48">{usuario.email}</p>
          <button
            type="button"
            onClick={() => void aoSair()}
            disabled={enviando}
            className="min-h-11 w-full rounded-xl border border-white/20 px-5 text-sm font-black text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white disabled:opacity-60"
          >
            {enviando ? "Saindo…" : "Sair"}
          </button>
        </div>
      ) : (
        <>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.025em]">Entrar</h2>
          <p className="mt-2 text-sm leading-6 text-white/64">
            Entre para acessar os desenhos da ala.
          </p>
          <form className="mt-5 space-y-4" aria-label="Acesso do ritmista" onSubmit={aoEntrar}>
            <label className="block">
              <span className="text-sm font-bold text-white/82">Ritmista</span>
              <input
                type="email"
                name="ritmista"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                placeholder="E-mail de acesso"
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-white/16 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/38 focus:border-[#ffd37a] focus:ring-2 focus:ring-[#ffd37a]/24"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-white/82">Senha</span>
              <input
                type="password"
                name="senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                autoComplete="current-password"
                placeholder="Sua senha"
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-white/16 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/38 focus:border-[#ffd37a] focus:ring-2 focus:ring-[#ffd37a]/24"
              />
            </label>
            {erro ? <p className="text-sm text-[#ffd1c7]">{erro}</p> : null}
            <button
              type="submit"
              disabled={enviando}
              className="min-h-12 w-full rounded-xl bg-[#ffd37a] px-5 text-sm font-black text-[#14233b] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white disabled:opacity-60"
            >
              {enviando ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </>
      )}
    </aside>
  );
}

function CardPavilhao({
  escola,
  indice,
}: {
  escola: EscolaCatalogo;
  indice: number;
}) {
  const disponivel = escola.status === "disponivel" && escola.rota;
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
          {disponivel ? "Entrar na quadra" : "Em breve na avenida"}
        </p>
      </div>
    </>
  );

  const pavilhaoReal = escola.id === "portela";
  const classeBase =
    `pavilhao-node group relative flex min-h-60 flex-col px-2 py-3 text-left ${
      pavilhaoReal ? "pavilhao-node-portela" : ""
    }`;
  const classeDisponivel = `${classeBase} transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ffd37a]`;
  const estiloNo = {
    "--atraso-pavilhao": `${-(indice % 7) * 0.65}s`,
    order: escola.id === "portela" ? -1 : indice,
  } as CSSProperties;

  return disponivel ? (
    <Link
      to={escola.rota!}
      className={classeDisponivel}
      style={estiloNo}
      aria-label={`Abrir ${escola.nome}`}
    >
      {conteudo}
    </Link>
  ) : (
    <article
      className={classeBase}
      style={estiloNo}
      aria-label={`${escola.nome}, conteúdo em preparação`}
    >
      {conteudo}
    </article>
  );
}

function PavilhaoProvisorio({
  escola,
  indice,
}: {
  escola: EscolaCatalogo;
  indice: number;
}) {
  if (escola.id === "portela") {
    return (
      <div
        className="pavilhao-real-portela"
        style={{ animationDelay: `${-(indice % 6) * 0.7}s` }}
        aria-hidden="true"
      >
        <img
          src="/images/pavilhoes/portela-pavilhao.png"
          alt=""
          className="portela-tecido size-full object-contain"
        />
        <img
          src="/images/pavilhoes/portela-pavilhao.png"
          alt=""
          className="portela-mastro size-full object-contain"
        />
      </div>
    );
  }

  const cores = escola.cores.map(
    (cor) => coresProvisorias[cor] ?? "#d7c8a8",
  );
  const passo = 100 / Math.max(cores.length, 1);
  const gradiente = `linear-gradient(115deg, ${cores
    .map(
      (cor, index) =>
        `${cor} ${index * passo}%, ${cor} ${(index + 1) * passo}%`,
    )
    .join(", ")})`;
  const estilo = {
    background: gradiente,
    animationDelay: `${-(indice % 6) * 0.7}s`,
  } satisfies CSSProperties;

  return (
    <div className="pavilhao-provisorio" aria-hidden="true">
      <span className="pavilhao-haste" />
      <span className="pavilhao-tecido" style={estilo}>
        <Flag className="size-6 text-[#14233b]/56 sm:size-7" />
      </span>
    </div>
  );
}

function FiltroTecidoPortela() {
  return (
    <svg
      className="filtro-tecido-portela"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id="ondulacao-portela"
          x="-18%"
          y="-18%"
          width="136%"
          height="136%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.028"
            numOctaves="2"
            seed="7"
            result="ruido-tecido"
          >
            <animate
              attributeName="baseFrequency"
              dur="5.2s"
              values="0.008 0.028; 0.013 0.038; 0.008 0.028"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="ruido-tecido"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
          >
            <animate
              attributeName="scale"
              dur="4.4s"
              values="4; 10; 6; 4"
              repeatCount="indefinite"
            />
          </feDisplacementMap>
        </filter>
      </defs>
    </svg>
  );
}

function PortalCard({
  icon,
  titulo,
  descricao,
}: {
  icon: ReactNode;
  titulo: string;
  descricao: string;
}) {
  return (
    <article className="group rounded-[1.6rem] border border-white/14 bg-white/8 p-6 backdrop-blur-sm transition-colors hover:bg-white/12">
      <span className="grid size-12 place-items-center rounded-2xl bg-[#ffd37a] text-[#153052]">
        {icon}
      </span>
      <h3 className="mt-5 text-2xl font-black tracking-[-0.025em]">{titulo}</h3>
      <p className="mt-3 leading-7 text-white/72">{descricao}</p>
      <p className="mt-5 text-xs font-black tracking-[0.14em] text-[#ffd37a] uppercase">
        Em construção
      </p>
    </article>
  );
}
