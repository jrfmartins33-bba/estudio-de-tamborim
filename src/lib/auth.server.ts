import { createClient, type User } from "@supabase/supabase-js";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";

const ACCESS_TOKEN_COOKIE = "estudio_access_token";
const REFRESH_TOKEN_COOKIE = "estudio_refresh_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

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

function criarCliente(accessToken?: string) {
  const { url, chave } = obterConfiguracao();
  return createClient(url, chave, {
    ...(accessToken
      ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
      : {}),
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
}

export async function exigirAdmin() {
  const usuario = await obterUsuarioAtual();
  if (!usuario || usuario.papel !== "admin") {
    throw new Error("Apenas administradores podem alterar este conteúdo.");
  }
  return usuario;
}
