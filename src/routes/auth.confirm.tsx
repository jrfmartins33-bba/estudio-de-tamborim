import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { confirmarRecuperacaoTokenHash } from "@/lib/auth.functions";

const confirmSearchSchema = z.object({
  token_hash: z.string().optional(),
  type: z.string().optional(),
  next: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const Route = createFileRoute("/auth/confirm")({
  validateSearch: (search) => confirmSearchSchema.parse(search),
  beforeLoad: async ({ search }) => {
    const tokenHash = search.token_hash;
    const type = search.type ?? "recovery";
    const next = search.next || "/redefinir-senha";

    if (!tokenHash || type !== "recovery") {
      throw redirect({
        to: "/redefinir-senha",
        search: { erro: "invalido" },
      });
    }

    try {
      const resultado = await confirmarRecuperacaoTokenHash({
        data: {
          token_hash: tokenHash,
          type,
        },
      });

      if (!resultado.ok) {
        throw redirect({
          to: "/redefinir-senha",
          search: { erro: "invalido" },
        });
      }

      throw redirect({
        to: next as any,
      });
    } catch (error) {
      if (typeof error === "object" && error !== null && "to" in error) {
        throw error;
      }
      throw redirect({
        to: "/redefinir-senha",
        search: { erro: "invalido" },
      });
    }
  },
  component: AuthConfirmPage,
});

function AuthConfirmPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050811] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/14 bg-white/6 p-6 text-center backdrop-blur-md sm:p-8">
        <p className="text-sm font-bold text-white/70">
          Validando link de recuperação…
        </p>
      </div>
    </main>
  );
}
