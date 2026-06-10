'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link2, Heart, Popcorn } from 'lucide-react'

function generateRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function Home() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')

  function createRoom() {
    router.push(`/room/${generateRoomId()}`)
  }

  function joinRoom() {
    const code = joinCode.trim().toUpperCase()
    if (code.length < 4) return
    router.push(`/room/${code}`)
  }

  return (
    <main className="glow-cinema h-dvh min-h-dvh text-white flex flex-col items-center justify-center px-6 pt-safe pb-safe relative overflow-hidden">

      {/* brilho de cinema que respira ao fundo */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-rose-700/20 blur-[90px] animate-glow" />

      {/* dedicatória sutil no topo */}
      <p className="animate-rise font-serif-soft text-amber-200/70 text-sm tracking-[0.3em] uppercase mb-6">
        um cinema particular
      </p>

      {/* logo — padrão Netflix */}
      <div className="animate-rise flex flex-col items-center mb-4" style={{ animationDelay: '0.1s' }}>
        <h1 className="logo-netflix text-7xl">KEssiFLIX</h1>
      </div>

      {/* assinatura pra ela */}
      <p className="animate-rise font-serif-soft text-lg text-zinc-300 mb-1 flex items-center gap-2" style={{ animationDelay: '0.2s' }}>
        feito pra <span className="text-gilt font-medium">Ms Kesselin</span>
        <span className="animate-heartbeat">🖤</span>
      </p>

      <p className="animate-rise text-zinc-500 text-center mb-9 text-sm max-w-[16rem] leading-relaxed" style={{ animationDelay: '0.28s' }}>
        escolhe o filme — o melhor lugar do sofá já é seu.
      </p>

      {/* ações */}
      <div className="animate-rise w-full max-w-sm flex flex-col gap-3" style={{ animationDelay: '0.36s' }}>
        <button
          onClick={createRoom}
          className="group w-full py-4 bg-gradient-to-r from-rose-700 to-rose-600 active:from-rose-600 active:to-rose-500 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-rose-900/40"
        >
          <Popcorn size={20} />
          Abrir a sessão
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-zinc-500 text-xs font-serif-soft tracking-wide">ou entre com o convite</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="flex gap-2">
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && joinRoom()}
            placeholder="código"
            maxLength={8}
            autoCapitalize="characters"
            autoCorrect="off"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500/60 uppercase tracking-[0.25em] font-mono text-center"
          />
          <button
            onClick={joinRoom}
            className="px-5 py-4 bg-white/5 border border-white/10 active:bg-white/10 rounded-2xl"
          >
            <Link2 size={20} />
          </button>
        </div>
      </div>

      {/* rodapé íntimo */}
      <p className="animate-rise mt-10 text-zinc-600 text-xs text-center max-w-[15rem] flex items-center justify-center gap-1.5 font-serif-soft text-[13px]" style={{ animationDelay: '0.5s' }}>
        <Heart size={11} className="text-rose-800" fill="currentColor" />
        só nós dois aqui. mais ninguém entra.
      </p>
    </main>
  )
}
