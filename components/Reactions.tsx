'use client'

const EMOJIS = ['❤️', '😂', '😮', '😭', '🔥', '👏']

interface ReactionsProps {
  active: string[]
  onSend: (emoji: string) => void
}

export default function Reactions({ active, onSend }: ReactionsProps) {
  return (
    <>
      {/* Floating reactions — animate up */}
      <div className="fixed left-4 bottom-24 pointer-events-none flex flex-col-reverse gap-1 z-40">
        {active.map((emoji, i) => (
          <span
            key={i}
            className="text-3xl animate-bounce select-none"
            style={{ animationDuration: '0.5s' }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Emoji bar — bottom left, above safe area */}
      <div
        className="shrink-0 flex items-center gap-1 px-3 bg-zinc-950 border-t border-zinc-900 pb-safe"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        {EMOJIS.map(e => (
          <button
            key={e}
            onClick={() => onSend(e)}
            className="text-2xl py-2 px-1.5 active:scale-125 transition-transform select-none flex-1 text-center"
          >
            {e}
          </button>
        ))}
      </div>
    </>
  )
}
