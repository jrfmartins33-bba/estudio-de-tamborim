CREATE TABLE public.execucao_informacao (
  execucao_id text PRIMARY KEY,
  conteudo jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.execucao_informacao TO service_role;
ALTER TABLE public.execucao_informacao ENABLE ROW LEVEL SECURITY;
