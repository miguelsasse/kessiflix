'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Film, Link2, Heart } from 'lucide-react'

function generateRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function Home() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')

  function createRoom() {
    const id = generateRoomId()
    router.push(`/room/${id}`)
  }

  function joinRoom() {
    const code = joinCode.trim().toUpperCase()
    if (code.length < 4) return
    router.push(`/room/${code}`)
  }

  return (
    <main className="h-dvh min-h-dvh bg-zinc-950 text-white flex flex-col items-center justify-center px-6 pt-safe pb-safe">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg">
          <Film size={24} />
        </div>
        <h1 className="text-5xl font-black tracking-tight">
          Kessi<span className="text-rose-500">FLIX</span>
        </h1>
      </div>

      <p className="text-zinc-400 text-center mb-10 text-sm max-w-xs leading-relaxed">
        Assista filmes juntos — mesmo estando longe. ❤️
      </p>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={createRoom}
          className="w-full py-4 bg-rose-600 active:bg-rose-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
        >
          <Heart size={20} />
          Criar sala
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-500 text-xs">ou entre com código</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="flex gap-2">
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && joinRoom()}
            placeholder="ABC123"
            maxLength={8}
            autoCapitalize="characters"
            autoCorrect="off"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-600 uppercase tracking-widest font-mono text-center"
          />
          <button
            onClick={joinRoom}
            className="px-5 py-4 bg-zinc-800 active:bg-zinc-700 rounded-2xl"
          >
            <Link2 size={20} />
          </button>
        </div>
      </div>

      <p className="mt-10 text-zinc-700 text-xs text-center max-w-xs">
        Cada sala comporta exatamente 2 pessoas. Ninguém mais entra.
      </p>
    </main>
  )
}
