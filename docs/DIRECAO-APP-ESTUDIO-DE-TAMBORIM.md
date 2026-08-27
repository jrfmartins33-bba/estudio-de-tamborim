# Direção do App — Estúdio de Tamborim

**Documento-base do produto**  
**Projeto pessoal para a Ala de Tamborim do Bloco Unidos da Cachorra — Fortaleza**  
**Status:** direção inicial consolidada; documento vivo

> Criado de ritmista para ritmista.

## 1. Resumo

O Estúdio de Tamborim será um espaço digital de estudo, memória e pertencimento para ritmistas. A experiência deve ser prazerosa, vibrante, acolhedora e culturalmente respeitosa — nunca parecer um formulário administrativo ou um sistema escolar.

O app nasce dentro da Ala de Tamborim do Bloco Unidos da Cachorra, em Fortaleza. Seu primeiro compromisso é servir aos ritmistas da ala e ao pré-carnaval de Fortaleza, especialmente ao trecho entre a Avenida Beira-Mar e a Praia de Iracema.

O app também apresenta escolas de samba e seus desenhos de tamborim. A Sapucaí aparece como sonho, referência e inspiração, mas não como medida de sucesso ou condição de pertencimento.

## 2. Frases norteadoras

### Frase principal

> Criado de ritmista para ritmista.

### Frases do projeto

> Sapucaí pode ser sonho. Fortaleza é a nossa avenida.

> Cada ritmista tem sua avenida. A nossa começa em Fortaleza.

> Da quadra para a rua.

### Manifesto

Este espaço foi criado de ritmista para ritmista.

Nasceu dentro da Ala de Tamborim do Bloco Unidos da Cachorra, em Fortaleza, para ouvir, repetir, guardar e compartilhar os desenhos que fazem parte da nossa caminhada.

Cada ritmista tem sua avenida. A nossa começa em Fortaleza.

A Sapucaí pode ser sonho, referência e inspiração. Mas é na quadra, na rua, na Beira-Mar e na Praia de Iracema que a nossa batida ganha corpo, encontro e memória.

Aqui, cada pavilhão tem seu lugar. Cada ritmista tem seu tempo. E cada toque ajuda a construir a nossa avenida.

## 3. Origem e significado

O projeto é uma contribuição pessoal de um ritmista da Ala de Tamborim do Unidos da Cachorra para sua própria ala.

Seu criador conhece a experiência de tocar tamborim em diferentes contextos, incluindo a Portela, a Tabajara do Samba e a Sapucaí. Essa vivência deve orientar a autenticidade do produto, sem transformar o app em uma apresentação pessoal ou em uma posição de autoridade.

A comunicação deve sempre partir da experiência compartilhada:

- de ritmista para ritmista;
- da ala para a ala;
- do ensaio para a rua;
- da memória para o próximo toque.

## 4. Conceito central: Avenida dos Pavilhões

A página inicial será uma avenida simbólica, com pavilhões de diferentes escolas distribuídos ao longo do caminho.

Ao fundo, haverá uma representação visual autoral da Sapucaí e do Arco da Apoteose. O Arco será um horizonte de inspiração e celebração coletiva, nunca um pódio, uma linha de chegada ou um nível obrigatório.

Os pavilhões serão os protagonistas:

- todos terão presença visual equivalente;
- todos terão o mesmo cuidado de animação;
- nenhum será diminuído por classificação de grupo;
- a ordem geral será neutra, preferencialmente alfabética;
- a preferência pessoal poderá criar destaque apenas na área individual do ritmista.

A Avenida dos Pavilhões não deve ser um mapa geográfico literal. É uma interpretação visual que reúne quadra, rua, pavilhões, Fortaleza, sonhos e referências.

## 5. Fortaleza como casa

Dentro da Avenida dos Pavilhões haverá uma entrada especial para a realidade local:

### Nossa Ala

Espaço da Ala de Tamborim do Bloco Unidos da Cachorra, com:

- desenhos usados pela ala;
- vídeos de ensaio;
- trechos prioritários para o pré-carnaval;
- mensagens e materiais autorizados;
- memórias de carnavais anteriores;
- avatares dos ritmistas que escolherem participar;
- referências da própria ala.

### Nosso Pré-Carnaval

Área dedicada ao momento mais importante para os ritmistas do bloco:

- modo esquenta;
- repertório da ala;
- trechos preparados para a rua;
- revisão rápida antes da saída;
- informações do ensaio;
- registros do percurso entre a Beira-Mar e a Praia de Iracema;
- fotos, vídeos e depoimentos autorizados;
- memória coletiva após o desfile.

