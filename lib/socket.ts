import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const url = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    socket = io(url, {
      // polling primeiro (sempre funciona via HTTP), faz upgrade pra websocket
      // quando der. Essencial em redes de celular / atrás de proxy.
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
