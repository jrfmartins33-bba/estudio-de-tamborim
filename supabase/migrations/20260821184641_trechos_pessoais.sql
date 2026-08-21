CREATE TABLE public.trecho_pessoal (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  execucao_id text NOT NULL,
  nome text NOT NULL,
  inicio_segundos double precision NOT NULL,
  fim_segundos double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT trecho_pessoal_intervalo CHECK (fim_segundos > inicio_segundos AND inicio_segundos >= 0)
);

CREATE INDEX trecho_pessoal_usuario_execucao_idx
  ON public.trecho_pessoal (user_id, execucao_id, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trecho_pessoal TO authenticated;
GRANT ALL ON public.trecho_pessoal TO service_role;

ALTER TABLE public.trecho_pessoal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ritmista lê seus próprios trechos"
  ON public.trecho_pessoal FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Ritmista cria seus próprios trechos"
  ON public.trecho_pessoal FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Ritmista atualiza seus próprios trechos"
  ON public.trecho_pessoal FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Ritmista exclui seus próprios trechos"
  ON public.trecho_pessoal FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);
