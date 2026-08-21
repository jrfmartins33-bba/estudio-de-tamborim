import { createClient } from '@supabase/supabase-js';
import { getCookie } from '@tanstack/react-start/server';
import type { Database } from './types';

const ACCESS_TOKEN_COOKIE = 'estudio_access_token';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined);
    if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) headers.delete('Authorization');
    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function obterConfiguracaoPublica() {
  const SUPABASE_URL = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const SUPABASE_PUBLISHABLE_KEY = process.env['SUPABASE_PUBLISHABLE_KEY'] || process.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [...(!SUPABASE_URL ? ['SUPABASE_URL'] : []), ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : [])];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY };
}

function criarClientePublico(accessToken?: string) {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = obterConfiguracaoPublica();
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    ...(accessToken ? { global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY), headers: { Authorization: `Bearer ${accessToken}` } } } : { global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) } }),
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export function criarSupabaseClientePublico() {
  return criarClientePublico();
}

export function criarSupabaseClienteAutenticado() {
  const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
  return accessToken ? criarClientePublico(accessToken) : null;
}

function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env['SUPABASE_URL'];
  const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [...(!SUPABASE_URL ? ['SUPABASE_URL'] : []), ...(!SUPABASE_SERVICE_ROLE_KEY ? ['SUPABASE_SERVICE_ROLE_KEY'] : [])];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false }
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
