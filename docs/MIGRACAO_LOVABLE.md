# Migração do Lovable

Origem: projeto Lovable `d6dfb112-3b94-4c21-a685-8b112839b18d`.
Último commit observado antes da migração: `2ad0218aec71ba4dec90a33732cebf88e54055b4`.

## Decisões
- Lovable deixa de ser dependência de desenvolvimento e deploy.
- Supabase atual é preservado; não há migração de banco para outro projeto neste momento.
- Build passa a usar TanStack Start + Vite + Nitro diretamente, pronto para Vercel.
- A pré-transcrição musical continua preservada, mas não é exibida na experiência pública até revisão posterior.
- A tela `/escolas` é preservada por rastreabilidade, mas seu desenho visual não é considerado aprovado.

## Segurança
- `.env` não deve ser commitado.
- `SUPABASE_SERVICE_ROLE_KEY` é segredo de servidor e deve ser configurado no ambiente de deploy.
- Nenhuma variável `VITE_*` deve conter segredos.
