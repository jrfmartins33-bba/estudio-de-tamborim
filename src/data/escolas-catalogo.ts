export type StatusCarnaval = "disponivel" | "em_preparacao" | "em_breve";

export interface CarnavalEscola {
  ano: number;
  enredo: string;
  instrumento: string;
  status: StatusCarnaval;
}

export interface Escola {
  id: string;
  nome: string;
  slug: string;
  cores: string[];
  pavilhaoAsset?: string | null;
  carnavais: CarnavalEscola[];
}

/** Compatibilidade com código anterior */
export type EscolaCatalogo = Escola;
export type EscolaStatus = StatusCarnaval;

/**
 * Retorna o status consolidado da escola com base em seus carnavais cadastrados.
 */
export function obterStatusEscola(escola: Escola): StatusCarnaval {
  if (escola.carnavais.some((c) => c.status === "disponivel")) {
    return "disponivel";
  }
  if (escola.carnavais.some((c) => c.status === "em_preparacao")) {
    return "em_preparacao";
  }
  return "em_breve";
}

/**
 * Retorna a rota para a página da escola.
 */
export function obterRotaEscola(slug: string): string {
  return `/escolas/${slug}`;
}

/**
 * Gera dinamicamente a rota de estudo a partir do slug da escola e do ano do carnaval.
 */
export function obterRotaCarnaval(slug: string, ano: number): string {
  return `/escolas/${slug}/${ano}`;
}

/**
 * Busca uma escola por slug.
 */
export function obterEscolaPorSlug(slug: string): Escola | undefined {
  return escolasCatalogo.find((e) => e.slug === slug);
}

/**
 * Busca o carnaval de um determinado ano dentro da escola.
 */
export function obterCarnavalPorAno(
  escola: Escola,
  ano: number,
): CarnavalEscola | undefined {
  return escola.carnavais.find((c) => c.ano === ano);
}

/**
 * Configuração central das escolas do Estúdio de Tamborim.
 * Todas as escolas aparecem com o mesmo peso visual na avenida.
 * Único conteúdo de estudo confirmado atualmente: Beija-Flor 2026 (Bembé / Tamborim).
 */
const listaEscolas: Escola[] = [
  {
    id: "academicos-de-niteroi",
    nome: "Acadêmicos de Niterói",
    slug: "academicos-de-niteroi",
    cores: ["azul", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "beija-flor",
    nome: "Beija-Flor",
    slug: "beija-flor",
    cores: ["azul", "branco"],
    pavilhaoAsset: null,
    carnavais: [
      {
        ano: 2026,
        enredo: "Bembé",
        instrumento: "Tamborim",
        status: "disponivel" as StatusCarnaval,
      },
    ],
  },
  {
    id: "estacio-de-sa",
    nome: "Estácio de Sá",
    slug: "estacio-de-sa",
    cores: ["vermelho", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "grande-rio",
    nome: "Grande Rio",
    slug: "grande-rio",
    cores: ["vermelho", "verde", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "imperio-serrano",
    nome: "Império Serrano",
    slug: "imperio-serrano",
    cores: ["verde", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "imperatriz-leopoldinense",
    nome: "Imperatriz Leopoldinense",
    slug: "imperatriz-leopoldinense",
    cores: ["verde", "branco", "ouro"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "mangueira",
    nome: "Mangueira",
    slug: "mangueira",
    cores: ["verde", "rosa"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "mocidade-independente",
    nome: "Mocidade Independente",
    slug: "mocidade-independente",
    cores: ["verde", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "paraiso-do-tuiuti",
    nome: "Paraíso do Tuiuti",
    slug: "paraiso-do-tuiuti",
    cores: ["azul", "amarelo"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "portela",
    nome: "Portela",
    slug: "portela",
    cores: ["azul", "branco"],
    pavilhaoAsset: "/images/pavilhoes/portela-pavilhao.png",
    carnavais: [],
  },
  {
    id: "salgueiro",
    nome: "Salgueiro",
    slug: "salgueiro",
    cores: ["vermelho", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "uniao-da-ilha-do-governador",
    nome: "União da Ilha do Governador",
    slug: "uniao-da-ilha-do-governador",
    cores: ["azul", "vermelho", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "unidos-da-tijuca",
    nome: "Unidos da Tijuca",
    slug: "unidos-da-tijuca",
    cores: ["azul", "amarelo"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "vila-isabel",
    nome: "Vila Isabel",
    slug: "vila-isabel",
    cores: ["azul", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
  {
    id: "viradouro",
    nome: "Viradouro",
    slug: "viradouro",
    cores: ["vermelho", "branco"],
    pavilhaoAsset: null,
    carnavais: [],
  },
];

export const escolasCatalogo: Escola[] = listaEscolas.sort((a, b) =>
  a.nome.localeCompare(b.nome, "pt-BR"),
);