O pré-carnaval de Fortaleza não deve ser apresentado como etapa menor ou preparação para algo mais importante. Para essa ala, ele é uma experiência central e um ápice coletivo.

## 6. Sapucaí como sonho e referência

Uma área futura chamada **Sonhos e Referências** poderá reunir:

- histórias de escolas;
- desenhos de diferentes carnavais;
- relatos de ritmistas;
- vídeos autorizados;
- referências de alas e baterias;
- experiências de quem já tocou em grandes avenidas.

A proposta é inspirar sem criar comparação social. Nem todo ritmista terá condição de tocar na Sapucaí, e isso não reduz seu pertencimento, sua experiência ou seu valor.

## 7. Experiência principal

### Entrada

> Escolha um pavilhão e venha tocar.

### Navegação pública

- **Avenida** — pavilhões e escolas.
- **Tocar** — desenhos e player.
- **Nossa Ala** — Unidos da Cachorra e conteúdos coletivos.
- **Meu Tamborim** — avatar, preferências, favoritos e memórias.

### Rotas sugeridas

- `/` — Avenida dos Pavilhões;
- `/escolas/:escola` — página da escola;
- `/escolas/:escola/:ano` — temporada da escola;
- `/escolas/:escola/:ano/:desenho` — estudo do desenho;
- `/nossa-ala` — conteúdo da ala;
- `/meu-tamborim` — área pessoal;
- `/editor` — área editorial autenticada e separada.

## 8. Página de cada escola

Cada escola deve possuir uma página própria, mesmo quando ainda não houver desenhos publicados.

Elementos:

- pavilhão em destaque;
- nome da escola;
- ano ou temporada;
- desenhos disponíveis;
- conteúdo em preparação, quando necessário;
- fontes e créditos;
- botão para entrar no desenho;
- identidade cromática validada.

“Conteúdo em preparação” deve ser um estado acolhedor, não um cartão morto ou uma mensagem de erro.

Os grupos e classificações podem existir no modelo de dados para manter a informação correta por temporada, mas não devem criar hierarquia visual na Avenida.

## 9. Movimento dos pavilhões

O movimento deve parecer tecido real sendo apresentado:

- ondulação lenta;
- haste como origem do movimento;
- variações sutis de fase entre os pavilhões;
- pequena resposta ao toque, foco ou hover;
- transição de cor ao entrar na escola;
- pausa fora da área visível;
- alternativa estática para `prefers-reduced-motion`.

Os pavilhões e símbolos devem ser oficiais ou autorizados. Não utilizar pavilhões inventados por IA, cores aproximadas tratadas como oficiais ou imagens copiadas sem licença.

## 10. Experiência de estudo

O player atual deve ser preservado e evoluído em modos simples:

- **Tocar:** vídeo e controles principais;
- **Esquenta:** trecho preparado para uma revisão rápida;
- **Trechos:** loops guardados e retomada;
- **Na Avenida:** interface limpa para execução contínua;
- **Conhecer:** contexto, fontes e informações validadas.

Recursos desejados:

- play grande;
- velocidade de 50% a 100%;
- preservação de tom;
- saltos configuráveis;
- loop A–B;
- contador opcional de repetições;
- forma de onda;
- leitura do desenho sincronizada ao vídeo;
- gravação local opcional para comparação;
- compartilhamento por link ou QR Code;
- PWA e download offline apenas de conteúdo autorizado.

Informações musicais não confirmadas devem permanecer identificadas como hipótese ou “a validar”. A **acentuação** deve ser tratada com precisão e nunca inventada.

## 11. Meu Tamborim

“Meu Estudo” será evitado por transmitir obrigação. O espaço pessoal será **Meu Tamborim**.

O perfil deve ganhar forma naturalmente, sem formulário longo.

Possibilidades:

- nome ou apelido;
- avatar ilustrado;
- tamborim virtual personalizado;
- pavilhão ou pavilhões preferidos;
- desenhos favoritos;
- trechos guardados;
- última posição, velocidade e loop;
- notas privadas;
- tema visual;
- preferências de acessibilidade;
- memórias do pré-carnaval.

O cadastro pode ser feito em pequenas escolhas visuais, todas puláveis e com prévia imediata. Não pedir nível, meta ou desempenho como condição de entrada.

## 12. Avatar e identidade dos ritmistas

Opções:

