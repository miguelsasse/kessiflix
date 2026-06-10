'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getSocket } from '@/lib/socket'

// STUN descobre o IP público; TURN faz a ponte quando o P2P direto falha
// (essencial quando os dois estão em redes/cidades diferentes).
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  // TURN públicos gratuitos (OpenRelay / Metered)
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
]

interface UseWebRTCProps {
  roomId: string
  partnerSocketId: string | null
  isInitiator: boolean
}

export function useWebRTC({ roomId, partnerSocketId, isInitiator }: UseWebRTCProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const [callActive, setCallActive] = useState(false)
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [callError, setCallError] = useState<string | null>(null)

  // Guardamos os streams em state — assim um useEffect liga o srcObject
  // DEPOIS que o elemento <video> existe na tela (corrige o "vídeo não aparece").
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const socketRef = useRef(getSocket())

  // Liga o stream LOCAL ao elemento assim que ambos existirem
  useEffect(() => {
    const el = localVideoRef.current
    if (callActive && el && localStream && el.srcObject !== localStream) {
      el.srcObject = localStream
      el.play?.().catch(() => {})
    }
  }, [callActive, localStream])

  // Liga o stream REMOTO ao elemento assim que ambos existirem
  useEffect(() => {
    const el = remoteVideoRef.current
    if (callActive && el && remoteStream && el.srcObject !== remoteStream) {
      el.srcObject = remoteStream
      el.play?.().catch(() => {})
    }
  }, [callActive, remoteStream])

  function createPeer(onIceCandidate: (candidate: RTCIceCandidate) => void): RTCPeerConnection {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    // Recebe a mídia do parceiro → guarda em state (effect acima exibe)
    pc.ontrack = (e) => {
      setRemoteStream(e.streams[0])
    }
    pc.onicecandidate = (e) => {
      if (e.candidate) onIceCandidate(e.candidate)
    }
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        // não derruba a UI; deixa o usuário tentar de novo
      }
    }
    return pc
  }

  async function getLocalStream(): Promise<MediaStream | null> {
    if (localStreamRef.current) return localStreamRef.current
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      setLocalStream(stream)
      return stream
    } catch (err) {
      const name = (err as DOMException)?.name
      const msg = name === 'NotAllowedError'
        ? 'Permita o acesso à câmera e ao microfone'
        : 'Câmera/microfone indisponível'
      setCallError(msg)
      return null
    }
  }

  const startCall = useCallback(async () => {
    const socket = socketRef.current
    if (!socket || !partnerSocketId) return

    setCallActive(true)   // renderiza os <video> ANTES de a mídia chegar
    setCallError(null)

    const stream = await getLocalStream()
    if (!stream) return

    const pc = createPeer((candidate) => {
      socket.emit('webrtc-signal', {
        roomId,
        signal: { type: 'ice', candidate },
        to: partnerSocketId,
      })
    })
    peerRef.current = pc
    stream.getTracks().forEach(t => pc.addTrack(t, stream))

    if (isInitiator) {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket.emit('webrtc-signal', {
        roomId,
        signal: { type: 'offer', sdp: offer },
        to: partnerSocketId,
      })
    }
  }, [partnerSocketId, roomId, isInitiator])

  // Recebe sinais do parceiro (sempre ativo)
  useEffect(() => {
    const socket = socketRef.current

    const handleSignal = async ({ signal, from }: { signal: { type: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }; from: string }) => {
      let pc = peerRef.current

      // Quem recebe primeiro um sinal cria o peer e abre a câmera
      if (!pc) {
        setCallActive(true)
        setCallError(null)
        const stream = await getLocalStream()
        if (!stream) return

        pc = createPeer((candidate) => {
          socket.emit('webrtc-signal', {
            roomId,
            signal: { type: 'ice', candidate },
            to: from,
          })
        })
        peerRef.current = pc
        stream.getTracks().forEach(t => pc!.addTrack(t, stream))
      }

      if (signal.type === 'offer' && signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('webrtc-signal', {
          roomId,
          signal: { type: 'answer', sdp: answer },
          to: from,
        })
      } else if (signal.type === 'answer' && signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
      } else if (signal.type === 'ice' && signal.candidate) {
        try { await pc.addIceCandidate(new RTCIceCandidate(signal.candidate)) } catch {}
      }
    }

    socket.on('webrtc-signal', handleSignal)
    return () => { socket.off('webrtc-signal', handleSignal) }
  }, [roomId])

  const toggleAudio = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
    setAudioMuted(m => !m)
  }, [])

  const toggleVideo = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
    setVideoMuted(m => !m)
  }, [])

  const endCall = useCallback(() => {
    peerRef.current?.close()
    peerRef.current = null
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    localStreamRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
    setCallActive(false)
  }, [])

  return {
    localVideoRef, remoteVideoRef,
    callActive, audioMuted, videoMuted, callError,
    startCall, toggleAudio, toggleVideo, endCall,
  }
}
