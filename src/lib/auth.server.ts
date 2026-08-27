import { createClient, type User } from "@supabase/supabase-js";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";

const ACCESS_TOKEN_COOKIE = "estudio_access_token";
const REFRESH_TOKEN_COOKIE = "estudio_refresh_token";
const RECOVERY_COOKIE = "estudio_recuperacao_ativa";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const RECOVERY_COOKIE_MAX_AGE = 60 * 15; // 15 minutos

export type PapelUsuario = "admin" | "ritmista";

export type UsuarioAutenticado = {
  id: string;
  email: string | null;
  papel: PapelUsuario;
  nomeExibicao: string;
  deveTrocarSenha: boolean;
};

function obterConfiguracao() {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const chave =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !chave) {
    throw new Error("Supabase não configurado no ambiente do servidor.");
  }
  return { url, chave };
}

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request
        ? input.headers
        : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function criarCliente(accessToken?: string) {
  const { url, chave } = obterConfiguracao();
  return createClient(url, chave, {
    global: {
      fetch: createSupabaseFetch(chave),
      ...(accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {}),
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function opcoesCookie() {
  return {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

function opcoesCookieRecuperacao() {
  return {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: RECOVERY_COOKIE_MAX_AGE,
  };
}

function papelDoUsuario(user: User): PapelUsuario {
  return user.app_metadata?.["role"] === "admin" ? "admin" : "ritmista";
}

function usuarioPublico(user: User): UsuarioAutenticado {
  const papel = papelDoUsuario(user);
  const nomeAdministrativo = user.app_metadata?.["admin_login"];
  return {
    id: user.id,
    email: papel === "admin" ? null : user.email ?? null,
    papel,
    deveTrocarSenha:
      papel === "ritmista" && !user.user_metadata?.["password_changed_by_user_at"],
    nomeExibicao:
      papel === "admin" && typeof nomeAdministrativo === "string" && nomeAdministrativo.trim()
        ? nomeAdministrativo.trim()
        : papel === "admin"
          ? "Administrador"
          : user.email ?? "Ritmista",
  };
}

export async function entrarComSenha(email: string, senha: string) {
  const cliente = criarCliente();
  const { data, error } = await cliente.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (
    error ||
    !data.session ||
    !data.user ||
    data.user.app_metadata?.["role"] === "admin"
  ) {
    return {
      ok: false as const,
      erro: "Ritmista ou senha não conferem.",
    };
  }

  const opcoes = opcoesCookie();
  setCookie(ACCESS_TOKEN_COOKIE, data.session.access_token, opcoes);
  setCookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, opcoes);
  return { ok: true as const, usuario: usuarioPublico(data.user) };
}

export async function entrarAdministrador(usuario: string, senha: string) {
  const loginConfigurado = process.env["ADMIN_LOGIN_NAME"]?.trim();
  const emailConfigurado = process.env["ADMIN_LOGIN_EMAIL"]?.trim();
  const loginInformado = usuario.trim();

  if (
    !loginConfigurado ||
    !emailConfigurado ||
    !loginInformado ||
    loginInformado.toLocaleLowerCase() !== loginConfigurado.toLocaleLowerCase()
  ) {
    return { ok: false as const, erro: "Usuário ou senha não conferem." };
  }

  const cliente = criarCliente();
  const { data, error } = await cliente.auth.signInWithPassword({
    email: emailConfigurado,
    password: senha,
  });
  if (
    error ||
    !data.session ||
    !data.user ||
    data.user.app_metadata?.["role"] !== "admin"
  ) {
    return { ok: false as const, erro: "Usuário ou senha não conferem." };
  }

  const opcoes = opcoesCookie();
  setCookie(ACCESS_TOKEN_COOKIE, data.session.access_token, opcoes);
  setCookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, opcoes);
  return { ok: true as const, usuario: usuarioPublico(data.user) };
}

export async function trocarSenhaPrimeiroAcesso(novaSenha: string) {
  const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);
  if (!accessToken || !refreshToken) {
    return { ok: false as const, erro: "Não foi possível atualizar a senha." };
  }

  const cliente = criarCliente();
  const { data: sessaoData, error: sessaoError } = await cliente.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (sessaoError || !sessaoData.session || !sessaoData.user) {
    console.error(
      "Falha ao estabelecer sessão para troca de senha.",
      sessaoError?.message ?? "Sessão ausente.",
    );
    return { ok: false as const, erro: "Não foi possível atualizar a senha." };
  }

  const opcoes = opcoesCookie();
  setCookie(ACCESS_TOKEN_COOKIE, sessaoData.session.access_token, opcoes);
  setCookie(REFRESH_TOKEN_COOKIE, sessaoData.session.refresh_token, opcoes);

  if (papelDoUsuario(sessaoData.user) === "admin") {
    return { ok: false as const, erro: "Não foi possível atualizar a senha." };
  }

  const { data, error } = await cliente.auth.updateUser({
    password: novaSenha,
    data: {
      ...(sessaoData.user.user_metadata ?? {}),
      password_changed_by_user_at: new Date().toISOString(),
    },
  });
  if (error || !data.user) {
    console.error(
      "Falha ao atualizar senha de primeiro acesso.",
      error?.message ?? "Usuário ausente.",
    );
    return { ok: false as const, erro: "Não foi possível atualizar a senha." };
  }

  return { ok: true as const, usuario: usuarioPublico(data.user) };
}

export async function obterUsuarioAtual(): Promise<UsuarioAutenticado | null> {
  const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
  if (!accessToken) return null;

  const cliente = criarCliente(accessToken);
  const { data, error } = await cliente.auth.getUser(accessToken);
  if (!error && data.user) return usuarioPublico(data.user);

  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);
  if (refreshToken) {
    const renovacao = await criarCliente().auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (renovacao.data.session && renovacao.data.user && !renovacao.error) {
      const opcoes = opcoesCookie();
      setCookie(ACCESS_TOKEN_COOKIE, renovacao.data.session.access_token, opcoes);
      setCookie(REFRESH_TOKEN_COOKIE, renovacao.data.session.refresh_token, opcoes);
      return usuarioPublico(renovacao.data.user);
    }
  }

  sairDaSessao();
  return null;
}

export function sairDaSessao() {
  deleteCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
  deleteCookie(REFRESH_TOKEN_COOKIE, { path: "/" });
  deleteCookie(RECOVERY_COOKIE, { path: "/" });
}

export async function confirmarRecuperacaoComTokenHash(
  tokenHash: string,
  tipo: string = "recovery",
) {
  if (!tokenHash || tipo !== "recovery") {
    return {
      ok: false as const,
      erro: "Link de recuperação inválido ou expirado.",
    };
  }

  const cliente = criarCliente();
  const { data, error } = await cliente.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });

  if (error || !data.session || !data.user) {
    return {
      ok: false as const,
      erro: "Link de recuperação inválido ou expirado.",
    };
  }

  const opcoes = opcoesCookie();
  const opcoesRecuperacao = opcoesCookieRecuperacao();

  setCookie(ACCESS_TOKEN_COOKIE, data.session.access_token, opcoes);
  setCookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, opcoes);
  setCookie(RECOVERY_COOKIE, "true", opcoesRecuperacao);

  return {
    ok: true as const,
    usuario: usuarioPublico(data.user),
  };
}

