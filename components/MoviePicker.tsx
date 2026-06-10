'use client'
import { useState } from 'react'
import {
  MOVIES, MOVIE_CATEGORIES, KESSILIN, KESSILIN_CATEGORIES,
  thumbnail, youtubeUrl, type Media,
} from '@/lib/movies'
import { X, Play, Clapperboard, Sparkles } from 'lucide-react'

interface MoviePickerProps {
  onSelect: (url: string) => void
  onClose: () => void
}

type Tab = 'movies' | 'kessilin'

export default function MoviePicker({ onSelect, onClose }: MoviePickerProps) {
  const [tab, setTab] = useState<Tab>('movies')
  const [active, setActive] = useState<Media | null>(null)

  const catalog = tab === 'movies' ? MOVIES : KESSILIN
  const categories = tab === 'movies' ? MOVIE_CATEGORIES : KESSILIN_CATEGORIES

  function choose(m: Media) {
    onSelect(youtubeUrl(m.id))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col pt-safe pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 shrink-0">
        <h2 className="font-bold text-lg">O que vamos assistir?</h2>
        <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 active:text-white">
          <X size={22} />
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-2 px-4 py-3 shrink-0 border-b border-zinc-900">
        <button
          onClick={() => setTab('movies')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${
            tab === 'movies' ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          <Clapperboard size={15} /> Filmes
        </button>
        <button
          onClick={() => setTab('kessilin')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${
            tab === 'kessilin' ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          <Sparkles size={15} /> Ms Kessilin
        </button>
      </div>

      {/* Conteúdo por categoria */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'kessilin' && (
          <p className="text-zinc-500 text-xs mb-4 leading-relaxed">
            Seleção pra Deise 💛 — história real, curiosidades e conteúdo sem sensacionalismo.
          </p>
        )}

        {categories.map(cat => {
          const items = catalog.filter(m => m.category === cat)
          if (items.length === 0) return null
          return (
            <section key={cat} className="mb-6">
              <h3 className="text-sm font-bold text-zinc-300 mb-2.5">{cat}</h3>
              <div className="grid grid-cols-2 gap-3">
                {items.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setActive(m)}
                    className="text-left active:scale-[0.97] transition-transform"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbnail(m.id)} alt={m.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-1.5 left-2 right-2 text-xs font-semibold leading-tight line-clamp-2">
                        {m.title}
                      </span>
                    </div>
                    <p className="mt-1 px-0.5 text-[11px] text-zinc-500 line-clamp-1">{m.meta}</p>
                  </button>
                ))}
              </div>
            </section>
          )
        })}

        <p className="text-zinc-600 text-[11px] text-center mt-2 mb-2 px-6 leading-relaxed">
          Conteúdo livre / domínio público — legenda automática em português ativada quando disponível. 💛
        </p>
      </div>

      {/* Detalhe */}
      {active && (
        <div className="absolute inset-0 z-10 bg-black/85 backdrop-blur flex items-end sm:items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnail(active.id)} alt={active.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg leading-tight">{active.title}</h3>
              <p className="text-xs text-zinc-500 mb-2">{active.meta}</p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{active.synopsis}</p>
              <div className="flex gap-2">
                <button onClick={() => choose(active)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 active:bg-rose-500 rounded-xl font-semibold">
                  <Play size={18} fill="currentColor" />
                  Assistir juntos
                </button>
                <button onClick={() => setActive(null)} className="px-4 py-3 bg-zinc-800 active:bg-zinc-700 rounded-xl text-sm">
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
