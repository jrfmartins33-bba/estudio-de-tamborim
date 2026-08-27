import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { obterSessaoRitmista } from "@/lib/auth.functions";

export const Route = createFileRoute("/escolas")({
  beforeLoad: async () => {
    const sessao = await obterSessaoRitmista();
    if (!sessao?.usuario) {
      throw redirect({ to: "/" });
    }
    return { usuario: sessao.usuario };
  },
  component: Outlet,
});
