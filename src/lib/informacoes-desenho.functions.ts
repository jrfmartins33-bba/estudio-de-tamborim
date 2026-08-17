import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type QuadroTecnico = { escola: string; carnaval: string; enredo: string; carnavalesco: string; bateria: string; mestres: string; instrumento: string; andamentoGravacao: string; andamentoBateria: string; contextoRitmico: string; };
export type BlocoNarrativo = { titulo: string; texto: string };
export type InformacoesDesenho = { quadro: QuadroTecnico; blocos: BlocoNarrativo[] };

export const informacoesPadrao: InformacoesDesenho = {
  quadro: { escola: "Beija-Flor de Nilópolis", carnaval: "2026", enredo: "Bembé", carnavalesco: "João Vitor Araújo", bateria: "Soberana", mestres: "Rodney e Plínio", instrumento: "Tamborim", andamentoGravacao: "~126 BPM", andamentoBateria: "A confirmar", contextoRitmico: "Samba-enredo da Bateria Soberana; referências ao universo do xirê foram incorporadas à concepção da bateria em 2026. Conteúdo em validação." },
  blocos: [
    { titulo: "O enredo", texto: "O desfile de 2026 homenageia o Bembé do Mercado, celebração de matriz africana realizada em Santo Amaro, no Recôncavo Baiano, ligada à ancestralidade, resistência e ocupação do espaço público pela população negra." },
    { titulo: "A bateria", texto: "A Bateria Soberana dialoga com o enredo e incorporou referências sonoras ao universo do xirê na concepção musical de 2026." },
    { titulo: "O tamborim", texto: "O desenho do tamborim é formado por frases rítmicas executadas pelo naipe. Essas frases podem acompanhar a melodia, preencher espaços ou criar uma camada própria sobre o samba." },
    { titulo: "O desenho da Beija-Flor 2026", texto: "O material de estudo parte da execução real do professor e será validado musicalmente trecho a trecho. Não inventar classificação técnica além do que for confirmado durante essa validação." },
    { titulo: "Nosso método de estudo", texto: "Os trechos são pedagógicos e não precisam ser blocos cronológicos rígidos. Eles podem se sobrepor para carregar a preparação necessária para a entrada do desenho seguinte." },
  ],
};

const esquemaConteudo = z.object({ quadro: z.object({ escola: z.string().max(200), carnaval: z.string().max(200), enredo: z.string().max(200), carnavalesco: z.string().max(200), bateria: z.string().max(200), mestres: z.string().max(200), instrumento: z.string().max(200), andamentoGravacao: z.string().max(200), andamentoBateria: z.string().max(200), contextoRitmico: z.string().max(2000) }), blocos: z.array(z.object({ titulo: z.string().max(200), texto: z.string().max(4000) })).max(20) });
const entradaLeitura = z.object({ execucaoId: z.string().min(1).max(120) });
const entradaGravacao = z.object({ execucaoId: z.string().min(1).max(120), conteudo: esquemaConteudo });

export const obterInformacoesDesenho = createServerFn({ method: "GET" }).inputValidator((data: unknown) => entradaLeitura.parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: linha, error } = await supabaseAdmin.from("execucao_informacao").select("conteudo").eq("execucao_id", data.execucaoId).maybeSingle();
  if (error) { console.error("[informacoes] falha ao obter", error); return { informacoes: informacoesPadrao }; }
  const analisado = esquemaConteudo.safeParse(linha?.conteudo);
  return { informacoes: analisado.success ? analisado.data : informacoesPadrao };
});

export const salvarInformacoesDesenho = createServerFn({ method: "POST" }).inputValidator((data: unknown) => entradaGravacao.parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("execucao_informacao").upsert({ execucao_id: data.execucaoId, conteudo: data.conteudo, updated_at: new Date().toISOString() }, { onConflict: "execucao_id" });
  if (error) { console.error("[informacoes] falha ao salvar", error); return { ok: false as const, erro: "Não foi possível salvar as informações." }; }
  return { ok: true as const };
});
