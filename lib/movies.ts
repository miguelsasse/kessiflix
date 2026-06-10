// Catálogo de filmes — todos de DOMÍNIO PÚBLICO, disponíveis legalmente no
// YouTube e validados como reproduzíveis dentro do app (oembed HTTP 200).
//
// Para adicionar um filme: confirme que toca embutido testando
//   https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json
// (precisa retornar 200) e adicione aqui. A capa é gerada automaticamente.

export interface Movie {
  id: string            // YouTube video ID
  title: string
  year: number
  genre: string
  duration: string
  synopsis: string
}

export const MOVIES: Movie[] = [
  {
    id: 'gxfOSIJXN-M',
    title: 'Charada',
    year: 1963,
    genre: 'Romance · Suspense',
    duration: '1h53',
    synopsis: 'Uma viúva descobre que o falecido marido escondia uma fortuna — e vários homens a perseguem por ela. Com Cary Grant e Audrey Hepburn.',
  },
  {
    id: 'Ca3_mkpXKgs',
    title: 'Jejum de Amor',
    year: 1940,
    genre: 'Comédia romântica',
    duration: '1h32',
    synopsis: 'Um editor de jornal tenta reconquistar a ex-esposa, sua melhor repórter, às vésperas do casamento dela com outro. Diálogos afiadíssimos.',
  },
  {
    id: 'lrsvUK19X_U',
    title: 'A General',
    year: 1926,
    genre: 'Comédia · Aventura',
    duration: '1h18',
    synopsis: 'Buster Keaton persegue sua locomotiva roubada em plena Guerra Civil. Uma das maiores comédias mudas de todos os tempos.',
  },
  {
    id: 'uRNEmlsBWRY',
    title: 'Metrópolis',
    year: 1927,
    genre: 'Ficção científica',
    duration: '2h33',
    synopsis: 'Numa cidade futurista dividida entre ricos e operários, um romance acende a revolução. O clássico expressionista de Fritz Lang.',
  },
  {
    id: 'JOXDqxwCdOg',
    title: 'Nosferatu',
    year: 1922,
    genre: 'Terror',
    duration: '1h34',
    synopsis: 'O conde Orlok espalha terror e peste ao se mudar para uma cidadezinha. O vampiro original do cinema, sombrio e hipnótico.',
  },
  {
    id: 'IUw-r5WBM2o',
    title: 'A Noite dos Mortos-Vivos',
    year: 1968,
    genre: 'Terror',
    duration: '1h36',
    synopsis: 'Sete estranhos se refugiam numa casa cercada por mortos que voltaram à vida. O filme que inventou o zumbi moderno.',
  },
  {
    id: '4z6VLR2GA1w',
    title: 'Plano 9 do Espaço Sideral',
    year: 1959,
    genre: 'Ficção · Cult',
    duration: '1h19',
    synopsis: 'Alienígenas ressuscitam mortos para impedir a humanidade de se destruir. Famoso como "o pior filme já feito" — e justamente por isso, divertidíssimo.',
  },
]

export function thumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

export function youtubeUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}
