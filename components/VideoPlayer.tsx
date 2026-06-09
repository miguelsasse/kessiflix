'use client'
import { useEffect, useRef, useState } from 'react'
import { extractYouTubeId } from '@/lib/youtube'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
    _ytApiLoaded: boolean
    _ytReadyCallbacks: Array<() => void>
  }
}

// Load YouTube API once globally — no matter how many VideoPlayer instances
function loadYouTubeAPI(onReady: () => void) {
  if (typeof window === 'undefined') return
  if (window.YT?.Player) { onReady(); return }

  window._ytReadyCallbacks = window._ytReadyCallbacks ?? []
  window._ytReadyCallbacks.push(onReady)

  if (!window._ytApiLoaded) {
    window._ytApiLoaded = true
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => {
      ;(window._ytReadyCallbacks ?? []).forEach(cb => cb())
      window._ytReadyCallbacks = []
    }
  }
}

const isIOS = () =>
  typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)

interface Props {
  videoUrl: string
  playing: boolean
  seekTime: number
  onPlay: (time: number) => void
  onPause: (time: number) => void
}

export default function VideoPlayer({ videoUrl, playing, seekTime, onPlay, onPause }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const isReady = useRef(false)
  const isSyncing = useRef(false)

  // Stable callback refs — no re-creations needed
  const onPlayRef = useRef(onPlay)
  const onPauseRef = useRef(onPause)
  useEffect(() => { onPlayRef.current = onPlay }, [onPlay])
  useEffect(() => { onPauseRef.current = onPause }, [onPause])

  // Track actual player state to avoid double-applying local changes
  const playerPlaying = useRef(false)
  const playerTime = useRef(0)

  // iOS "tap to sync" state
  const [iosPrompt, setIosPrompt] = useState<number | null>(null)

  const videoId = extractYouTubeId(videoUrl)

  // Create/recreate player ONLY when videoId changes
  useEffect(() => {
    if (!videoId) return
    isReady.current = false
    playerPlaying.current = false
    playerTime.current = 0

    function createPlayer() {
      if (!containerRef.current) return
      playerRef.current?.destroy?.()
      playerRef.current = null

      const div = document.createElement('div')
      div.id = 'yt-' + Date.now()
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(div)

      playerRef.current = new window.YT.Player(div.id, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 1,       // Native controls — needed for iOS interaction
          modestbranding: 1,
          rel: 0,
          playsinline: 1,    // Prevent fullscreen auto on iOS
          fs: 1,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            isReady.current = true
          },
          onStateChange: (e: any) => {
            if (!isReady.current) return
            const t: number = playerRef.current?.getCurrentTime?.() ?? 0

            if (e.data === window.YT.PlayerState.PLAYING) {
              playerPlaying.current = true
              playerTime.current = t
              // Only emit if this was a USER action (not our own sync applying)
              if (!isSyncing.current) {
                setIosPrompt(null)
                onPlayRef.current(t)
              }
            }

            if (e.data === window.YT.PlayerState.PAUSED) {
              playerPlaying.current = false
              playerTime.current = t
              if (!isSyncing.current) {
                onPauseRef.current(t)
              }
            }
          },
        },
      })
    }

    loadYouTubeAPI(createPlayer)

    return () => {
      // Cleanup happens on next videoId change or unmount
    }
  }, [videoId])

  // Apply remote sync — only when props change AND player state actually differs
  useEffect(() => {
    if (!isReady.current || !playerRef.current) return

    const seekDiff = Math.abs(playerTime.current - seekTime)
    const needsSeek = seekDiff > 2
    const needsPlayChange = playing !== playerPlaying.current

    if (!needsSeek && !needsPlayChange) return

    isSyncing.current = true

    if (needsSeek) {
      playerRef.current.seekTo?.(seekTime, true)
      playerTime.current = seekTime
    }

    if (playing) {
      if (isIOS()) {
        // iOS blocks programmatic play without user gesture — show tap overlay
        setIosPrompt(seekTime)
      } else {
        playerRef.current.playVideo?.()
        playerPlaying.current = true
      }
    } else {
      setIosPrompt(null)
      playerRef.current.pauseVideo?.()
      playerPlaying.current = false
    }

    setTimeout(() => { isSyncing.current = false }, 800)
  }, [playing, seekTime])

  function handleIosTap() {
    if (iosPrompt === null || !playerRef.current) return
    isSyncing.current = true
    playerRef.current.seekTo?.(iosPrompt, true)
    playerRef.current.playVideo?.()
    playerPlaying.current = true
    setIosPrompt(null)
    setTimeout(() => { isSyncing.current = false }, 800)
  }

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm px-4 text-center">
        URL inválida — cole um link do YouTube
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full" />

      {/* iOS tap-to-sync overlay */}
      {iosPrompt !== null && (
        <button
          onClick={handleIosTap}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-20 gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl ml-1">▶</span>
          </div>
          <p className="text-white text-sm font-medium">parceiro deu play — toque para continuar</p>
        </button>
      )}
    </div>
  )
}
