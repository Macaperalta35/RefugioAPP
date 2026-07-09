import { useState } from 'react'
import Respiracion from '../features/Respiracion'
import Grounding from '../features/Grounding'
import Relajacion from '../features/Relajacion'

const TARJETAS = [
  { id: 'r478', ic: '🌬️', t: 'Respiración 4-7-8', d: 'Inhala 4, retén 7, exhala 8. Ideal para bajar la activación del cuerpo.' },
  { id: 'rcaja', ic: '📦', t: 'Respiración de caja', d: '4-4-4-4. Usada para recuperar el control en momentos de estrés.' },
  { id: 'grounding', ic: '🖐️', t: 'Grounding 5-4-3-2-1', d: 'Vuelve al presente usando tus cinco sentidos, paso a paso.' },
  { id: 'relax', ic: '💆', t: 'Relajación muscular', d: 'Tensa y suelta cada grupo muscular para liberar la tensión.' },
]

export default function Calma() {
  const [modal, setModal] = useState(null)
  const cerrar = () => setModal(null)

  return (
    <section className="view">
      <p className="eyebrow">Técnicas validadas</p>
      <h2>Herramientas para atravesar una crisis</h2>
      <p className="sub">Ejercicios breves y guiados, basados en técnicas ampliamente utilizadas para el manejo de la ansiedad.</p>

      <div className="grid2">
        {TARJETAS.map((t) => (
          <button key={t.id} className="card link" onClick={() => setModal(t.id)}>
            <span className="ic">{t.ic}</span><h3>{t.t}</h3><p>{t.d}</p>
          </button>
        ))}
      </div>

      {modal === 'r478' && <Respiracion patron="478" onClose={cerrar} />}
      {modal === 'rcaja' && <Respiracion patron="caja" onClose={cerrar} />}
      {modal === 'grounding' && <Grounding onClose={cerrar} />}
      {modal === 'relax' && <Relajacion onClose={cerrar} />}
    </section>
  )
}
