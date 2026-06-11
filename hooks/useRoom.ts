'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getSocket } from '@/lib/socket'
import { Socket } from 'socket.io-client'

type RoomState = 'connecting' | 'waiting' | 'ready' | 'full'

interface VideoState {
  playing: boolean
  time: number
}

export function useRoom(roomId: string) {
  const socketRef = useRef<Socket | null>(null)
  const [roomState, setRoomState] = useState<RoomState>('connecting')
  const [partnerSocketId, setPartnerSocketId] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoState, setVideoState] = useState<VideoState>({ playing: false, time: 0 })
  const [isInitiator, setIsInitiator] = useState(false)
  const [reactions, setReactions] = useState<string[]>([])
  const isSyncing = useRef(false)

  useEffect(() => {
    const socket = getSocket()
    socketRef.current = socket

    const userId = Math.random().toString(36).slice(2)

    // Entra na sala AGORA e também a cada (re)conexão. Cobre o caso de a
    // conexão cair (iPhone em background, troca de rede) e voltar — sem isso,
    // depois de uma queda o servidor não sabe mais que você está na sala.
    const join = () => socket.emit('join-room', { roomId, userId })
    if (socket.connected) join()
    socket.on('connect', join)

    socket.on('room-joined', ({ partnerConnected, videoUrl: url, state, yourIndex }) => {
      setIsInitiator(yourIndex === 0)
      if (url) setVideoUrl(url)
      if (state) setVideoState(state)
      setRoomState(partnerConnected ? 'ready' : 'waiting')
    })

    socket.on('room-ready', () => setRoomState('ready'))
    socket.on('room-full', () => setRoomState('full'))

    socket.on('partner-joined', ({ socketId }) => {
      setPartnerSocketId(socketId)
      setRoomState('ready')
    })

    socket.on('partner-left', () => {
      setPartnerSocketId(null)
      setRoomState('waiting')
    })

    socket.on('video-changed', ({ videoUrl: url }) => {
      setVideoUrl(url)
      setVideoState({ playing: false, time: 0 })
    })

    socket.on('video-sync', ({ action, time }) => {
      isSyncing.current = true
      setVideoState({ playing: action === 'play', time })
      setTimeout(() => { isSyncing.current = false }, 300)
    })

    socket.on('reaction', ({ emoji }) => {
      setReactions(r => [...r, emoji])
      setTimeout(() => setReactions(r => r.slice(1)), 2500)
    })

    return () => {
      socket.off('connect', join)
      socket.off('room-joined')
      socket.off('room-ready')
      socket.off('room-full')
      socket.off('partner-joined')
      socket.off('partner-left')
      socket.off('video-changed')
      socket.off('video-sync')
      socket.off('reaction')
    }
  }, [roomId])

  const sendVideoUrl = useCallback((url: string) => {
    socketRef.current?.emit('set-video', { roomId, videoUrl: url })
    setVideoUrl(url)
  }, [roomId])

  const syncVideo = useCallback((action: 'play' | 'pause' | 'seek', time: number) => {
    if (isSyncing.current) return
    socketRef.current?.emit('video-sync', { roomId, action, time })
    setVideoState({ playing: action === 'play', time })
  }, [roomId])

  const sendReaction = useCallback((emoji: string) => {
    socketRef.current?.emit('reaction', { roomId, emoji })
  }, [roomId])

  return {
    socket: socketRef.current,
    roomState,
    partnerSocketId,
    videoUrl,
    videoState,
    isInitiator,
    reactions,
    sendVideoUrl,
    syncVideo,
    sendReaction,
  }
}
