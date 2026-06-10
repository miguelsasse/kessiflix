'use client'
import { use, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'
import { useWebRTC } from '@/hooks/useWebRTC'
import VideoPlayer from '@/components/VideoPlayer'
import CallBubble from '@/components/CallBubble'
import Reactions from '@/components/Reactions'
import MoviePicker from '@/components/MoviePicker'
import { Copy, Check, Film, Loader2, UserX, Link2, Clapperboard } from 'lucide-react'

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params)
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [inputUrl, setInputUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [showLinkField, setShowLinkField] = useState(false)
  const [showMovies, setShowMovies] = useState(false)
  const [localReactions, setLocalReactions] = useState<string[]>([])

  const {
    roomState, partnerSocketId, videoUrl, videoState,
    isInitiator, reactions, sendVideoUrl, syncVideo, sendReaction
  } = useRoom(roomId)

  const {
    localVideoRef, remoteVideoRef, callActive, audioMuted, videoMuted, callError,
    startCall, toggleAudio, toggleVideo, endCall
  } = useWebRTC({ roomId, partnerSocketId, isInitiator })

  const allReactions = [...reactions, ...localReactions]

  // Auto-start call when partner joins (initiator side)
  useEffect(() => {
    if (roomState === 'ready' && partnerSocketId && isInitiator && !callActive) {
      startCall()
    }
  }, [roomState, partnerSocketId, isInitiator, callActive, startCall])

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleSetVideo() {
    const url = inputUrl.trim()
    if (!url) return
    sendVideoUrl(url)
    setInputUrl('')
    setShowUrlInput(false)
    setShowLinkField(false)
  }

  function handlePickMovie(url: string) {
    sendVideoUrl(url)
    setShowMovies(false)
    setShowUrlInput(false)
  }

  function handleReaction(emoji: string) {
    sendReaction(emoji)
    setLocalReactions(r => [...r, emoji])
    setTimeout(() => setLocalReactions(r => r.slice(1)), 2500)
  }

  // Stable callbacks for VideoPlayer (useCallback avoids inline arrow fn recreation)
  const handlePlay = useCallback((t: number) => syncVideo('play', t), [syncVideo])
  const handlePause = useCallback((t: number) => syncVideo('pause', t), [syncVideo])

  if (roomState === 'full') {
    return (
      <main className="h-dvh min-h-dvh bg-zinc-950 text-white flex flex-col items-center justify-center gap-4 px-6 pt-safe pb-safe">
        <UserX size={48} className="text-rose-500" />
        <h2 className="text-xl font-bold">Sala cheia</h2>
        <p className="text-zinc-400 text-sm text-center">Esta sala já tem 2 pessoas.</p>
        <button onClick={() => router.push('/')} className="mt-2 px-6 py-3 bg-rose-600 rounded-2xl text-sm font-medium">
          Criar minha sala
        </button>
      </main>
    )
  }

  return (
    <main className="h-dvh min-h-dvh bg-zinc-950 text-white flex flex-col pt-safe">

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-rose-500" />
          <span className="font-black text-sm tracking-tight">Kessi<span className="text-rose-500">FLIX</span></span>
          <span className="text-zinc-600 text-xs font-mono">{roomId}</span>
        </div>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 text-xs text-zinc-400 active:text-white py-1.5 px-2 rounded-lg"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Compartilhar'}
        </button>
      </header>

      {/* Waiting state */}
      {(roomState === 'waiting' || roomState === 'connecting') ? (
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-5 px-6 py-6 pb-safe">
          <Loader2 size={40} className="text-rose-500 animate-spin shrink-0" />
          <div className="text-center">
            <p className="text-zinc-200 font-semibold text-lg">Aguardando parceiro(a)...</p>
            <p className="text-zinc-500 text-sm mt-1">Manda o link da sala pra ela/ele entrar</p>
          </div>

          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-6 py-3.5 bg-rose-600 active:bg-rose-500 rounded-2xl text-sm font-semibold w-full max-w-xs justify-center shrink-0"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Link copiado!' : 'Copiar link da sala'}
          </button>

          <p className="text-zinc-700 text-xs font-mono">código: {roomId}</p>

          {/* Escolher o filme já enquanto espera */}
          <div className="w-full max-w-xs flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">enquanto isso</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {videoUrl ? (
            <div className="w-full max-w-xs flex flex-col items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
              <Check size={20} className="text-green-400" />
              <p className="text-sm text-zinc-300 text-center">Conteúdo escolhido! Começa assim que ela/ele entrar.</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setShowMovies(true)} className="text-xs text-rose-400 active:text-rose-300 px-2 py-1">
                  Trocar filme
                </button>
                <button onClick={() => setShowLinkField(v => !v)} className="text-xs text-zinc-400 active:text-white px-2 py-1">
                  Outro link
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xs flex flex-col gap-2.5">
              <button
                onClick={() => setShowMovies(true)}
                className="flex items-center justify-center gap-2 py-3.5 bg-zinc-900 border border-zinc-800 active:bg-zinc-800 rounded-2xl font-medium text-zinc-200"
              >
                <Clapperboard size={18} className="text-rose-500" />
                Escolher filme
              </button>
              {!showLinkField ? (
                <button
                  onClick={() => setShowLinkField(true)}
                  className="flex items-center justify-center gap-2 py-3.5 bg-zinc-900 border border-zinc-800 active:bg-zinc-800 rounded-2xl font-medium text-zinc-400 text-sm"
                >
                  <Link2 size={16} />
                  Colar link do YouTube
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSetVideo()}
                    placeholder="youtube.com/watch?v=..."
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoFocus
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-600"
                  />
                  <button onClick={handleSetVideo} className="px-4 py-3.5 bg-rose-600 active:bg-rose-500 rounded-2xl font-medium">▶</button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Watch room */
        <div className="flex-1 flex flex-col min-h-0">

          {/* Video area */}
          <div className="flex-1 relative bg-black min-h-0">
            {videoUrl ? (
              <VideoPlayer
                videoUrl={videoUrl}
                playing={videoState.playing}
                seekTime={videoState.time}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            ) : (
              /* No video yet — escolher filme OU colar link */
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-6 text-zinc-400">
                <div className="text-center">
                  <Film size={52} className="opacity-20 mx-auto mb-3" />
                  <p className="text-base font-medium text-zinc-300">O que vamos assistir?</p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-sm">
                  {/* Escolher filme do catálogo */}
                  <button
                    onClick={() => setShowMovies(true)}
                    className="flex items-center justify-center gap-2 py-4 bg-rose-600 active:bg-rose-500 rounded-2xl font-semibold text-white"
                  >
                    <Clapperboard size={20} />
                    Escolher filme
                  </button>

                  {/* Colar link do YouTube */}
                  {!showLinkField ? (
                    <button
                      onClick={() => setShowLinkField(true)}
                      className="flex items-center justify-center gap-2 py-4 bg-zinc-900 border border-zinc-800 active:bg-zinc-800 rounded-2xl font-medium text-zinc-300"
                    >
                      <Link2 size={18} />
                      Colar link do YouTube
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={inputUrl}
                        onChange={e => setInputUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSetVideo()}
                        placeholder="youtube.com/watch?v=..."
                        autoCapitalize="none"
                        autoCorrect="off"
                        autoFocus
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-600"
                      />
                      <button
                        onClick={handleSetVideo}
                        className="px-5 py-4 bg-rose-600 active:bg-rose-500 rounded-2xl font-medium"
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botões flutuantes pra trocar de filme (quando algo está tocando) */}
            {videoUrl && (
              <>
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <button
                    onClick={() => setShowMovies(true)}
                    className="p-2 bg-black/50 rounded-full backdrop-blur"
                    aria-label="Escolher filme"
                  >
                    <Clapperboard size={16} className="text-white/70" />
                  </button>
                  <button
                    onClick={() => setShowUrlInput(v => !v)}
                    className="p-2 bg-black/50 rounded-full backdrop-blur"
                    aria-label="Colar link"
                  >
                    <Link2 size={16} className="text-white/70" />
                  </button>
                </div>

                {showUrlInput && (
                  <div className="absolute top-12 right-3 left-3 z-10 flex gap-2">
                    <input
                      value={inputUrl}
                      onChange={e => setInputUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSetVideo()}
                      placeholder="Novo link do YouTube..."
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoFocus
                      className="flex-1 bg-zinc-900/95 border border-zinc-700 rounded-xl px-3 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-600"
                    />
                    <button
                      onClick={handleSetVideo}
                      className="px-3 py-3 bg-rose-600 active:bg-rose-500 rounded-xl font-medium text-sm"
                    >
                      Trocar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Reaction bar */}
          <Reactions active={allReactions} onSend={handleReaction} />
        </div>
      )}

      {/* Call bubble (always visible when ready) */}
      {roomState === 'ready' && (
        <CallBubble
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          callActive={callActive}
          audioMuted={audioMuted}
          videoMuted={videoMuted}
          callError={callError}
          onStart={startCall}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onEnd={endCall}
        />
      )}

      {/* Catálogo de filmes */}
      {showMovies && (
        <MoviePicker onSelect={handlePickMovie} onClose={() => setShowMovies(false)} />
      )}
    </main>
  )
}
