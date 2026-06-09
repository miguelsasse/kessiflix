'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getSocket } from '@/lib/socket'

// Multiple STUN servers for better connectivity across different networks/cities
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
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

  // Get socket directly — avoids the stale null ref from useRoom
  const socketRef = useRef(getSocket())

  function createPeer(onIceCandidate: (candidate: RTCIceCandidate) => void): RTCPeerConnection {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]
    }
    pc.onicecandidate = (e) => {
      if (e.candidate) onIceCandidate(e.candidate)
    }
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') setCallActive(false)
    }
    return pc
  }

  async function getLocalStream(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      return stream
    } catch (err: any) {
      // Camera/mic blocked or unavailable (common on HTTP on mobile)
      const msg = err?.name === 'NotAllowedError'
        ? 'Permissão de câmera negada'
        : 'Câmera não disponível'
      setCallError(msg)
      return null
    }
  }

  const startCall = useCallback(async () => {
    const socket = socketRef.current
    if (!socket || !partnerSocketId) return

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

    setCallActive(true)
    setCallError(null)
  }, [partnerSocketId, roomId, isInitiator])

  // Listen for WebRTC signals (always active, no socket null issue)
  useEffect(() => {
    const socket = socketRef.current

    const handleSignal = async ({ signal, from }: { signal: any; from: string }) => {
      let pc = peerRef.current

      // Non-initiator: create peer on first signal received
      if (!pc) {
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
        stream.getTracks().forEach(t => pc!.addTrack(t, stream!))
        setCallActive(true)
        setCallError(null)
      }

      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('webrtc-signal', {
          roomId,
          signal: { type: 'answer', sdp: answer },
          to: from,
        })
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
      } else if (signal.type === 'ice') {
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
