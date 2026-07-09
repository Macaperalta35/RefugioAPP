import Modal from '../components/Modal'
import { RELAJACION } from '../data/grounding'

export default function Relajacion({ onClose }) {
  return (
    <Modal titulo="💆 Relajación muscular progresiva" onClose={onClose} label="Relajación muscular progresiva">
      <p className="sub" style={{ fontSize: '.9rem' }}>Tensa cada zona por 5 segundos y luego suéltala por 10, notando la diferencia.</p>
      <div className="acordeon" style={{ marginTop: 12 }}>
        {RELAJACION.map((r, i) => (
          <details key={r.z} open={i === 0}>
            <summary>{r.z}</summary>
            <div className="cont"><p>{r.d}</p></div>
          </details>
        ))}
      </div>
    </Modal>
  )
}
