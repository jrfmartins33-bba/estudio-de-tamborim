import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { trocarSenhaPrimeiroAcesso } from "@/lib/auth.functions";

export function PrimeiroAcesso({
  onConcluido,
}: {
  onConcluido: () => Promise<void> | void;
}) {
  const trocarSenha = useServerFn(trocarSenhaPrimeiroAcesso);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const aoEnviar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);
    if (novaSenha.length < 8 || novaSenha !== confirmacao) {
      setErro("Confira os campos e tente novamente.");
      return;
    }

    setSalvando(true);
    try {
      const resultado = await trocarSenha({ data: { novaSenha } });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      await onConcluido();
    } catch {
      setErro("Não foi possível atualizar a senha. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-8 sm:px-6">
        <section className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Primeiro acesso
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Crie sua nova senha
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Por segurança, defina uma senha pessoal antes de continuar.
          </p>
          <form className="mt-6 space-y-4" onSubmit={aoEnviar}>
            <label className="block">
              <span className="text-sm font-bold">Nova senha</span>
              <input
                type="password"
                name="novaSenha"
                value={novaSenha}
                onChange={(event) => setNovaSenha(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold">Confirmar nova senha</span>
              <input
                type="password"
                name="confirmarSenha"
                value={confirmacao}
                onChange={(event) => setConfirmacao(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            {erro ? (
              <p className="text-sm font-medium text-destructive" role="alert">
                {erro}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={salvando}
              className="min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground transition-opacity disabled:opacity-60"
            >
              {salvando ? "Salvando…" : "Salvar nova senha e continuar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
