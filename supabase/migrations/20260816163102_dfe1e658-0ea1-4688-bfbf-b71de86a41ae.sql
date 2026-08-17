CREATE TABLE public.trecho_estudo (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execucao_id text NOT NULL,
  ordem integer NOT NULL,
  nome text NOT NULL,
  inicio_segundos double precision NOT NULL,
  fim_segundos double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT trecho_estudo_intervalo CHECK (fim_segundos > inicio_segundos AND inicio_segundos >= 0),
  CONSTRAINT trecho_estudo_ordem_unica UNIQUE (execucao_id, ordem)
);
GRANT ALL ON public.trecho_estudo TO service_role;
ALTER TABLE public.trecho_estudo ENABLE ROW LEVEL SECURITY;
