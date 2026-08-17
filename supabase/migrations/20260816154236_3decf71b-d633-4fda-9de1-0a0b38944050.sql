CREATE TABLE public.execucao_video_referencia (
  execucao_id TEXT PRIMARY KEY,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.execucao_video_referencia TO service_role;
ALTER TABLE public.execucao_video_referencia ENABLE ROW LEVEL SECURITY;
