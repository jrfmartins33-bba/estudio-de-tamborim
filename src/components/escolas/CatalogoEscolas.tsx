import { Link } from "@tanstack/react-router";
import {
  escolasCatalogo,
  obterRotaEscola,
  obterStatusEscola,
  type Escola,
} from "@/data/escolas-catalogo";
import { Button } from "@/components/ui/button";
import { Music4 } from "lucide-react";

const corParaClasse: Record<string, string> = {
  azul: "bg-blue-500",
  vermelho: "bg-red-500",
  verde: "bg-green-500",
  amarelo: "bg-yellow-400",
  rosa: "bg-pink-500",
  ouro: "bg-yellow-500",
  branco: "bg-white",
};

function FaixaCromatica({ cores }: { cores: string[] }) {
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full">
      {cores.map((cor, i) => (
        <span
          key={i}
          className={`h-full flex-1 ${corParaClasse[cor] ?? "bg-muted"}`}
        />
      ))}
    </div>
  );
}

function CardEscola({ escola }: { escola: Escola }) {
  const status = obterStatusEscola(escola);
  const disponivel = status === "disponivel";

  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
      aria-label={escola.nome}
    >
      <div className="mb-4">
        <FaixaCromatica cores={escola.cores} />
      </div>
      <h2 className="text-lg font-bold leading-tight text-card-foreground">
        {escola.nome}
      </h2>
      <div className="mt-auto pt-5">
        {disponivel ? (
          <Button asChild className="w-full rounded-xl">
            <Link to="/escolas/$slug" params={{ slug: escola.slug }}>
              Abrir escola
            </Link>
          </Button>
        ) : (
          <div className="flex h-10 items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 text-sm font-medium text-muted-foreground">
            Conteúdo em preparação
          </div>
        )}
      </div>
    </article>
  );
}

export function CatalogoEscolas() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-10 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Music4 className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Estúdio de Tamborim
            </h1>
            <p className="text-sm text-muted-foreground">
              Selecione uma escola para começar o estudo
            </p>
          </div>
        </header>
        <section aria-label="Escolas">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {escolasCatalogo.map((escola) => (
              <CardEscola key={escola.id} escola={escola} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
