// Catálogo — tudo de DOMÍNIO PÚBLICO ou conteúdo livre no YouTube, validado como
// reproduzível dentro do app (oembed HTTP 200). Dois catálogos:
//   MOVIES   -> filmes clássicos por categoria
//   KESSILIN -> "Ms Kessilin": história/curiosidades BR (perfil da Deise)
//
// Para adicionar: confirme que toca embutido em
//   https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json
// (precisa retornar 200) e inclua aqui. A capa é gerada automaticamente.

export interface Media {
  id: string          // YouTube video ID
  title: string
  meta: string        // linha de info: "1963 · Romance" ou "Eduardo Bueno · História"
  synopsis: string
  category: string
}

/* ------------------------------- FILMES -------------------------------- */

export const MOVIE_CATEGORIES = [
  'Suspense & Mistério',
  'Romance',
  'Comédia',
  'Terror',
  'Ficção Científica',
  'Faroeste',
  'Animação',
] as const

export const MOVIES: Media[] = [
  // Suspense & Mistério
  {
    id: 'ydCqPEoQ-jI',
    title: 'E Não Sobrou Nenhum',
    meta: '1945 · Mistério · Agatha Christie',
    synopsis: 'Dez estranhos são atraídos a uma ilha isolada e, um a um, começam a ser mortos seguindo uma macabra cantiga infantil. O mistério mais famoso de Agatha Christie.',
    category: 'Suspense & Mistério',
  },
  {
    id: 'Q-iglYhLl-8',
    title: 'O Estranho',
    meta: '1946 · Noir · Orson Welles',
    synopsis: 'Um investigador caça um criminoso de guerra escondido numa cidadezinha pacata — casado com uma jovem que não faz ideia de quem ele é. Com Orson Welles e Edward G. Robinson.',
    category: 'Suspense & Mistério',
  },
  {
    id: 'X5Q5hBTSuH0',
    title: 'O Carona da Morte',
    meta: '1953 · Thriller · Ida Lupino',
    synopsis: 'Dois amigos numa pescaria pegam um carona — um psicopata que os mantém reféns numa viagem de pesadelo pelo deserto. Tensão pura, do início ao fim.',
    category: 'Suspense & Mistério',
  },
  {
    id: 'tQ9HYSeKzyg',
    title: 'A Dama Oculta',
    meta: '1938 · Mistério · Hitchcock',
    synopsis: 'Uma senhora simpática desaparece de um trem em movimento — e todos os passageiros juram que ela nunca existiu. Hitchcock no auge do suspense.',
    category: 'Suspense & Mistério',
  },
  {
    id: 'Gpn49rUuOGU',
    title: 'O Gabinete do Dr. Caligari',
    meta: '1920 · Psicológico · Mudo',
    synopsis: 'Um hipnotizador usa um sonâmbulo para cometer assassinatos. O marco do horror psicológico, com um dos maiores plot twists da história do cinema (legendado).',
    category: 'Suspense & Mistério',
  },
  {
    id: 'vksXfkk0C7M',
    title: 'Demência 13',
    meta: '1963 · Thriller · Coppola',
    synopsis: 'Uma família amaldiçoada, segredos afogados num lago e um assassino de machado à solta. O primeiro suspense de Francis Ford Coppola, antes de O Poderoso Chefão.',
    category: 'Suspense & Mistério',
  },
  {
    id: 'kJwvDAlDQRs',
    title: 'A Morte num Beijo (D.O.A.)',
    meta: '1950 · Noir',
    synopsis: 'Um homem descobre que foi envenenado e tem poucas horas de vida — então corre contra o tempo pra descobrir quem o matou, e por quê. Premissa de tirar o fôlego.',
    category: 'Suspense & Mistério',
  },
  {
    id: 'jfVtoPN3BVk',
    title: 'Os 39 Degraus',
    meta: '1935 · Suspense · Hitchcock',
    synopsis: 'Um homem comum é arrastado a uma rede de espionagem e foge pela Escócia algemado a uma desconhecida. Clássico de Alfred Hitchcock (legendado).',
    category: 'Suspense & Mistério',
  },
  {
    id: 'QqBPGnSXF8Q',
    title: 'Desvio (Detour)',
    meta: '1945 · Noir',
    synopsis: 'Um pianista pega carona rumo a Hollywood e se afunda numa espiral de azar e chantagem. O noir mais sombrio e claustrofóbico já feito (legendado).',
    category: 'Suspense & Mistério',
  },

  // Romance
  {
    id: 'gxfOSIJXN-M',
    title: 'Charada',
    meta: '1963 · Romance · Suspense',
    synopsis: 'Uma viúva descobre que o marido escondia uma fortuna — e vários homens a perseguem por ela. Cary Grant e Audrey Hepburn no auge.',
    category: 'Romance',
  },

  // Comédia
  {
    id: 'Ca3_mkpXKgs',
    title: 'Jejum de Amor',
    meta: '1940 · Comédia romântica',
    synopsis: 'Um editor tenta reconquistar a ex-esposa, sua melhor repórter, na véspera do casamento dela com outro. Diálogos afiadíssimos.',
    category: 'Romance',
  },
  {
    id: 'uxfslt0hIX8',
    title: 'Meu Homem Godofredo',
    meta: '1936 · Comédia',
    synopsis: 'Uma socialite mimada contrata um morador de rua como mordomo — e ele vira a alma da família. Comédia maluca clássica.',
    category: 'Comédia',
  },
  {
    id: 'lrsvUK19X_U',
    title: 'A General',
    meta: '1926 · Comédia · Mudo',
    synopsis: 'Buster Keaton persegue sua locomotiva roubada na Guerra Civil. Uma das maiores comédias mudas de todos os tempos.',
    category: 'Comédia',
  },
  {
    id: '_0YjuUoele0',
    title: 'A Pequena Loja dos Horrores',
    meta: '1960 · Comédia · Terror',
    synopsis: 'Um florista atrapalhado cria uma planta carnívora que fala e exige sangue. Comédia cult com Jack Nicholson no início de carreira.',
    category: 'Comédia',
  },

  // Terror
  {
    id: 'JOXDqxwCdOg',
    title: 'Nosferatu',
    meta: '1922 · Terror · Mudo',
    synopsis: 'O conde Orlok espalha terror e peste ao se mudar para uma cidadezinha. O vampiro original do cinema, sombrio e hipnótico.',
    category: 'Terror',
  },
  {
    id: 'IUw-r5WBM2o',
    title: 'A Noite dos Mortos-Vivos',
    meta: '1968 · Terror',
    synopsis: 'Estranhos se refugiam numa casa cercada por mortos que voltaram à vida. O filme que inventou o zumbi moderno.',
    category: 'Terror',
  },
  {
    id: 'nkTM4VHpUz8',
    title: 'A Casa da Colina Assombrada',
    meta: '1959 · Terror',
    synopsis: 'Um milionário oferece dinheiro a quem passar a noite numa mansão mal-assombrada. Vincent Price em pleno charme macabro.',
    category: 'Terror',
  },
  {
    id: 'tfK6K9uETus',
    title: 'A Carruagem dos Condenados',
    meta: '1962 · Terror psicológico',
    synopsis: 'Após sobreviver a um acidente, uma mulher é assombrada por visões e por um parque de diversões abandonado. Terror atmosférico cult.',
    category: 'Terror',
  },
  {
    id: 'zGMhU16k2PE',
    title: 'A Última Esperança da Terra',
    meta: '1964 · Terror · Ficção',
    synopsis: 'O último homem vivo enfrenta noites cercado por mortos infectados. Vincent Price na origem que inspirou "Eu Sou a Lenda".',
    category: 'Terror',
  },

  // Ficção Científica
  {
    id: 'uRNEmlsBWRY',
    title: 'Metrópolis',
    meta: '1927 · Ficção · Mudo',
    synopsis: 'Numa cidade futurista dividida entre ricos e operários, um romance acende a revolução. O épico expressionista de Fritz Lang.',
    category: 'Ficção Científica',
  },
  {
    id: '4z6VLR2GA1w',
    title: 'Plano 9 do Espaço Sideral',
    meta: '1959 · Ficção · Cult',
    synopsis: 'Alienígenas ressuscitam mortos para salvar a humanidade dela mesma. Famoso como "o pior filme já feito" — e por isso divertidíssimo.',
    category: 'Ficção Científica',
  },

  // Faroeste
  {
    id: 'WJVQ9FOLC9E',
    title: 'O Anjo e o Malvado',
    meta: '1947 · Faroeste · John Wayne',
    synopsis: 'Um pistoleiro ferido é acolhido por uma família quaker e se apaixona — colocando em xeque sua vida de violência. John Wayne (4K).',
    category: 'Faroeste',
  },

  // Animação
  {
    id: 'CYmoZu8qM-Y',
    title: 'As Viagens de Gulliver',
    meta: '1939 · Animação · Aventura',
    synopsis: 'Gulliver naufraga na terra minúscula de Lilliput e tenta impedir uma guerra. Clássico animado dos estúdios Fleischer.',
    category: 'Animação',
  },
  {
    id: 'Zlt3amBOm7E',
    title: 'Clássicos Fleischer: Super-Homem, Popeye & Betty Boop',
    meta: 'Animação · Coletânea',
    synopsis: 'Coletânea restaurada dos curtas lendários dos estúdios Fleischer — Super-Homem, Popeye, Betty Boop e Koko, o palhaço.',
    category: 'Animação',
  },
  {
    id: 'IMsAbVzkbao',
    title: 'Betty Boop — Coletânea Vol. 1',
    meta: 'Anos 1930 · Animação',
    synopsis: 'Os clássicos curtas da Betty Boop dos anos 1930, hoje em domínio público. Charme e jazz do início dos desenhos animados.',
    category: 'Animação',
  },
  {
    id: 'YhBnzBb_foE',
    title: 'Betty Boop — Coletânea Vol. 3',
    meta: 'Anos 1930 · Animação',
    synopsis: 'Mais uma leva dos desenhos clássicos da Betty Boop. Diversão vintage em preto e branco.',
    category: 'Animação',
  },
]

