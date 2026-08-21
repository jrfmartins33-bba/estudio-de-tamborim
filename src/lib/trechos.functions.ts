import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AnaliseMusicalTrecho } from "@/data/types";

const entradaListagem = z.object({ execucaoId: z.string().min(1).max(120) });
const entradaCriacao = z.object({ execucaoId: z.string().min(1).max(120), inicioSegundos: z.number().nonnegative().finite(), fimSegundos: z.number().positive().finite() });

export const listarTrechos = createServerFn({ method: "GET" })
  .validator((data: unknown) => entradaListagem.parse(data))
  .handler(async ({ data }) => {
    const { obterUsuarioAtual } = await import("@/lib/auth.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: linhas, error } = await supabaseAdmin.from("trecho_estudo").select("id, nome, ordem, inicio_segundos, fim_segundos, analise_musical").eq("execucao_id", data.execucaoId).order("ordem", { ascending: true });
    if (error) { console.error("[trechos] falha ao listar", error); return { trechos: [] }; }
    const oficiais = (linhas ?? []).map((l) => ({ id: l.id, nome: l.nome, ordem: l.ordem, inicio: l.inicio_segundos, fim: l.fim_segundos, analiseMusical: (l.analise_musical ?? null) as AnaliseMusicalTrecho | null, origem: "oficial" as const }));
    const usuario = await obterUsuarioAtual();
    if (!usuario) return { trechos: oficiais };

    const { data: pessoais, error: erroPessoais } = await supabaseAdmin
      .from("trecho_pessoal")
      .select("id, nome, inicio_segundos, fim_segundos, created_at")
      .eq("user_id", usuario.id)
      .eq("execucao_id", data.execucaoId)
      .order("created_at", { ascending: true });
    if (erroPessoais) {
      console.error("[trechos] falha ao listar trechos pessoais", erroPessoais);
      return { trechos: oficiais };
    }
    const meusTrechos = (pessoais ?? []).map((l, indice) => ({ id: l.id, nome: l.nome, ordem: indice + 1, inicio: l.inicio_segundos, fim: l.fim_segundos, analiseMusical: null as AnaliseMusicalTrecho | null, origem: "pessoal" as const }));
    return { trechos: [...oficiais, ...meusTrechos] };
  });

export const salvarTrecho = createServerFn({ method: "POST" })
  .validator((data: unknown) => entradaCriacao.parse(data))
  .handler(async ({ data }) => {
    if (data.fimSegundos <= data.inicioSegundos) return { ok: false as const, erro: "O fim do trecho precisa ser maior que o início." };
    const { obterUsuarioAtual } = await import("@/lib/auth.server");
    const usuario = await obterUsuarioAtual();
    if (!usuario) return { ok: false as const, erro: "Entre para salvar seus trechos." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (usuario.papel !== "admin") {
      const { count } = await supabaseAdmin
        .from("trecho_pessoal")
        .select("id", { count: "exact", head: true })
        .eq("user_id", usuario.id)
        .eq("execucao_id", data.execucaoId);
      const ordem = (count ?? 0) + 1;
      const { error } = await supabaseAdmin.from("trecho_pessoal").insert({
        user_id: usuario.id,
        execucao_id: data.execucaoId,
        nome: `Meu trecho ${String(ordem).padStart(2, "0")}`,
        inicio_segundos: data.inicioSegundos,
        fim_segundos: data.fimSegundos,
      });
      if (error) {
        console.error("[trechos] falha ao salvar trecho pessoal", error);
        return { ok: false as const, erro: "Não foi possível salvar seu trecho." };
      }
      return { ok: true as const, ordem, origem: "pessoal" as const };
    }

    const { data: ultimo } = await supabaseAdmin.from("trecho_estudo").select("ordem").eq("execucao_id", data.execucaoId).order("ordem", { ascending: false }).limit(1).maybeSingle();
    const ordem = (ultimo?.ordem ?? 0) + 1;
    const { error } = await supabaseAdmin.from("trecho_estudo").insert({ execucao_id: data.execucaoId, ordem, nome: `Trecho ${String(ordem).padStart(2, "0")}`, inicio_segundos: data.inicioSegundos, fim_segundos: data.fimSegundos });
    if (error) { console.error("[trechos] falha ao salvar", error); return { ok: false as const, erro: "Não foi possível salvar o trecho." }; }
    return { ok: true as const, ordem, origem: "oficial" as const };
  });
