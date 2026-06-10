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

// SVG sobreposto: "KsF" como fumaça vermelha translúcida (~50%), bordas difusas
function overlaySVG(size) {
  const fontSize = Math.round(size * 0.42)
  const cx = size / 2
  const cy = size / 2
  const blurSoft = (size * 0.012).toFixed(1)   // desfoque do texto (esfumaçado)
  const blurHaze = (size * 0.05).toFixed(1)    // névoa/glow largo atrás
  return Buffer.from(`
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Desfoque suave das letras: aspecto de fumaça -->
      <filter id="smoke" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${blurSoft}"/>
      </filter>
      <!-- Névoa larga e difusa atrás (a "fumaça" se espalhando) -->
      <filter id="haze" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="${blurHaze}"/>
      </filter>
      <!-- Gradiente vertical avermelhado, tom de brasa -->
      <linearGradient id="redSmoke" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff4d6d"/>
        <stop offset="60%" stop-color="#e11d48"/>
        <stop offset="100%" stop-color="#b11236"/>
      </linearGradient>
      <!-- Vinheta leve pra dar profundidade -->
      <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
        <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
      </radialGradient>
    </defs>

    <rect width="${size}" height="${size}" fill="url(#vignette)"/>

    <!-- Camada 1: névoa vermelha bem difusa (a fumaça espalhada) -->
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
          font-family="Arial Black, Arial, sans-serif" font-weight="900"
          font-size="${fontSize}" fill="#ff1f47"
          filter="url(#haze)" opacity="0.4"
          letter-spacing="${Math.round(size*0.005)}">KsF</text>

    <!-- Camada 2: as letras esfumaçadas, ~50% de transparência -->
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
          font-family="Arial Black, Arial, sans-serif" font-weight="900"
          font-size="${fontSize}" fill="url(#redSmoke)"
          filter="url(#smoke)" opacity="0.5"
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
