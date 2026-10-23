import { useApp } from '../context/AppContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Agenda from '../features/organizar/Agenda'
import Rutinas from '../features/organizar/Rutinas'
import Compras from '../features/organizar/Compras'

const SECCIONES = [
  { id: 'agenda', ic: '📅', t: 'Agenda' },
  { id: 'rutinas', ic: '✅', t: 'Rutinas' },
  { id: 'compras', ic: '🛒', t: 'Compras' },
]

/** Herramientas de organización pensadas para TDAH. Todo se guarda solo en el dispositivo. */
export default function Organizar() {
  const { toast } = useApp()
  const [seccion, setSeccion] = useLocalStorage('organizar-seccion', 'agenda')

  return (
    <section className="view">
      <p className="eyebrow">Apoyo para TDAH</p>
      <h2>Organizar mi día 📒</h2>
      <p className="sub">Agenda, rutinas y lista de compras en un solo lugar, con pasos cortos para no perder el hilo.</p>

      <div className="segmentos org-secciones" role="tablist" aria-label="Herramientas de organización">
        {SECCIONES.map((s) => (
          <button key={s.id} role="tab" aria-selected={seccion === s.id} className={seccion === s.id ? 'on' : ''}
            onClick={() => setSeccion(s.id)}>{s.ic} {s.t}</button>
        ))}
      </div>

      {seccion === 'agenda' && <Agenda toast={toast} />}
      {seccion === 'rutinas' && <Rutinas toast={toast} />}
      {seccion === 'compras' && <Compras toast={toast} />}

      <small className="nota">🔒 Se guarda solo en este dispositivo. La agenda no envía recordatorios: revísala al empezar el día.</small>
    </section>
  )
}
