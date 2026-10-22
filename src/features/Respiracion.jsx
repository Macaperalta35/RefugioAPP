import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PATRONES_RESPIRACION } from '../data/grounding'

// Un patrón distinto por fase, para respirar con los ojos cerrados (ms: vibra, pausa, vibra…)
const VIBRACION = {
  inhala: [500],
  retiene: [90, 140, 90],
  exhala: [90, 140, 90, 140, 90],
}
const puedeVibrar = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

const tipoFase = (texto) => (texto.startsWith('Inhala') ? 'inhala' : texto.startsWith('Exhala') ? 'exhala' : 'retiene')

export default function Respiracion({ patron = '478', onClose }) {
  const p = PATRONES_RESPIRACION[patron]
  const [activo, setActivo] = useState(false)
  const [faseI, setFaseI] = useState(0)
  const [restante, setRestante] = useState(null)
  const [vibrar, setVibrar] = useLocalStorage('respiracion-vibrar', false)
  const timer = useRef(null)
  const vibrarRef = useRef(vibrar)
  vibrarRef.current = vibrar

  const avisarFase = (fi) => {
    if (puedeVibrar && vibrarRef.current) navigator.vibrate(VIBRACION[tipoFase(p.fases[fi][0])])
  }

  useEffect(() => () => {
    clearInterval(timer.current)
    if (puedeVibrar) navigator.vibrate(0)
  }, [])

  const detener = () => {
    clearInterval(timer.current)
    if (puedeVibrar) navigator.vibrate(0)
    setActivo(false); setFaseI(0); setRestante(null)
  }

  const iniciar = () => {
    setActivo(true); setFaseI(0); setRestante(p.fases[0][1])
    avisarFase(0)
    let fi = 0, rest = p.fases[0][1]
    timer.current = setInterval(() => {
      rest--
      if (rest <= 0) {
        fi = (fi + 1) % p.fases.length
        rest = p.fases[fi][1]
        setFaseI(fi)
        avisarFase(fi)
      }
      setRestante(rest)
    }, 1000)
  }

  const alternarVibrar = () => {
    const nuevo = !vibrar
    setVibrar(nuevo)
    if (nuevo && puedeVibrar) navigator.vibrate(VIBRACION.inhala) // muestra cómo se siente
    if (!nuevo && puedeVibrar) navigator.vibrate(0)
  }

  const fase = p.fases[faseI]
  const escala = activo ? fase[2] : 1
  const dur = fase[1]

  return (
    <Modal titulo={p.t} onClose={() => { detener(); onClose() }} label="Respiración guiada">
      <div className="resp-zona">
        <div className="circulo" style={{ transform: `scale(${escala})`, transitionDuration: `${dur}s` }}>Respira</div>
        <div className="fase">{activo ? fase[0] : 'Presiona comenzar cuando estés lista/o'}</div>
        <div className="tempo">{activo ? restante : ''}</div>
        <button className="btn" onClick={activo ? detener : iniciar}>{activo ? '⏸ Detener' : '▶ Comenzar'}</button>
        {puedeVibrar && (
          <div className="resp-vibrar">
            <button type="button" className={`chipf ${vibrar ? 'on' : ''}`} aria-pressed={vibrar} onClick={alternarVibrar}>
              📳 Vibrar en cada fase {vibrar ? '· activado' : ''}
            </button>
            {vibrar && (
              <small className="nota">1 vibración larga: inhala · 2 cortas: retén · 3 cortas: exhala. Puedes cerrar los ojos.</small>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
