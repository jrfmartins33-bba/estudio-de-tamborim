import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const entradaLogin = z.object({
  email: z.string().trim().email().max(320),
  senha: z.string().min(1).max(200),
});

export const entrarRitmista = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaLogin.parse(data))
  .handler(async ({ data }) => {
    const { entrarComSenha } = await import("@/lib/auth.server");
    return entrarComSenha(data.email, data.senha);
  });

export const obterSessaoRitmista = createServerFn({ method: "GET" }).handler(
  async () => {
    const { obterUsuarioAtual } = await import("@/lib/auth.server");
    return { usuario: await obterUsuarioAtual() };
  },
);

export const sairRitmista = createServerFn({ method: "POST" }).handler(
  async () => {
    const { sairDaSessao } = await import("@/lib/auth.server");
    sairDaSessao();
    return { ok: true as const };
  },
);
