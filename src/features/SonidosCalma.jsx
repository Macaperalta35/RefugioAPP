import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { TIPOS_RUIDO, reproducirRuido, volumenRuido, detenerRuido } from './ruido'

const TEMPORIZADORES = [
  { min: 0, t: 'Sin límite' },
  { min: 15, t: '15 min' },
  { min: 30, t: '30 min' },
  { min: 60, t: '1 hora' },
]

const formatoTiempo = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function SonidosCalma({ onClose }) {
  const [tipo, setTipo] = useLocalStorage('ruido-tipo', 'rosa')
  const [volumen, setVolumen] = useLocalStorage('ruido-volumen', 0.5)
  const [minutos, setMinutos] = useState(0)
  const [sonando, setSonando] = useState(false)
  const [restante, setRestante] = useState(null) // segundos que faltan con temporizador
  const reloj = useRef(null)

  // Al cerrar la ventana el sonido se apaga
  useEffect(() => () => { clearInterval(reloj.current); detenerRuido() }, [])

  const iniciarTemporizador = (min) => {
    clearInterval(reloj.current)
    if (!min) { setRestante(null); return }
    let s = min * 60
    setRestante(s)
    reloj.current = setInterval(() => {
      s--
      setRestante(s)
      if (s <= 0) {
        clearInterval(reloj.current)
        detenerRuido(4) // se apaga despacio, por si la persona se durmió
        setSonando(false); setRestante(null)
      }
    }, 1000)
  }

  const reproducir = (t = tipo) => {
    reproducirRuido(t, volumen)
    setSonando(true)
    iniciarTemporizador(minutos)
  }

  const detener = () => {
    detenerRuido()
    clearInterval(reloj.current)
    setSonando(false); setRestante(null)
  }

  const elegirTipo = (t) => {
    setTipo(t)
    if (sonando) reproducirRuido(t, volumen)
  }

  const cambiarVolumen = (e) => {
    const v = Number(e.target.value)
    setVolumen(v)
    volumenRuido(v)
  }

  const elegirMinutos = (min) => {
    setMinutos(min)
    if (sonando) iniciarTemporizador(min)
  }

  return (
    <Modal titulo="🌫️ Sonidos de calma" onClose={onClose} label="Sonidos de calma">
      <p className="sub" style={{ fontSize: '.9rem' }}>
        Un sonido constante tapa los ruidos que molestan y ayuda a bajar la sobrecarga o a dormir. Usa audífonos si puedes.
      </p>

      <div className="ruido-tipos" role="radiogroup" aria-label="Tipo de sonido">
        {TIPOS_RUIDO.map((r) => (
          <button key={r.id} type="button" role="radio" aria-checked={tipo === r.id}
            className={`ruido-tipo ${tipo === r.id ? 'on' : ''}`} onClick={() => elegirTipo(r.id)}>
            <span className="ic">{r.ic}</span><b>{r.t}</b><span>{r.d}</span>
          </button>
        ))}
      </div>

      <label htmlFor="ruidoVolumen">🔉 Volumen</label>
      <input id="ruidoVolumen" type="range" min="0.05" max="1" step="0.05" value={volumen} onChange={cambiarVolumen} />

      <fieldset className="opciones">
        <legend>⏲️ Apagar después de</legend>
        <div className="frases">
          {TEMPORIZADORES.map((x) => (
            <button key={x.min} type="button" className={`chipf ${minutos === x.min ? 'on' : ''}`}
              aria-pressed={minutos === x.min} onClick={() => elegirMinutos(x.min)}>{x.t}</button>
          ))}
        </div>
      </fieldset>

      <div className="ruido-control">
        <button className="btn blq" onClick={sonando ? detener : () => reproducir()}>
          {sonando ? '⏸ Detener' : '▶ Reproducir'}
        </button>
        <p className="nota" role="status">
          {sonando ? (restante !== null ? `Se apagará en ${formatoTiempo(restante)}` : 'Sonando sin límite') : ''}
        </p>
      </div>
      <small className="nota">El sonido se genera en tu teléfono, sin internet. Se apaga al cerrar esta ventana o si bloqueas la pantalla en algunos teléfonos.</small>
    </Modal>
  )
}
