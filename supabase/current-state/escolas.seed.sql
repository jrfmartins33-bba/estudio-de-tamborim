INSERT INTO public.escola_samba (id,nome,slug) VALUES
('academicos-de-niteroi','Acadêmicos de Niterói','academicos-de-niteroi'),
('beija-flor','Beija-Flor','beija-flor'),
('estacio-de-sa','Estácio de Sá','estacio-de-sa'),
('grande-rio','Grande Rio','grande-rio'),
('imperatriz-leopoldinense','Imperatriz Leopoldinense','imperatriz-leopoldinense'),
('imperio-serrano','Império Serrano','imperio-serrano'),
('mangueira','Mangueira','mangueira'),
('mocidade-independente','Mocidade Independente','mocidade-independente'),
('paraiso-do-tuiuti','Paraíso do Tuiuti','paraiso-do-tuiuti'),
('portela','Portela','portela'),
('salgueiro','Salgueiro','salgueiro'),
('uniao-da-ilha-do-governador','União da Ilha do Governador','uniao-da-ilha-do-governador'),
('unidos-da-tijuca','Unidos da Tijuca','unidos-da-tijuca'),
('vila-isabel','Vila Isabel','vila-isabel'),
('viradouro','Viradouro','viradouro')
ON CONFLICT (id) DO UPDATE SET nome=EXCLUDED.nome, slug=EXCLUDED.slug;

INSERT INTO public.escola_participacao_carnaval (escola_id,ano,grupo) VALUES
('academicos-de-niteroi',2026,'grupo_especial'),
('beija-flor',2026,'grupo_especial'),
('grande-rio',2026,'grupo_especial'),
('imperatriz-leopoldinense',2026,'grupo_especial'),
('mangueira',2026,'grupo_especial'),
('mocidade-independente',2026,'grupo_especial'),
('paraiso-do-tuiuti',2026,'grupo_especial'),
('portela',2026,'grupo_especial'),
('salgueiro',2026,'grupo_especial'),
('unidos-da-tijuca',2026,'grupo_especial'),
('vila-isabel',2026,'grupo_especial'),
('viradouro',2026,'grupo_especial'),
('estacio-de-sa',2026,'serie_ouro'),
('imperio-serrano',2026,'serie_ouro'),
('uniao-da-ilha-do-governador',2026,'serie_ouro')
ON CONFLICT (escola_id,ano) DO UPDATE SET grupo=EXCLUDED.grupo;
