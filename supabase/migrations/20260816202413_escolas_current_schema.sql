-- Canonicaliza no repositório as tabelas de escolas que já existem no Supabase atual.
CREATE TABLE IF NOT EXISTS public.escola_samba (
  id text PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.escola_samba ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.escola_samba TO service_role;

CREATE TABLE IF NOT EXISTS public.escola_participacao_carnaval (
  escola_id text NOT NULL REFERENCES public.escola_samba(id) ON DELETE CASCADE,
  ano integer NOT NULL CHECK (ano >= 1900),
  grupo text NOT NULL CHECK (grupo IN ('grupo_especial','serie_ouro')),
  PRIMARY KEY (escola_id, ano)
);
ALTER TABLE public.escola_participacao_carnaval ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.escola_participacao_carnaval TO service_role;
