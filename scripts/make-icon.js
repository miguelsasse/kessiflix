// Gera os ícones do app a partir de uma foto base + texto "KsF" vermelho sombreado.
// Uso:  node scripts/make-icon.js public/icon-base.jpg
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const input = process.argv[2] || 'public/icon-base.jpg'
const SIZE = 512

if (!fs.existsSync(input)) {
  console.error(`\n❌ Não achei a imagem: ${input}`)
  console.error(`   Salve sua foto em kessiflix/public/icon-base.jpg e rode de novo.\n`)
  process.exit(1)
}

// SVG sobreposto: "KsF" vermelho, sombra/glow forte, leve escurecimento nas bordas
function overlaySVG(size) {
  const fontSize = Math.round(size * 0.42)
  const cx = size / 2
  const cy = size / 2
  return Buffer.from(`
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Glow/sombra vermelha em volta das letras -->
      <filter id="redShadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="${Math.round(size*0.012)}" stdDeviation="${Math.round(size*0.02)}" flood-color="#000000" flood-opacity="0.85"/>
        <feDropShadow dx="0" dy="0" stdDeviation="${Math.round(size*0.03)}" flood-color="#e11d48" flood-opacity="0.6"/>
      </filter>
      <!-- Gradiente vermelho nas letras pra dar volume -->
      <linearGradient id="redFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fb3a5d"/>
        <stop offset="55%" stop-color="#e11d48"/>
        <stop offset="100%" stop-color="#9f1239"/>
      </linearGradient>
      <!-- Vinheta: escurece as bordas pra logo destacar -->
      <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
        <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
      </radialGradient>
    </defs>

    <rect width="${size}" height="${size}" fill="url(#vignette)"/>

    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
          font-family="Arial Black, Arial, sans-serif" font-weight="900"
          font-size="${fontSize}" fill="url(#redFill)"
          stroke="#4c0519" stroke-width="${Math.round(size*0.006)}"
          filter="url(#redShadow)"
          letter-spacing="${Math.round(size*0.005)}">KsF</text>
  </svg>`)
}

async function build() {
  // Base: foto recortada em quadrado (cover) na resolução alvo
  const base = await sharp(input)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.92 })          // leve escurecida pra o texto ler melhor
    .toBuffer()

  // Compõe foto + SVG
  const composed = await sharp(base)
    .composite([{ input: overlaySVG(SIZE), top: 0, left: 0 }])
    .png()
    .toBuffer()

  const out = (name, size) =>
    sharp(composed).resize(size, size).png().toFile(path.join('public', name))

  // apple-touch-icon (iOS tela inicial) + ícones PWA + favicon
  await out('apple-touch-icon.png', 180)
  await out('icon-192.png', 192)
  await out('icon-512.png', 512)
  await sharp(composed).resize(32, 32).png().toFile(path.join('public', 'favicon.png'))

  console.log('\n✅ Ícones gerados em public/:')
  console.log('   apple-touch-icon.png (180) · icon-192.png · icon-512.png · favicon.png\n')
}

build().catch(e => { console.error(e); process.exit(1) })
