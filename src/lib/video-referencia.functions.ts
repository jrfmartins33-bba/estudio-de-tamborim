import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BUCKET = "referencias";
const TAMANHO_MAXIMO_BYTES = 200 * 1024 * 1024;
const entradaUpload = z.object({ execucaoId: z.string().min(1).max(120), tamanhoBytes: z.number().int().positive().max(TAMANHO_MAXIMO_BYTES), tipoArquivo: z.literal("video/mp4") });
const entradaExecucao = z.object({ execucaoId: z.string().min(1).max(120) });
const entradaConfirmacao = z.object({ execucaoId: z.string().min(1).max(120), storagePath: z.string().min(1).max(300) });
function caminhoDoVideo(execucaoId: string) { const slug = execucaoId.replace(/[^a-zA-Z0-9-_]/g, "-"); return `execucoes/${slug}/referencia.mp4`; }

export const criarUploadAssinado = createServerFn({ method: "POST" }).validator((data: unknown) => entradaUpload.parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const storagePath = caminhoDoVideo(data.execucaoId);
  const { data: assinado, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(storagePath, { upsert: true });
  if (error || !assinado) { console.error("[video-referencia] falha ao assinar upload", error); return { ok: false as const, erro: "Não foi possível preparar o upload." }; }
  return { ok: true as const, signedUrl: assinado.signedUrl, storagePath };
});

export const salvarVideoReferencia = createServerFn({ method: "POST" }).validator((data: unknown) => entradaConfirmacao.parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const esperado = caminhoDoVideo(data.execucaoId);
  if (data.storagePath !== esperado) return { ok: false as const, erro: "Caminho de arquivo inválido." };
  const { error } = await supabaseAdmin.from("execucao_video_referencia").upsert({ execucao_id: data.execucaoId, storage_path: esperado, updated_at: new Date().toISOString() }, { onConflict: "execucao_id" });
  if (error) { console.error("[video-referencia] falha ao salvar referência", error); return { ok: false as const, erro: "Não foi possível salvar a referência do vídeo." }; }
  const url = await assinarLeitura(supabaseAdmin, esperado);
  if (!url) return { ok: false as const, erro: "Vídeo enviado, mas não foi possível gerá-lo para reprodução." };
  return { ok: true as const, videoUrl: url };
});

export const obterVideoReferencia = createServerFn({ method: "GET" }).validator((data: unknown) => entradaExecucao.parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: linha } = await supabaseAdmin.from("execucao_video_referencia").select("storage_path").eq("execucao_id", data.execucaoId).maybeSingle();
  if (!linha) return { videoUrl: null as string | null };
  return { videoUrl: await assinarLeitura(supabaseAdmin, linha.storage_path) };
});

async function assinarLeitura(client: { storage: { from: (b: string) => { createSignedUrl: (p: string, s: number) => Promise<{ data: { signedUrl: string } | null }> } } }, storagePath: string) {
  const { data } = await client.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60 * 8);
  return data?.signedUrl ?? null;
}
