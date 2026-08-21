export type EscolaStatus = "disponivel" | "em_preparacao";

export interface EscolaCatalogo {
  id: string;
  nome: string;
  slug: string;
  cores: string[];
  status: EscolaStatus;
  rota: string | null;
}

/**
 * Configuração central das escolas do Estúdio de Tamborim.
 * Todas as escolas aparecem com o mesmo peso visual; a diferença é apenas status/rota.
 * Cores listadas como nomes CSS genéricos, não como valores oficiais.
 */
export const escolasCatalogo: EscolaCatalogo[] = [
  { id: "academicos-de-niteroi", nome: "Acadêmicos de Niterói", slug: "academicos-de-niteroi", cores: ["azul", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "beija-flor", nome: "Beija-Flor", slug: "beija-flor", cores: ["azul", "branco"], status: "disponivel" as const, rota: "/escolas/beija-flor/2026" as const },
  { id: "estacio-de-sa", nome: "Estácio de Sá", slug: "estacio-de-sa", cores: ["vermelho", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "grande-rio", nome: "Grande Rio", slug: "grande-rio", cores: ["vermelho", "verde", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "imperio-serrano", nome: "Império Serrano", slug: "imperio-serrano", cores: ["verde", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "imperatriz-leopoldinense", nome: "Imperatriz Leopoldinense", slug: "imperatriz-leopoldinense", cores: ["verde", "branco", "ouro"], status: "em_preparacao" as const, rota: null },
  { id: "mangueira", nome: "Mangueira", slug: "mangueira", cores: ["verde", "rosa"], status: "em_preparacao" as const, rota: null },
  { id: "mocidade-independente", nome: "Mocidade Independente", slug: "mocidade-independente", cores: ["verde", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "paraiso-do-tuiuti", nome: "Paraíso do Tuiuti", slug: "paraiso-do-tuiuti", cores: ["azul", "amarelo"], status: "em_preparacao" as const, rota: null },
  { id: "portela", nome: "Portela", slug: "portela", cores: ["azul", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "salgueiro", nome: "Salgueiro", slug: "salgueiro", cores: ["vermelho", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "uniao-da-ilha-do-governador", nome: "União da Ilha do Governador", slug: "uniao-da-ilha-do-governador", cores: ["azul", "vermelho", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "unidos-da-tijuca", nome: "Unidos da Tijuca", slug: "unidos-da-tijuca", cores: ["azul", "amarelo"], status: "em_preparacao" as const, rota: null },
  { id: "vila-isabel", nome: "Vila Isabel", slug: "vila-isabel", cores: ["azul", "branco"], status: "em_preparacao" as const, rota: null },
  { id: "viradouro", nome: "Viradouro", slug: "viradouro", cores: ["vermelho", "branco"], status: "em_preparacao" as const, rota: null },
].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
