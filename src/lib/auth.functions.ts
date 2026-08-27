import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const entradaLogin = z.object({
  email: z.string().trim().email().max(320),
  senha: z.string().min(1).max(200),
});

const entradaLoginAdministrador = z.object({
  usuario: z.string().trim().min(1).max(120),
  senha: z.string().min(1).max(200),
});

const entradaLoginUnificado = z.object({
  identificador: z.string().trim().min(1).max(320),
  senha: z.string().min(1).max(200),
});

const entradaTrocaSenha = z.object({
  novaSenha: z.string().min(8).max(200),
});

export const entrarRitmista = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaLogin.parse(data))
  .handler(async ({ data }) => {
    const { entrarComSenha } = await import("@/lib/auth.server");
    return entrarComSenha(data.email, data.senha);
  });

export const entrarAdministrador = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaLoginAdministrador.parse(data))
  .handler(async ({ data }) => {
    const { entrarAdministrador: autenticarAdministrador } = await import(
      "@/lib/auth.server"
    );
    return autenticarAdministrador(data.usuario, data.senha);
  });

export const entrarUsuario = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaLoginUnificado.parse(data))
  .handler(async ({ data }) => {
    if (data.identificador.includes("@")) {
      const { entrarComSenha } = await import("@/lib/auth.server");
      return entrarComSenha(data.identificador, data.senha);
    }

    const { entrarAdministrador: autenticarAdministrador } = await import(
      "@/lib/auth.server"
    );
    return autenticarAdministrador(data.identificador, data.senha);
  });

export const trocarSenhaPrimeiroAcesso = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaTrocaSenha.parse(data))
  .handler(async ({ data }) => {
    const { trocarSenhaPrimeiroAcesso: atualizarSenha } = await import(
      "@/lib/auth.server"
    );
    return atualizarSenha(data.novaSenha);
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

const entradaConfirmacaoRecuperacao = z.object({
  token_hash: z.string().trim().min(1),
  type: z.string().trim().default("recovery"),
});

export const confirmarRecuperacaoTokenHash = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaConfirmacaoRecuperacao.parse(data))
  .handler(async ({ data }) => {
    const { confirmarRecuperacaoComTokenHash } = await import("@/lib/auth.server");
    return confirmarRecuperacaoComTokenHash(data.token_hash, data.type);
  });

export const validarSessaoRecuperacaoAtiva = createServerFn({ method: "GET" }).handler(
  async () => {
    const { validarSessaoRecuperacao } = await import("@/lib/auth.server");
    const valida = await validarSessaoRecuperacao();
    return { valida };
  },
);

export const redefinirSenhaRecuperacao = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaTrocaSenha.parse(data))
  .handler(async ({ data }) => {
    const { redefinirSenhaRecuperacao: executarRedefinicao } = await import(
      "@/lib/auth.server"
    );
    return executarRedefinicao(data.novaSenha);
  });

const entradaEstabelecerTokens = z.object({
  accessToken: z.string().trim().min(1),
  refreshToken: z.string().trim().min(1),
});

export const estabelecerSessaoRecuperacaoTokens = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaEstabelecerTokens.parse(data))
  .handler(async ({ data }) => {
    const { estabelecerSessaoRecuperacaoPorTokens } = await import(
      "@/lib/auth.server"
    );
    return estabelecerSessaoRecuperacaoPorTokens(
      data.accessToken,
      data.refreshToken,
    );
  });