export async function estabelecerSessaoRecuperacaoPorTokens(
  accessToken: string,
  refreshToken: string,
) {
  console.info("[recovery server] server function iniciada");
  const tokenAcesso = accessToken.trim();
  const tokenRefresh = refreshToken.trim();

  console.info("[recovery server] access token presente:", Boolean(tokenAcesso));
  console.info("[recovery server] refresh token presente:", Boolean(tokenRefresh));

  if (!tokenAcesso || !tokenRefresh) {
    console.warn("[recovery server] tokens vazios ou ausentes");
    return {
      ok: false as const,
      erro: "Link de recuperação inválido ou expirado.",
    };
  }

  const cliente = criarCliente();
  const { data, error } = await cliente.auth.setSession({
    access_token: tokenAcesso,
    refresh_token: tokenRefresh,
  });

  if (error) {
    console.error("[recovery server] setSession falhou:", error.name, error.message);
    return {
      ok: false as const,
      erro: "Link de recuperação inválido ou expirado.",
    };
  }

  console.info("[recovery server] setSession sucesso");
  console.info("[recovery server] session presente:", Boolean(data?.session));
  console.info("[recovery server] user presente:", Boolean(data?.user));

  if (!data?.session || !data?.user) {
    console.error("[recovery server] session ou user ausente apos setSession");
    return {
      ok: false as const,
      erro: "Link de recuperação inválido ou expirado.",
    };
  }

  const opcoes = opcoesCookie();
  const opcoesRecuperacao = opcoesCookieRecuperacao();

  setCookie(ACCESS_TOKEN_COOKIE, data.session.access_token, opcoes);
  setCookie(REFRESH_TOKEN_COOKIE, data.session.refresh_token, opcoes);
  setCookie(RECOVERY_COOKIE, "true", opcoesRecuperacao);

  console.info("[recovery server] cookies gravados com sucesso");

  return {
    ok: true as const,
    usuario: usuarioPublico(data.user),
  };
}

