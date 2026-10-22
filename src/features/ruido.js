// Ruido blanco, rosa y marrón generados con Web Audio API (sin archivos de audio ni red).

export const TIPOS_RUIDO = [
  { id: 'blanco', ic: '⚪', t: 'Ruido blanco', d: 'Parejo y brillante, como un ventilador. Tapa voces y ruidos sueltos.' },
  { id: 'rosa', ic: '🌸', t: 'Ruido rosa', d: 'Más suave que el blanco, como lluvia constante.' },
  { id: 'marron', ic: '🟤', t: 'Ruido marrón', d: 'Grave y profundo, como el mar a lo lejos. El más envolvente.' },
]

const SEGUNDOS = 6
const FUNDIDO_BUCLE = 0.5 // segundos que se mezclan para que el bucle no haga "clic"
const FUNDIDO = 1.2 // entrada y salida suaves

let ctx = null
let fuente = null
let ganancia = null

const obtenerCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Genera muestras de ruido del color pedido */
function generar(tipo, n) {
  const out = new Float32Array(n)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, ultimo = 0
  for (let i = 0; i < n; i++) {
    const blanco = Math.random() * 2 - 1
    if (tipo === 'rosa') {
      // Filtro de Paul Kellet
      b0 = 0.99886 * b0 + blanco * 0.0555179; b1 = 0.99332 * b1 + blanco * 0.0750759
      b2 = 0.96900 * b2 + blanco * 0.1538520; b3 = 0.86650 * b3 + blanco * 0.3104856
      b4 = 0.55000 * b4 + blanco * 0.5329522; b5 = -0.7616 * b5 - blanco * 0.0168980
      out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + blanco * 0.5362) * 0.11
      b6 = blanco * 0.115926
    } else if (tipo === 'marron') {
      ultimo = (ultimo + 0.02 * blanco) / 1.02
      out[i] = ultimo * 3.5
    } else {
      out[i] = blanco * 0.5
    }
  }
  return out
}

/** Buffer que se repite sin cortes: el inicio se funde con la continuación del final */
function crearBuffer(c, tipo) {
  const largo = Math.floor(c.sampleRate * SEGUNDOS)
  const mezcla = Math.floor(c.sampleRate * FUNDIDO_BUCLE)
  const crudo = generar(tipo, largo + mezcla)
  const buffer = c.createBuffer(1, largo, c.sampleRate)
  const datos = buffer.getChannelData(0)
  for (let i = 0; i < largo; i++) {
    if (i < mezcla) {
      const t = i / mezcla
      datos[i] = crudo[i] * t + crudo[largo + i] * (1 - t)
    } else {
      datos[i] = crudo[i]
    }
  }
  return buffer
}

/** Empieza a sonar (o cambia de tipo) con entrada suave */
export function reproducirRuido(tipo, volumen) {
  const c = obtenerCtx()
  detenerRuido(0.3)
  ganancia = c.createGain()
  ganancia.gain.setValueAtTime(0, c.currentTime)
  ganancia.gain.linearRampToValueAtTime(volumen, c.currentTime + FUNDIDO)
  ganancia.connect(c.destination)
  fuente = c.createBufferSource()
  fuente.buffer = crearBuffer(c, tipo)
  fuente.loop = true
  fuente.connect(ganancia)
  fuente.start()
}

export function volumenRuido(volumen) {
  if (!ganancia || !ctx) return
  ganancia.gain.cancelScheduledValues(ctx.currentTime)
  ganancia.gain.setTargetAtTime(volumen, ctx.currentTime, 0.1)
}

/** Se apaga con salida suave */
export function detenerRuido(segundos = FUNDIDO) {
  if (!fuente || !ctx) return
  const f = fuente, g = ganancia
  g.gain.cancelScheduledValues(ctx.currentTime)
  g.gain.setValueAtTime(g.gain.value, ctx.currentTime)
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + segundos)
  f.stop(ctx.currentTime + segundos + 0.05)
  f.onended = () => g.disconnect()
  fuente = null
  ganancia = null
}

export const ruidoSonando = () => fuente !== null
