import Modal from '../components/Modal'
import { JUEGOS_SENSORIALES } from '../data/juegos'

export default function JuegosSensoriales({ onClose }) {
  return (
    <Modal titulo="🎮 Juegos sensoriales" onClose={onClose} label="Juegos sensoriales para regular">
      <p className="sub" style={{ fontSize: '.9rem' }}>
        Actividades breves y directas para bajar la ansiedad o la sobrecarga usando los sentidos. Elige la que tengas más a mano.
      </p>
      <div className="acordeon" style={{ marginTop: 12 }}>
        {JUEGOS_SENSORIALES.map((j, i) => (
          <details key={j.id} open={i === 0}>
            <summary>{j.ic} {j.t}</summary>
            <div className="cont"><p>{j.d}</p></div>
          </details>
        ))}
      </div>
    </Modal>
  )
}
