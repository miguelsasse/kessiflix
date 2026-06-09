'use client'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone } from 'lucide-react'

interface CallBubbleProps {
  localVideoRef: React.RefObject<HTMLVideoElement | null>
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
  callActive: boolean
  audioMuted: boolean
  videoMuted: boolean
  callError?: string | null
  onStart: () => void
  onToggleAudio: () => void
  onToggleVideo: () => void
  onEnd: () => void
}

export default function CallBubble({
  localVideoRef, remoteVideoRef, callActive,
  audioMuted, videoMuted, callError,
  onStart, onToggleAudio, onToggleVideo, onEnd
}: CallBubbleProps) {

  if (!callActive) {
    return (
      <div className="fixed bottom-6 right-4 z-50 pb-safe flex flex-col items-end gap-1">
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-rose-600 active:bg-rose-500 text-white text-sm font-medium shadow-xl"
        >
          <Phone size={16} />
          Ligar
        </button>
        {callError && (
          <span className="text-xs text-red-400 bg-zinc-900/90 px-2 py-1 rounded-lg max-w-[140px] text-center">
            {callError}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2 pb-safe">

      {/* Video bubbles */}
      <div className="relative w-36 h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
        {/* Remote — full bubble */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline          /* iOS: prevent fullscreen takeover */
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-1 left-2 text-[10px] text-white/50 font-medium">parceiro(a)</span>

        {/* Local — corner pip */}
        <div className="absolute top-1.5 right-1.5 w-12 h-9 rounded-lg overflow-hidden border border-white/20 bg-zinc-800">
          <video
            ref={localVideoRef}
            autoPlay
            muted                /* Must be muted to avoid echo */
            playsInline          /* iOS: prevent fullscreen takeover */
            className="w-full h-full object-cover scale-x-[-1]"  /* Mirror local cam */
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={onToggleAudio}
          className={`p-2.5 rounded-full ${audioMuted ? 'bg-red-600' : 'bg-zinc-800'} text-white shadow`}
        >
          {audioMuted ? <MicOff size={15} /> : <Mic size={15} />}
        </button>
        <button
          onClick={onToggleVideo}
          className={`p-2.5 rounded-full ${videoMuted ? 'bg-red-600' : 'bg-zinc-800'} text-white shadow`}
        >
          {videoMuted ? <VideoOff size={15} /> : <Video size={15} />}
        </button>
        <button
          onClick={onEnd}
          className="p-2.5 rounded-full bg-red-600 active:bg-red-500 text-white shadow"
        >
          <PhoneOff size={15} />
        </button>
      </div>
    </div>
  )
}