- foto enviada pelo próprio ritmista;
- iniciais;
- avatar ilustrado inclusivo;
- avatar abstrato com aro, pele, baqueta e padrões;
- tamborim virtual com cores e adesivos pessoais.

Cuidados:

- perfil privado por padrão;
- nome, foto e preferências públicas somente com consentimento;
- pavilhão preferido não significa vínculo oficial;
- nenhuma pessoa deve receber selo de integrante oficial sem validação;
- gravações e notas devem ser privadas por padrão;
- não criar ranking, comparação ou exposição de presença.

## 13. Nossa Ala

Área coletiva opcional para os ritmistas do bloco:

- avatares em uma roda;
- apelidos;
- frases curtas;
- desenhos favoritos, se compartilhados;
- ensaios preparados;
- mensagens para a ala;
- registros do pré-carnaval;
- imagem anual da ala, com autorização de todos.

Não haverá ranking, pontuação, última vez online ou comparação pública de desempenho.

## 14. Direção visual

### Atmosfera

- noite quente de ensaio;
- concreto, luz de rua e tecido;
- mar e horizonte de Fortaleza;
- Sapucaí como referência distante;
- cores vibrantes com controle de contraste;
- textura de tamborim, aro e pavilhão;
- tipografia expressiva nos títulos;
- texto simples e legível.

### Evitar

- excesso de neon;
- confetes e efeitos aleatórios;
- estética caricatural do samba;
- aparência de painel administrativo;
- hierarquia entre escolas;
- excesso de cards brancos repetidos;
- ranking ou linguagem de competição.

## 15. Segurança e separação editorial

A área pública e a área editorial precisam ser separadas.

O ritmista deve poder estudar, favoritar, anotar e guardar seu progresso. Apenas usuários autenticados e autorizados podem editar vídeos, informações, desenhos ou conteúdos compartilhados.

As funções de edição devem ter autorização no servidor, não apenas botões escondidos na interface.

Papéis previstos:

- visitante;
- ritmista;
- professor ou curador;
- administrador.

## 16. Fases de execução

### Fase 0 — Proteção e validação

- proteger mutações editoriais;
- separar área pública e editor;
- validar fontes, pavilhões, cores, vídeos e permissões;
- corrigir acessibilidade crítica;
- confirmar linguagem com ritmistas da ala.

### Fase 1 — Avenida dos Pavilhões

- transformar `/` na home principal;
- criar cenário autoral da Avenida;
- incluir pavilhões com animação leve;
- criar páginas individuais das escolas;
- manter grade/lista acessível.

### Fase 2 — Nossa Ala e pré-carnaval

- criar Nossa Ala;
- criar Nosso Pré-Carnaval;
- organizar desenhos da ala;
- criar modo esquenta;
- preparar memória de ensaios e desfiles.

### Fase 3 — Meu Tamborim

- avatar;
- tamborim personalizado;
- favoritos;
- retomada;
- caderno;
- preferências;
- privacidade.

### Fase 4 — Estúdio avançado

- leitura sincronizada;
- mapa do desenho;
- forma de onda;
- compartilhamento por QR Code;
- gravação comparativa opcional;
- PWA e offline autorizado.

### Fase 5 — Comunidade

- Nossa Ala interativa;
- ensaio preparado por professor;
- memórias coletivas;
- conteúdo moderado;
- participação opcional dos ritmistas.

## 17. Critérios de sucesso

O app estará no caminho certo quando:

- um ritmista abrir e entender imediatamente onde está;
- a primeira sensação for de acolhimento e curiosidade;
- qualquer pessoa conseguir começar sem preencher cadastro longo;
- os pavilhões forem reconhecíveis e tratados com respeito;
- o ritmista quiser voltar por prazer, não por culpa;
- a Ala de Tamborim do Unidos da Cachorra se reconhecer na experiência;
- o pré-carnaval de Fortaleza estiver presente como realização central;
- a Sapucaí aparecer como sonho sem excluir quem não tem acesso a ela;
- informações musicais estiverem claramente validadas ou marcadas como hipótese;
- a área editorial estiver protegida e invisível ao fluxo público.

## 18. Próximo passo recomendado

Antes de construir todo o sistema, criar e testar três telas de referência:

1. Avenida dos Pavilhões;
2. Nossa Ala / Nosso Pré-Carnaval;
3. Meu Tamborim.

Essas telas devem ser apresentadas a alguns ritmistas e à Diretora da Ala para validar linguagem, memória, cores, pavilhão, avatar e sensação geral.

O princípio de decisão será simples:

> Se uma solução parece bonita, mas não parece nossa, ela precisa ser revista.

