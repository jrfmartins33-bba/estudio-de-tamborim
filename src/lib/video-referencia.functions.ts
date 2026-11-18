import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const BUCKET = "referencias";
const TAMANHO_MAXIMO_BYTES = 200 * 1024 * 1024;
const entradaUpload = z.object({ execucaoId: z.string().min(1).max(120), tamanhoBytes: z.number().int().positive().max(TAMANHO_MAXIMO_BYTES), tipoArquivo: z.literal("video/mp4") });
const entradaExecucao = z.object({ execucaoId: z.string().min(1).max(120) });
const entradaConfirmacao = z.object({ execucaoId: z.string().min(1).max(120), storagePath: z.string().min(1).max(300) });
function caminhoDoVideo(execucaoId: string) { const slug = execucaoId.replace(/[^a-zA-Z0-9-_]/g, "-"); return `execucoes/${slug}/referencia.mp4`; }

export const criarUploadAssinado = createServerFn({ method: "POST" }).validator((data: unknown) => entradaUpload.parse(data)).handler(async ({ data }) => {
  const { exigirAdmin } = await import("@/lib/auth.server");
  try { await exigirAdmin(); } catch { return { ok: false as const, erro: "Somente o administrador pode conectar um vídeo." }; }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const storagePath = caminhoDoVideo(data.execucaoId);
  const { data: assinado, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(storagePath, { upsert: true });
  if (error || !assinado) { console.error("[video-referencia] falha ao assinar upload", error); return { ok: false as const, erro: "Não foi possível preparar o upload." }; }
  return { ok: true as const, signedUrl: assinado.signedUrl, storagePath };
});

export const salvarVideoReferencia = createServerFn({ method: "POST" }).validator((data: unknown) => entradaConfirmacao.parse(data)).handler(async ({ data }) => {
  const { exigirAdmin } = await import("@/lib/auth.server");
  try { await exigirAdmin(); } catch { return { ok: false as const, erro: "Somente o administrador pode salvar o vídeo." }; }
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
  try {
    const { criarSupabaseClientePublico } = await import("@/integrations/supabase/client.server");
    const supabasePublico = criarSupabaseClientePublico();
    const { data: linha, error } = await supabasePublico.from("execucao_video_referencia").select("storage_path").eq("execucao_id", data.execucaoId).maybeSingle();
    if (error) {
      console.error("[video-referencia] falha ao consultar referência", error);
      return { videoUrl: null as string | null, erroVideo: true as const };
    }
    if (!linha) return { videoUrl: null as string | null, erroVideo: false as const };
    const { data: assinado, error: erroAssinatura } = await supabasePublico.storage.from(BUCKET).createSignedUrl(linha.storage_path, 60 * 60 * 8);
    if (erroAssinatura || !assinado?.signedUrl) {
      console.error("[video-referencia] falha ao gerar URL assinada", erroAssinatura);
      return { videoUrl: null as string | null, erroVideo: true as const };
    }
    return { videoUrl: assinado.signedUrl, erroVideo: false as const };
  } catch (error) {
    console.error("[video-referencia] falha inesperada ao carregar referência", error);
    return { videoUrl: null as string | null, erroVideo: true as const };
  }
});

export const listarVideosReferencia = createServerFn({ method: "GET" })
  .validator((data: unknown) => entradaExecucao.parse(data))
  .handler(async ({ data }) => {
    try {
      const pasta = `execucoes/${data.execucaoId.replace(/[^a-zA-Z0-9-_]/g, "-")}`;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: arquivos, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .list(pasta, { limit: 100, sortBy: { column: "name", order: "asc" } });

      if (error || !arquivos) {
        console.error("[video-referencia] falha ao listar vídeos", error);
        return { videos: [] as { caminho: string; nome: string; url: string }[], erroVideo: true as const };
      }

      const videos = await Promise.all(
        arquivos
          .filter((arquivo) => arquivo.name.toLowerCase().endsWith(".mp4"))
          .map(async (arquivo) => {
            const caminho = `${pasta}/${arquivo.name}`;
            const { data: assinado, error: erroAssinatura } = await supabaseAdmin.storage
              .from(BUCKET)
              .createSignedUrl(caminho, 60 * 60 * 8);
            if (erroAssinatura || !assinado?.signedUrl) return null;
            return { caminho, nome: arquivo.name, url: assinado.signedUrl };
          }),
      );

      return {
        videos: videos.filter((video): video is NonNullable<typeof video> => video !== null),
        erroVideo: false as const,
      };
    } catch (error) {
      console.error("[video-referencia] falha inesperada ao listar vídeos", error);
      return { videos: [] as { caminho: string; nome: string; url: string }[], erroVideo: true as const };
    }
  });

async function assinarLeitura(client: SupabaseClient<Database>, storagePath: string) {
  const { data, error } = await client.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60 * 8);
  if (error) {
    console.error("[video-referencia] falha ao gerar URL assinada após upload", error);
  }
  return data?.signedUrl ?? null;
}
