# Estúdio de Tamborim

Aplicação responsiva para estudo de desenhos de tamborim de samba-enredo.

## Stack
- React 19 + TanStack Start/Router
- TypeScript + Vite + Tailwind CSS
- Supabase (PostgreSQL + Storage)
- Vercel via Nitro

## Desenvolvimento
```bash
npm install
npm run dev
```

## Validação
```bash
npm run typecheck
npm run build
```

## Variáveis de ambiente
Copie `.env.example` para `.env` e configure `SUPABASE_SERVICE_ROLE_KEY` apenas no ambiente do servidor. Nunca exponha essa chave em variáveis `VITE_*`.

## Supabase preservado
Projeto atual: `amhgoymqyfvgeiablejc`. A migração mantém o banco e o bucket `referencias` existentes; não cria um Supabase novo.

## Estado de produto
- player do vídeo real do professor;
- velocidades 50%–100% com preservação de tom quando suportado;
- navegação ±5 s;
- loop A–B;
- trechos persistidos;
- informações do desenho;
- pré-transcrição musical preservada no banco/código, porém oculta da interface até nova validação musical/visual.

O catálogo `/escolas` foi preservado como código legado da última versão, mas seu desenho visual **não está aprovado**.
