const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')
const os = require('os')

function getLocalIP() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address
    }
  }
  return 'localhost'
}

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: __dirname })
const handle = app.getRequestHandler()

const rooms = new Map()
// rooms[id] = { users: [socketId, socketId], videoUrl: string, state: { playing, time } }

app.prepare().then(() => {
  const expressApp = express()
  const httpServer = createServer(expressApp)

  const io = new Server(httpServer, {
    cors: { origin: '*' }
  })

  io.on('connection', (socket) => {

    socket.on('join-room', ({ roomId, userId }) => {
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { users: [], videoUrl: null, state: { playing: false, time: 0 } })
      }

      const room = rooms.get(roomId)

      if (room.users.length >= 2 && !room.users.includes(socket.id)) {
        socket.emit('room-full')
        return
      }

      if (!room.users.includes(socket.id)) {
        room.users.push(socket.id)
      }

      socket.join(roomId)
      socket.data.roomId = roomId
      socket.data.userId = userId

      const partnerId = room.users.find(id => id !== socket.id)

      socket.emit('room-joined', {
        roomId,
        partnerConnected: !!partnerId,
        videoUrl: room.videoUrl,
        state: room.state,
        yourIndex: room.users.indexOf(socket.id)
      })

      if (partnerId) {
        io.to(partnerId).emit('partner-joined', { socketId: socket.id })
        socket.emit('partner-joined', { socketId: partnerId })
        io.to(roomId).emit('room-ready')
      }
    })

    socket.on('set-video', ({ roomId, videoUrl }) => {
      const room = rooms.get(roomId)
      if (!room) return
      room.videoUrl = videoUrl
      room.state = { playing: false, time: 0 }
      io.to(roomId).emit('video-changed', { videoUrl })
    })

    socket.on('video-sync', ({ roomId, action, time }) => {
      const room = rooms.get(roomId)
      if (!room) return
      room.state = { playing: action === 'play', time }
      socket.to(roomId).emit('video-sync', { action, time, from: socket.id })
    })

    socket.on('webrtc-signal', ({ roomId, signal, to }) => {
      io.to(to).emit('webrtc-signal', { signal, from: socket.id })
    })

    socket.on('reaction', ({ roomId, emoji }) => {
      socket.to(roomId).emit('reaction', { emoji })
    })

    socket.on('disconnecting', () => {
      const roomId = socket.data.roomId
      if (!roomId) return
      const room = rooms.get(roomId)
      if (!room) return
      room.users = room.users.filter(id => id !== socket.id)
      socket.to(roomId).emit('partner-left')
      if (room.users.length === 0) {
        rooms.delete(roomId)
      }
    })
  })

  expressApp.all('/{*splat}', (req, res) => handle(req, res))

  const PORT = process.env.PORT || 3000
  const localIP = getLocalIP()
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎬 KEssiFLIX rodando!`)
    console.log(`   Local:   http://localhost:${PORT}`)
    console.log(`   Rede:    http://${localIP}:${PORT}  ← use no iPhone (mesmo WiFi)`)
    console.log(`\n   ⚠  Câmera/microfone no iPhone exige HTTPS.`)
    console.log(`   Para ativar: instale o ngrok e rode:  ngrok http ${PORT}\n`)
  })
})
