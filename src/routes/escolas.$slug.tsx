import {
  createFileRoute,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, BookOpen, Music4, Play } from "lucide-react";
import {
  obterEscolaPorSlug,
  obterRotaCarnaval,
  type CarnavalEscola,
  type Escola,
} from "@/data/escolas-catalogo";
import { obterSessaoRitmista } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { PavilhaoProvisorio, FiltroTecidoPortela } from "@/components/avenida/Pavilhoes";
import { PrimeiroAcesso } from "@/components/auth/PrimeiroAcesso";

export const Route = createFileRoute("/escolas/$slug")({
  head: ({ params }) => {
    const escola = obterEscolaPorSlug(params.slug);
    const titulo = escola
      ? `Estúdio de Tamborim | ${escola.nome}`
      : "Estúdio de Tamborim | Escola";
    return {
      meta: [
        { title: titulo },
        {
          name: "description",
          content: escola
            ? `Escolha o carnaval de ${escola.nome} para estudar no Estúdio de Tamborim.`
            : "Escolha o carnaval para estudar.",
        },
      ],
    };
  },
  component: PaginaEscola,
});

const corParaClasse: Record<string, string> = {
  azul: "bg-blue-500",
  vermelho: "bg-red-500",
  verde: "bg-emerald-500",
  amarelo: "bg-yellow-400",
  rosa: "bg-pink-500",
  ouro: "bg-amber-400",
  branco: "bg-white",
};

function PaginaEscola() {
  const { slug } = Route.useParams();
  const router = useRouter();
  const escola = obterEscolaPorSlug(slug);

  const obterSessao = useServerFn(obterSessaoRitmista);
  const sessao = useQuery({
    queryKey: ["sessao-ritmista"],
    queryFn: () => obterSessao(),
    staleTime: 60_000,
  });

  const usuario = sessao.data?.usuario;
  const deveTrocarSenha = usuario?.deveTrocarSenha === true;

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

  if (!escola) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black text-foreground">Escola não encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A escola solicitada não consta no catálogo do estúdio.
          </p>
          <div className="mt-6">
            <Link
              to="/avenida"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="size-4" />
              Voltar à Avenida
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050811] text-white">
      <FiltroTecidoPortela />

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Navegação de retorno */}
        <Link
          to="/avenida"
          className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/14 bg-white/6 px-4 text-sm font-bold text-[#ffd37a] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#ffd37a]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar à Avenida
        </Link>

        {/* Cabeçalho de identidade da escola */}
        <header className="relative overflow-hidden rounded-3xl border border-white/14 bg-white/6 p-6 backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white/8 p-2 sm:size-24">
                <PavilhaoProvisorio escola={escola} indice={0} />
              </div>
              <div>
                <div className="flex h-1.5 w-24 overflow-hidden rounded-full sm:w-32">
                  {escola.cores.map((cor, i) => (
                    <span
                      key={i}
                      className={`h-full flex-1 ${corParaClasse[cor] ?? "bg-white/40"}`}
                    />
                  ))}
                </div>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  {escola.nome}
                </h1>
                <p className="mt-1 text-xs font-bold tracking-[0.16em] text-[#ffd37a] uppercase">
                  Pavilhão Oficial do Estúdio
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Seção Escolha o Carnaval */}
        <section aria-labelledby="titulo-carnavais" className="mt-10">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-[#ffd37a]/16 text-[#ffd37a]">
              <BookOpen className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="titulo-carnavais" className="text-xl font-black tracking-tight sm:text-2xl">
                Escolha o Carnaval
              </h2>
              <p className="text-xs text-white/60 sm:text-sm">
                Selecione o ano para estudar os desenhos de tamborim.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {escola.carnavais.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/16 bg-white/4 p-8 text-center sm:p-12">
                <p className="text-base font-bold text-white/80">
                  Em breve na avenida
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Os carnavais e desenhos de tamborim desta escola estão em preparação.
                </p>
                <div className="mt-6">
                  <Link
                    to="/avenida"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-4 text-xs font-bold text-white transition-colors hover:bg-white/14"
                  >
                    Ver outras escolas na Avenida
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {escola.carnavais.map((carnaval) => (
                  <CardCarnaval
                    key={carnaval.ano}
                    escola={escola}
                    carnaval={carnaval}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CardCarnaval({
  escola,
  carnaval,
}: {
  escola: Escola;
  carnaval: CarnavalEscola;
}) {
  const disponivel = carnaval.status === "disponivel";
  const rotaEstudo = obterRotaCarnaval(escola.slug, carnaval.ano);

  return (
    <article
      className="relative flex flex-col justify-between rounded-2xl border border-white/14 bg-white/6 p-6 backdrop-blur-sm transition-colors hover:bg-white/9"
      aria-label={`Carnaval ${carnaval.ano} — ${carnaval.enredo}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-black tracking-tight text-[#ffd37a] sm:text-3xl">
            {carnaval.ano}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[0.68rem] font-black tracking-[0.1em] uppercase ${
              disponivel
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/10 text-white/60 border border-white/14"
            }`}
          >
            {disponivel ? "Disponível" : "Em preparação"}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
          {carnaval.enredo}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-white/64">
          <Music4 className="size-3.5 text-[#ffd37a]" aria-hidden="true" />
          Instrumento: {carnaval.instrumento}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        {disponivel ? (
          <Button
            asChild
            className="w-full min-h-12 rounded-xl bg-[#ffd37a] text-sm font-black text-[#14233b] shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#ffe199] focus-visible:outline-2 focus-visible:outline-white"
          >
            <Link to={rotaEstudo as any}>
              <Play className="size-4 fill-current" aria-hidden="true" />
              ESTUDAR
            </Link>
          </Button>
        ) : (
          <div className="flex min-h-12 items-center justify-center rounded-xl border border-dashed border-white/16 bg-white/4 text-xs font-bold text-white/40 uppercase tracking-[0.1em]">
            Conteúdo em preparação
          </div>
        )}
      </div>
    </article>
  );
}
