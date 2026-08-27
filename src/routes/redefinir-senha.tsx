import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  redefinirSenhaRecuperacao,
  validarSessaoRecuperacaoAtiva,
} from "@/lib/auth.functions";

const searchSchema = z.object({
  erro: z.string().optional(),
});

export const Route = createFileRoute("/redefinir-senha")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Estúdio de Tamborim — Definir nova senha" },
      { name: "description", content: "Defina sua nova senha de acesso ao Estúdio de Tamborim." },
    ],
  }),
  loader: async () => {
    const { valida } = await validarSessaoRecuperacaoAtiva();
    console.info("[recovery page loader] sessao valida:", valida);
    return { valida };
  },
  component: PaginaRedefinirSenha,
});

function PaginaRedefinirSenha() {
  const { valida } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();

  const redefinirSenha = useServerFn(redefinirSenhaRecuperacao);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(
    search.erro === "invalido" ? "Link de recuperação inválido ou expirado." : null,
  );
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!sucesso) return;

    const timer = setTimeout(() => {
      router.invalidate();
      void navigate({ to: "/" });
    }, 2500);

    return () => clearTimeout(timer);
  }, [sucesso, navigate, router]);

  if (!valida || search.erro === "invalido") {
    return (
      <main className="min-h-screen bg-[#050811] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8 sm:px-6">
          <section className="w-full rounded-3xl border border-white/14 bg-white/6 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Link inválido ou expirado
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              O link de recuperação utilizado não é mais válido ou expirou. Por segurança, solicite um novo link de recuperação de senha.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#ffd37a] px-5 text-sm font-black text-[#14233b] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              >
                Voltar para o início
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const aoEnviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);

    if (novaSenha.length < 8) {
      setErro("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmacao) {
      setErro("As duas senhas não conferem. Verifique e tente novamente.");
      return;
    }

    setSalvando(true);
    try {
      const resultado = await redefinirSenha({
        data: { novaSenha },
      });

      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }

      setSucesso(true);
    } catch {
      setErro("Não foi possível atualizar a senha. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  if (sucesso) {
    return (
      <main className="min-h-screen bg-[#050811] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8 sm:px-6">
          <section className="w-full rounded-3xl border border-white/14 bg-white/6 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
            <h1 className="text-2xl font-black tracking-tight text-[#ffd37a] sm:text-3xl">
              Senha atualizada com sucesso.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Redirecionando para a página inicial para você entrar com a sua nova senha…
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#ffd37a] px-5 text-sm font-black text-[#14233b] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
              >
                Ir para o início agora
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050811] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8 sm:px-6">
        <section className="w-full rounded-3xl border border-white/14 bg-white/6 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Definir nova senha
          </h1>
          <form className="mt-6 space-y-4" onSubmit={aoEnviar}>
            <label className="block">
              <span className="text-sm font-bold text-white/82">Nova senha</span>
              <input
                type="password"
                name="novaSenha"
                value={novaSenha}
                onChange={(event) => setNovaSenha(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                placeholder="Mínimo de 8 caracteres"
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-white/16 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/38 focus:border-[#ffd37a] focus:ring-2 focus:ring-[#ffd37a]/24"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-white/82">Confirmar nova senha</span>
              <input
                type="password"
                name="confirmarNovaSenha"
                value={confirmacao}
                onChange={(event) => setConfirmacao(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                placeholder="Repita a nova senha"
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-white/16 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/38 focus:border-[#ffd37a] focus:ring-2 focus:ring-[#ffd37a]/24"
              />
            </label>
            {erro ? (
              <p className="text-sm font-medium text-[#ffd1c7]" role="alert">
                {erro}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={salvando}
              className="mt-2 min-h-12 w-full rounded-xl bg-[#ffd37a] px-5 text-sm font-black text-[#14233b] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white disabled:opacity-60"
            >
              {salvando ? "Salvando…" : "SALVAR NOVA SENHA"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
