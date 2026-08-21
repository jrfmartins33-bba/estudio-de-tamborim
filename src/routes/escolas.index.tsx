import { createFileRoute } from "@tanstack/react-router";
import { CatalogoEscolas } from "@/components/escolas/CatalogoEscolas";

export const Route = createFileRoute("/escolas/")({
  head: () => ({
    meta: [
      { title: "Estúdio de Tamborim — Escolas" },
      {
        name: "description",
        content:
          "Selecione uma escola de samba para conhecer seus desenhos no Estúdio de Tamborim.",
      },
      { property: "og:title", content: "Estúdio de Tamborim — Escolas" },
      {
        property: "og:description",
        content:
          "Selecione uma escola de samba para conhecer seus desenhos no Estúdio de Tamborim.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CatalogoEscolas,
});
