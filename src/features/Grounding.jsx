import { useState } from 'react'
import Modal from '../components/Modal'
import { PASOS_GROUNDING } from '../data/grounding'

export default function Grounding({ onClose }) {
  const [i, setI] = useState(0)
  const fin = i >= PASOS_GROUNDING.length
  const paso = fin ? null : PASOS_GROUNDING[i]

  return (
    <Modal titulo="🖐️ Grounding 5-4-3-2-1" onClose={onClose} label="Grounding cinco sentidos">
      <p className="sub" style={{ fontSize: '.9rem' }}>Esta técnica te trae de vuelta al presente usando tus sentidos.</p>
      <div className="paso-box">
        <div className="num">{fin ? '💚' : paso[0]}</div>
        <p style={{ fontWeight: 700, color: 'var(--bosque)' }}>
          {fin ? 'Lo lograste. Estás aquí, en el presente.' : paso[1]}
        </p>
        <p style={{ fontSize: '.85rem', color: 'var(--tinta-suave)', marginTop: 6 }}>
          {fin ? 'Respira profundo una vez más. Puedes repetirlo si lo necesitas.' : paso[2]}
        </p>
      </div>
      <div className="progreso">
        {PASOS_GROUNDING.map((_, k) => <i key={k} className={k < i ? 'on' : ''} />)}
      </div>
      <button className="btn blq" onClick={() => setI(fin ? 0 : i + 1)}>
        {fin ? '🔁 Repetir' : 'Listo, siguiente →'}
      </button>
    </Modal>
  )
}
