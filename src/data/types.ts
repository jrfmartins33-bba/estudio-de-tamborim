/**
 * Modelo de domínio do estudo de desenhos.
 * Mantido simples e extensível: nenhum dado musical é inventado aqui.
 */

export type Instrumento = {
  id: string;
  nome: string;
};

/**
 * Evento rítmico do desenho. Será preenchido somente após a marcação
 * feita a partir do vídeo do professor.
 *
 * Campos intencionalmente neutros e extensíveis: não inventamos taxonomia
 * musical (tipo de ataque, acentuação etc.) antes de validar o método.
 */
export type ConfiancaEventoMusical = "alta" | "provavel" | "incerta";
export type StatusValidacaoMusical = "pre_transcricao" | "validado_professor";
export type StatusBembe = "nao_identificado" | "possivel" | "validado";

export type EventoRitmico = {
  id: string;
  /** instante em segundos dentro da execução de referência */
  instanteTemporalSegundos: number;
  /** tipo de ataque — livre enquanto a taxonomia não for definida */
  tipoAtaque: string | null;
  /** acentuação do evento (nunca chamar de "acento") */
  acentuacao: string | null;
  /** posição absoluta na grade de subdivisões do trecho */
  indiceGrade?: number;
  celula?: number;
  /** posição dentro da célula (0..7) */
  posicaoNaCelula?: number;
  instanteGradeSegundos?: number;
  instanteDetectadoSegundos?: number | null;
  desvioMilissegundos?: number | null;
  confianca?: ConfiancaEventoMusical;
  scoreDeteccao?: number | null;
  statusValidacao?: StatusValidacaoMusical;
};

/** Pré-transcrição rítmica de um trecho — sempre sujeita à validação do professor. */
export type AnaliseMusicalTrecho = {
  versao: number;
  bpmBase: number;
  compassoHipotese: string;
  compassoValidado: boolean;
  subdivisao: string;
  subdivisoesPorCelula: number;
  /** quantas subdivisões cabem em UM pulso (semicolcheia = 4) — base do cálculo temporal */
  subdivisoesPorPulso: number;
  rotulosGrade: string[];
  inicioGradeSegundos: number;
  quantidadeSubdivisoes: number;
  statusValidacao: StatusValidacaoMusical;
  /** status da acentuação (nunca chamar de "acento") */
  acentuacaoStatus: "a_validar_professor" | "validada";
  bembe: { status: StatusBembe; observacao: string | null };
  observacao: string | null;
  eventos: EventoRitmico[];
};

export type Trecho = {
  id: string;
  nome: string;
  inicio: number;
  fim: number;
  eventos: EventoRitmico[];
  analiseMusical?: AnaliseMusicalTrecho | null;
};

export type ExecucaoDeReferencia = {
  id: string;
  /** fonte configurável do vídeo; null enquanto não conectada */
  videoUrl: string | null;
  /** vertical = vídeo de celular do professor */
  orientacao: "vertical" | "horizontal";
  duracaoSegundos: number;
  bpmGravacao: number | null;
  /** andamento de bateria/desfile — a confirmar */
  bpmBateria: number | null;
  executadoPor: string;
  trechos: Trecho[];
};

export type Samba = {
  id: string;
  escola: string;
  ano: number;
  instrumento: Instrumento;
  execucao: ExecucaoDeReferencia;
};