export async function validarSessaoRecuperacao(): Promise<boolean> {
  console.info("[recovery validate] validando sessao de recuperacao");
  const cookieRecuperacao = getCookie(RECOVERY_COOKIE);
  const recoveryCookiePresente = Boolean(cookieRecuperacao && cookieRecuperacao === "true");
  console.info("[recovery validate] recovery cookie presente:", recoveryCookiePresente);

  if (!recoveryCookiePresente) {
    return false;
  }

  const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
  console.info("[recovery validate] access token cookie presente:", Boolean(accessToken));
  if (!accessToken) {
    return false;
  }

  const cliente = criarCliente(accessToken);
  const { data, error } = await cliente.auth.getUser(accessToken);
  if (!error && data.user) {
    console.info("[recovery validate] sessao valida com getUser: true");
    return true;
  }

  if (error) {
    console.warn("[recovery validate] getUser erro:", error.name, error.message);
  }

  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);
  console.info("[recovery validate] refresh token cookie presente:", Boolean(refreshToken));
  if (refreshToken) {
    const renovacao = await criarCliente().auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (renovacao.data.session && renovacao.data.user && !renovacao.error) {
      console.info("[recovery validate] sessao renovada com sucesso: true");
      const opcoes = opcoesCookie();
      setCookie(ACCESS_TOKEN_COOKIE, renovacao.data.session.access_token, opcoes);
      setCookie(REFRESH_TOKEN_COOKIE, renovacao.data.session.refresh_token, opcoes);
      return true;
    }
    if (renovacao.error) {
      console.warn("[recovery validate] refreshSession erro:", renovacao.error.name, renovacao.error.message);
    }
  }

  console.warn("[recovery validate] sessao invalida");
  return false;
}

export async function redefinirSenhaRecuperacao(novaSenha: string) {
  const valida = await validarSessaoRecuperacao();
  if (!valida) {
    return {
      ok: false as const,
      erro: "Sessão de recuperação inválida ou expirada. Solicite um novo link.",
    };
  }

  const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);
  if (!accessToken || !refreshToken) {
    return {
      ok: false as const,
      erro: "Sessão de recuperação inválida ou expirada. Solicite um novo link.",
    };
  }

  const cliente = criarCliente();
  const { data: sessaoData, error: sessaoError } = await cliente.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessaoError || !sessaoData.session || !sessaoData.user) {
    return {
      ok: false as const,
      erro: "Sessão de recuperação inválida ou expirada. Solicite um novo link.",
    };
  }

  const { data, error } = await cliente.auth.updateUser({
    password: novaSenha,
  });

  if (error || !data.user) {
    return {
      ok: false as const,
      erro: "Não foi possível atualizar a senha. Tente novamente.",
    };
  }

  sairDaSessao();
  return { ok: true as const };
}

export async function exigirAdmin() {
  const usuario = await obterUsuarioAtual();
  if (!usuario || usuario.papel !== "admin") {
    throw new Error("Apenas administradores podem alterar este conteúdo.");
  }
  return usuario;
}
