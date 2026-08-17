import type { Samba } from "./types";

/**
 * Somente dados confirmados do material de referência.
 * videoUrl permanece null até o arquivo real do professor ser conectado.
 */
export const beijaFlor2026: Samba = {
  id: "beija-flor-2026-tamborim",
  escola: "Beija-Flor",
  ano: 2026,
  instrumento: { id: "tamborim", nome: "Tamborim" },
  execucao: {
    id: "execucao-professor",
    videoUrl: null,
    orientacao: "vertical",
    duracaoSegundos: 342, // ~5min42s
    bpmGravacao: 126,
    bpmBateria: null, // andamento de bateria/desfile: a confirmar
    executadoPor: "Professor",
    trechos: [],
  },
};
