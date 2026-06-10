'use client'
import { MOVIES, thumbnail, youtubeUrl, type Movie } from '@/lib/movies'
import { X, Play } from 'lucide-react'
import { useState } from 'react'

interface MoviePickerProps {
  onSelect: (url: string) => void
  onClose: () => void
}

export default function MoviePicker({ onSelect, onClose }: MoviePickerProps) {
  const [active, setActive] = useState<Movie | null>(null)

  function choose(movie: Movie) {
    onSelect(youtubeUrl(movie.id))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 shrink-0">
        <h2 className="font-bold text-lg">Escolha um filme</h2>
        <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 active:text-white">
          <X size={22} />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {MOVIES.map(movie => (
            <button
              key={movie.id}
              onClick={() => setActive(movie)}
              className="text-left group active:scale-[0.97] transition-transform"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail(movie.id)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-1.5 left-2 right-2 text-xs font-semibold leading-tight line-clamp-2">
                  {movie.title}
                </span>
              </div>
              <div className="mt-1 px-0.5">
                <p className="text-[11px] text-zinc-500">{movie.year} · {movie.genre}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-zinc-600 text-[11px] text-center mt-6 px-6 leading-relaxed">
          Clássicos de domínio público — livres pra assistir. 💛
        </p>
      </div>

      {/* Detalhe do filme selecionado */}
      {active && (
        <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur flex items-end sm:items-center justify-center p-4" onClick={() => setActive(null)}>
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnail(active.id)} alt={active.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{active.title}</h3>
              <p className="text-xs text-zinc-500 mb-2">{active.year} · {active.genre} · {active.duration}</p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{active.synopsis}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => choose(active)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 active:bg-rose-500 rounded-xl font-semibold"
                >
                  <Play size={18} fill="currentColor" />
                  Assistir juntos
                </button>
                <button
                  onClick={() => setActive(null)}
                  className="px-4 py-3 bg-zinc-800 active:bg-zinc-700 rounded-xl text-sm"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
