import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'
import { PATRONES_RESPIRACION } from '../data/grounding'

export default function Respiracion({ patron = '478', onClose }) {
  const p = PATRONES_RESPIRACION[patron]
  const [activo, setActivo] = useState(false)
  const [faseI, setFaseI] = useState(0)
  const [restante, setRestante] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearInterval(timer.current), [])

  const detener = () => {
    clearInterval(timer.current)
    setActivo(false); setFaseI(0); setRestante(null)
  }

  const iniciar = () => {
    setActivo(true); setFaseI(0); setRestante(p.fases[0][1])
    let fi = 0, rest = p.fases[0][1]
    timer.current = setInterval(() => {
      rest--
      if (rest <= 0) {
        fi = (fi + 1) % p.fases.length
        rest = p.fases[fi][1]
        setFaseI(fi)
      }
      setRestante(rest)
    }, 1000)
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
      </div>
    </Modal>
  )
}
