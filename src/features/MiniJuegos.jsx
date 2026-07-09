import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'

const JUEGOS = [
  { id: 'burbujas', ic: '🫧', t: 'Burbujas', d: 'Revienta e infla burbujas sin parar' },
  { id: 'globo', ic: '🎈', t: 'Aprieta el globo', d: 'Presiona y suelta' },
  { id: 'trazo', ic: '🌊', t: 'Traza la ola', d: 'Desliza el dedo y deja un rastro' },
  { id: 'estrellas', ic: '✨', t: 'Lluvia de estrellas', d: 'Toca la pantalla para soltar estrellas' },
  { id: 'rueda', ic: '🌀', t: 'Rueda que gira', d: 'Gírala con el dedo' },
  { id: 'color', ic: '🎨', t: 'Cambia el color', d: 'Toca para pasar a otro color' },
]

/** Grilla de burbujas: tocar infla/desinfla, sin puntaje ni tiempo límite */
function Burbujas() {
  const [reventadas, setReventadas] = useState(() => new Set())
  const total = 30

  const alternar = (i) => {
    setReventadas((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div>
      <div className="burbujas-grid">
        {Array.from({ length: total }, (_, i) => (
          <button key={i} className={`burbuja ${reventadas.has(i) ? 'pop' : ''}`} onClick={() => alternar(i)} aria-label="Burbuja" />
        ))}
      </div>
      <button className="btn sec blq" onClick={() => setReventadas(new Set())}>🔄 Reinflar todas</button>
    </div>
  )
}

/** Globo/blob que se aprieta al mantener presionado */
function Globo() {
  const [presionado, setPresionado] = useState(false)
  return (
    <div className="globo-zona">
      <div
        className={`globo-blob ${presionado ? 'apretado' : ''}`}
        onPointerDown={() => setPresionado(true)}
        onPointerUp={() => setPresionado(false)}
        onPointerLeave={() => setPresionado(false)}
      >🎈</div>
      <p className="trazo-hint-fija">Mantén presionado y suelta</p>
    </div>
  )
}

/** Zona donde deslizar el dedo deja un rastro de puntos que se desvanecen */
function Trazo() {
  const zonaRef = useRef(null)
  const arrastrando = useRef(false)
  const [puntos, setPuntos] = useState([])

  const agregarPunto = (clientX, clientY) => {
    const rect = zonaRef.current.getBoundingClientRect()
    const id = Date.now() + Math.random()
    const x = clientX - rect.left
    const y = clientY - rect.top
    setPuntos((prev) => [...prev.slice(-40), { id, x, y }])
    setTimeout(() => setPuntos((prev) => prev.filter((p) => p.id !== id)), 900)
  }

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    arrastrando.current = true
    agregarPunto(e.clientX, e.clientY)
  }
  const onMove = (e) => { if (arrastrando.current) agregarPunto(e.clientX, e.clientY) }
  const onUp = () => { arrastrando.current = false }

  return (
    <div ref={zonaRef} className="trazo-zona" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      {puntos.length === 0 && <span className="trazo-hint">Desliza tu dedo aquí</span>}
      {puntos.map((p) => <span key={p.id} className="trazo-punto" style={{ left: p.x, top: p.y }} />)}
    </div>
  )
}

/** Tocar la pantalla suelta una estrella que flota y se desvanece */
function Estrellas() {
  const zonaRef = useRef(null)
  const [estrellas, setEstrellas] = useState([])

  const tocar = (e) => {
    const rect = zonaRef.current.getBoundingClientRect()
    const id = Date.now() + Math.random()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setEstrellas((prev) => [...prev.slice(-25), { id, x, y }])
    setTimeout(() => setEstrellas((prev) => prev.filter((s) => s.id !== id)), 1600)
  }

  return (
    <div ref={zonaRef} className="estrellas-zona" onPointerDown={tocar}>
      {estrellas.length === 0 && <span className="trazo-hint claro">Toca donde quieras</span>}
      {estrellas.map((s) => <span key={s.id} className="estrella-part" style={{ left: s.x, top: s.y }}>✨</span>)}
    </div>
  )
}

/** Rueda que se gira con el dedo y frena de a poco al soltar */
function Rueda() {
  const ruedaRef = useRef(null)
  const raf = useRef(null)
  const estado = useRef({ activo: false, anguloAnterior: 0, velocidad: 0 })
  const [grados, setGrados] = useState(0)

  const anguloDesdeCentro = (clientX, clientY) => {
    const rect = ruedaRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
  }

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    cancelAnimationFrame(raf.current)
    estado.current = { activo: true, anguloAnterior: anguloDesdeCentro(e.clientX, e.clientY), velocidad: 0 }
  }
  const onMove = (e) => {
    if (!estado.current.activo) return
    const actual = anguloDesdeCentro(e.clientX, e.clientY)
    let delta = actual - estado.current.anguloAnterior
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    setGrados((g) => g + delta)
    estado.current.velocidad = delta
    estado.current.anguloAnterior = actual
  }
  const onUp = () => {
    estado.current.activo = false
    const decel = () => {
      estado.current.velocidad *= 0.95
      setGrados((g) => g + estado.current.velocidad)
      if (Math.abs(estado.current.velocidad) > 0.05) raf.current = requestAnimationFrame(decel)
    }
    raf.current = requestAnimationFrame(decel)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div className="rueda-zona">
      <div ref={ruedaRef} className="rueda" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        style={{ transform: `rotate(${grados}deg)` }}>🌀</div>
      <p className="trazo-hint-fija">Gírala con el dedo y suelta</p>
    </div>
  )
}

/** Botón grande que cicla por una paleta de colores calmos al tocarlo */
const PALETA_CALMA = ['#7FA792', '#B7A9D6', '#6FA8C9', '#E8B04B', '#D98E8B', '#8A8FA3']
function CambiaColor() {
  const [i, setI] = useState(0)
  return (
    <div style={{ textAlign: 'center' }}>
      <button className="color-blob" style={{ background: PALETA_CALMA[i] }} onClick={() => setI((v) => (v + 1) % PALETA_CALMA.length)}>
        Toca para cambiar
      </button>
      <p className="trazo-hint-fija">{i + 1} / {PALETA_CALMA.length}</p>
    </div>
  )
}

const COMPONENTES = { burbujas: Burbujas, globo: Globo, trazo: Trazo, estrellas: Estrellas, rueda: Rueda, color: CambiaColor }

export default function MiniJuegos({ onClose }) {
  const [activo, setActivo] = useState(null)
  const Juego = activo ? COMPONENTES[activo] : null
  const meta = JUEGOS.find((j) => j.id === activo)

  return (
    <Modal titulo={activo ? `${meta.ic} ${meta.t}` : '📱 Mini-juegos sensoriales'} onClose={onClose} label="Mini-juegos sensoriales">
      {!activo && (
        <>
          <p className="sub" style={{ fontSize: '.9rem' }}>
            Juegos livianos, sin puntaje ni tiempo límite. Solo toca el que te llame y úsalo mientras te regulas.
          </p>
          <div className="grid2" style={{ marginTop: 10 }}>
            {JUEGOS.map((j) => (
              <button key={j.id} className="card link" onClick={() => setActivo(j.id)}>
                <span className="ic">{j.ic}</span><h3>{j.t}</h3><p>{j.d}</p>
              </button>
            ))}
          </div>
        </>
      )}
      {activo && (
        <>
          <button className="btn sec" style={{ marginBottom: 12 }} onClick={() => setActivo(null)}>← Volver a los juegos</button>
          <Juego />
        </>
      )}
    </Modal>
  )
}
