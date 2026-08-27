import type { CSSProperties } from "react";
import { Flag } from "lucide-react";
import type { Escola } from "@/data/escolas-catalogo";

export const coresProvisorias: Record<string, string> = {
  azul: "#1d5f9f",
  vermelho: "#c53636",
  verde: "#238653",
  amarelo: "#f0c945",
  rosa: "#e8669a",
  ouro: "#c9972f",
  branco: "#f8f5eb",
};

export function PavilhaoProvisorio({
  escola,
  indice,
}: {
  escola: Escola;
  indice: number;
}) {
  const asset = escola.pavilhaoAsset ?? (escola.id === "portela" ? "/images/pavilhoes/portela-pavilhao.png" : null);

  if (asset) {
    return (
      <div
        className="pavilhao-real-portela"
        style={{ animationDelay: `${-(indice % 6) * 0.7}s` }}
        aria-hidden="true"
      >
        <img
          src={asset}
          alt=""
          className="portela-tecido size-full object-contain"
        />
        <img
          src={asset}
          alt=""
          className="portela-mastro size-full object-contain"
        />
      </div>
    );
  }

  const cores = escola.cores.map(
    (cor) => coresProvisorias[cor] ?? "#d7c8a8",
  );
  const passo = 100 / Math.max(cores.length, 1);
  const gradiente = `linear-gradient(115deg, ${cores
    .map(
      (cor, index) =>
        `${cor} ${index * passo}%, ${cor} ${(index + 1) * passo}%`,
    )
    .join(", ")})`;
  const estilo = {
    background: gradiente,
    animationDelay: `${-(indice % 6) * 0.7}s`,
  } satisfies CSSProperties;

  return (
    <div className="pavilhao-provisorio" aria-hidden="true">
      <span className="pavilhao-haste" />
      <span className="pavilhao-tecido" style={estilo}>
        <Flag className="size-6 text-[#14233b]/56 sm:size-7" />
      </span>
    </div>
  );
}

export function FiltroTecidoPortela() {
  return (
    <svg
      className="filtro-tecido-portela"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id="ondulacao-portela"
          x="-18%"
          y="-18%"
          width="136%"
          height="136%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.028"
            numOctaves="2"
            seed="7"
            result="ruido-tecido"
          >
            <animate
              attributeName="baseFrequency"
              dur="5.2s"
              values="0.008 0.028; 0.013 0.038; 0.008 0.028"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="ruido-tecido"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
          >
            <animate
              attributeName="scale"
              dur="4.4s"
              values="4; 10; 6; 4"
              repeatCount="indefinite"
            />
          </feDisplacementMap>
        </filter>
      </defs>
    </svg>
  );
}
