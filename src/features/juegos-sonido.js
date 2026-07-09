/** Sonidos cortos generados con Web Audio API (sin archivos de audio, para no sumar peso). */

let ctx = null
const obtenerCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

let activo = true
try { activo = localStorage.getItem('refugio-sonido') !== 'off' } catch { /* localStorage no disponible */ }

export const sonidoActivo = () => activo

export const alternarSonido = () => {
  activo = !activo
  try { localStorage.setItem('refugio-sonido', activo ? 'on' : 'off') } catch { /* localStorage no disponible */ }
  return activo
}

const tono = ({ freq = 440, duracion = 0.15, tipo = 'sine', volumen = 0.3, deslizarA = null }) => {
  if (!activo) return
  try {
    const audio = obtenerCtx()
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = tipo
    osc.frequency.setValueAtTime(freq, audio.currentTime)
    if (deslizarA) osc.frequency.exponentialRampToValueAtTime(deslizarA, audio.currentTime + duracion)
    gain.gain.setValueAtTime(volumen, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duracion)
    osc.connect(gain).connect(audio.destination)
    osc.start()
    osc.stop(audio.currentTime + duracion)
  } catch { /* Web Audio no disponible: se omite el sonido sin romper el juego */ }
}

export const sonarPop = () => tono({ freq: 320 + Math.random() * 160, duracion: 0.12, tipo: 'sine', deslizarA: 180, volumen: 0.38 })
export const sonarSuelta = () => tono({ freq: 180, duracion: 0.1, tipo: 'sine', deslizarA: 90, volumen: 0.3 })
export const sonarApretar = () => tono({ freq: 260, duracion: 0.12, tipo: 'triangle', deslizarA: 150, volumen: 0.32 })
export const sonarSoltarGlobo = () => tono({ freq: 150, duracion: 0.15, tipo: 'triangle', deslizarA: 260, volumen: 0.3 })
export const sonarTick = () => tono({ freq: 500 + Math.random() * 200, duracion: 0.06, tipo: 'sine', volumen: 0.22 })
export const sonarChispa = () => tono({ freq: 550 + Math.random() * 350, duracion: 0.28, tipo: 'sine', volumen: 0.3 })
export const sonarBoop = () => tono({ freq: 300, duracion: 0.18, tipo: 'sine', deslizarA: 420, volumen: 0.32 })
export const sonarGiro = (velocidad) => tono({ freq: 220 + Math.min(Math.abs(velocidad) * 14, 400), duracion: 0.05, tipo: 'sine', volumen: 0.16 })