/* ----------------------------- MS KESSILIN ----------------------------- */
// Curadoria pro gosto da Deise: história real, curiosidades, sem sensacionalismo.

export const KESSILIN_CATEGORIES = [
  'História do Brasil',
  'Favelas & Cidades',
  'Como é Feito',
] as const

export const KESSILIN: Media[] = [
  // História do Brasil
  {
    id: 'WjYnTg65f5Y',
    title: 'Como o Brasil entrou no mapa?',
    meta: 'Eduardo Bueno · História',
    synopsis: 'Eduardo Bueno conta como o Brasil foi parar nos mapas e na história mundial — sem decoreba, do jeito que aconteceu.',
    category: 'História do Brasil',
  },
  {
    id: 'Mvjz-TZ_lDc',
    title: 'Quem inventou o Brasil?',
    meta: 'Eduardo Bueno · História',
    synopsis: 'Uma viagem pela formação do país e dos personagens que o moldaram, contada com bom humor por Eduardo Bueno.',
    category: 'História do Brasil',
  },
  {
    id: 'qizt_mGT4OU',
    title: 'O Brasil perdeu a cabeça',
    meta: 'Eduardo Bueno · História',
    synopsis: 'Episódios curiosos e pouco contados da história do Brasil, narrados de forma leve e direta.',
    category: 'História do Brasil',
  },
  {
    id: 'GiLXTd_kNYM',
    title: 'O cinema conta a história do Brasil',
    meta: 'Eduardo Bueno · Cultura',
    synopsis: 'Como o cinema retratou (e às vezes inventou) a história brasileira ao longo das décadas.',
    category: 'História do Brasil',
  },
  {
    id: 'ZCehBMkfCZw',
    title: 'História do Brasil: o Império',
    meta: 'Boris Fausto · Documentário',
    synopsis: 'O período imperial brasileiro (1822–1889) explicado pelo historiador Boris Fausto. Sério, claro e sem sensacionalismo.',
    category: 'História do Brasil',
  },
  {
    id: 'zpNr6KKH8d8',
    title: 'Colonização — Histórias do Brasil',
    meta: 'Documentário · História',
    synopsis: 'Como a colonização moldou o território, a população e a cultura brasileira. Conteúdo educativo e tranquilo.',
    category: 'História do Brasil',
  },
  {
    id: 'p6IxQbme1pI',
    title: 'Brasil Colônia: a história resumida',
    meta: 'Educativo · História',
    synopsis: 'Um resumo organizado do período colonial brasileiro — ótimo pra entender o todo sem se perder.',
    category: 'História do Brasil',
  },
  {
    id: 'RNRU2vFlP5U',
    title: 'Documentário: Brasil Colônia (1500–1808)',
    meta: 'Documentário · História',
    synopsis: 'Três séculos de Brasil colonial num documentário direto: economia, sociedade e o cotidiano da época.',
    category: 'História do Brasil',
  },
  {
    id: 'IIReUDezw-E',
    title: 'A Colonização do Brasil',
    meta: 'Educativo · História',
    synopsis: 'Os primeiros passos da ocupação portuguesa e como o país começou a tomar forma.',
    category: 'História do Brasil',
  },
  {
    id: 'ZUt_OO_C4Eo',
    title: 'O Brasil antes de 1500',
    meta: 'História · Curiosidade',
    synopsis: 'A história que quase não se conta: quem vivia aqui antes da chegada dos portugueses, e como.',
    category: 'História do Brasil',
  },

  // Favelas & Cidades
  {
    id: '9fx9p-tvD0s',
    title: 'A história da primeira favela do Brasil',
    meta: 'Eduardo Bueno · História',
    synopsis: 'A origem do nome "favela" e a história do Morro da Providência, a primeira do país — contada por Eduardo Bueno.',
    category: 'Favelas & Cidades',
  },
  {
    id: 'WWXk6Wnfzm8',
    title: 'A origem das favelas no Rio de Janeiro',
    meta: 'Documentário',
    synopsis: 'Um documentário sobre como surgiram e cresceram as favelas cariocas, sem sensacionalismo.',
    category: 'Favelas & Cidades',
  },
  {
    id: 'wxk0I9OWfNI',
    title: 'Morro da Providência: como tudo começou',
    meta: 'História · Curiosidade',
    synopsis: 'A ligação entre a Guerra de Canudos e o nascimento da primeira favela do Rio. História real e fascinante.',
    category: 'Favelas & Cidades',
  },
  {
    id: 'XG24MRDkZMM',
    title: 'A história das favelas no Rio de Janeiro',
    meta: 'Documentário · História',
    synopsis: 'Do cortiço "Cabeça de Porco" às comunidades atuais — a transformação urbana do Rio ao longo do tempo.',
    category: 'Favelas & Cidades',
  },
  {
    id: 'jIHvmyQ00ak',
    title: 'Como surgiu a primeira favela do país',
    meta: 'Reportagem · História',
    synopsis: 'Reportagem que mostra como os soldados de Canudos foram parar no Morro da Providência. Direto ao ponto.',
    category: 'Favelas & Cidades',
  },
  {
    id: 'sxwTqGzCUyc',
    title: 'O que é favela? (animação)',
    meta: 'Animação · Educativo',
    synopsis: 'Uma animação curtinha que explica o contexto histórico e cultural das favelas brasileiras.',
    category: 'Favelas & Cidades',
  },
  {
    id: 'bDtpVcCict0',
    title: 'Geração Favela (documentário completo)',
    meta: 'Documentário',
    synopsis: 'Um olhar atual e humano sobre as comunidades brasileiras, longe do estereótipo.',
    category: 'Favelas & Cidades',
  },

  // Como é Feito
  {
    id: 'IHtzPfNRXhQ',
    title: 'Como é feito um lápis',
    meta: 'Manual do Mundo · Técnico',
    synopsis: 'O processo completo de fabricação do lápis — daquele jeito curioso e bem explicado do Manual do Mundo.',
    category: 'Como é Feito',
  },
  {
    id: '7n9jjSLZmDU',
    title: 'Como é feito o leite em pó',
    meta: 'Manual do Mundo · Técnico',
    synopsis: 'Da fazenda à embalagem: como o leite vira pó. Curiosidade técnica leve e interessante.',
    category: 'Como é Feito',
  },
  {
    id: 'FBGDuYQccRY',
    title: 'Como são fabricados os espelhos',
    meta: 'Manual do Mundo · Técnico',
    synopsis: 'O processo por trás de um objeto do dia a dia que quase ninguém para pra pensar.',
    category: 'Como é Feito',
  },
  {
    id: 'jCL2dLh5MME',
    title: 'Como é feito um ímã',
    meta: 'Manual do Mundo · Técnico',
    synopsis: 'A ciência e a indústria por trás dos ímãs, explicadas de forma simples e visual.',
    category: 'Como é Feito',
  },
]

export function thumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

export function youtubeUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}
