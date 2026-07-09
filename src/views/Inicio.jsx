import { useState } from 'react'
import Modal from '../components/Modal'
import Respiracion from '../features/Respiracion'
import Grounding from '../features/Grounding'
import SOS from '../features/SOS'
import { LINEAS, EMERGENCIA } from '../data/lineas'

const ACCESOS = [
  { v: 'mapa', ic: '🗺️', t: 'Espacios de calma', d: 'Mapa de lugares tranquilos y de baja estimulación cerca de ti.' },
  { v: 'calma', ic: '🌬️', t: 'Técnicas de calma', d: 'Respiración guiada, grounding 5-4-3-2-1 y relajación muscular.' },
  { v: 'neuro', ic: '🧩', t: 'Espacio neurodivergente', d: 'Adaptaciones para TDAH, TEA, dislexia y TEL, más pictogramas.' },
  { v: 'estado', ic: '😊', t: 'Mi estado de ánimo', d: 'Muestra cómo te sientes sin necesidad de hablar.' },
  { v: 'pros', ic: '🩺', t: 'Profesionales', d: 'Especialistas en salud mental y tips gratuitos.' },
]

export default function Inicio({ irA }) {
  const [modal, setModal] = useState(null) // 'crisis' | 'sos' | 'resp' | 'grounding'
  const cerrar = () => setModal(null)

  return (
    <section className="view">
      <div className="hero">
        <p className="eyebrow">Estás en un lugar seguro</p>
        <h1>Respira. Estamos contigo.</h1>
        <p className="sub" style={{ margin: '0 auto' }}>
          Encuentra espacios de calma cerca de ti, técnicas para atravesar una crisis y apoyo profesional, todo en un solo lugar.
        </p>
      </div>

      <button className="btn-crisis" onClick={() => setModal('crisis')}>
        🤲 Necesito ayuda ahora
        <span>Técnicas de calma inmediata y líneas de apoyo</span>
      </button>

      <button className="btn-sos" onClick={() => setModal('sos')}>🆘 SOS — Avisar a mi contacto de emergencia</button>

      <div style={{ textAlign: 'center' }}>
        {LINEAS.map((l) => (
          <a key={l.tel} className="chip-linea" href={`tel:${l.tel}`}>{l.icono} {l.nombre}</a>
        ))}
      </div>

      <div className="grid2">
        {ACCESOS.map((a) => (
          <button key={a.v} className="card link" onClick={() => irA(a.v)}>
            <span className="ic">{a.ic}</span><h3>{a.t}</h3><p>{a.d}</p>
          </button>
        ))}
      </div>

      <div className="aviso">
        ⚠️ Refugio es una herramienta de apoyo y <b>no reemplaza la atención médica de urgencia</b>.
        Si tú o alguien más está en peligro inmediato, llama al {EMERGENCIA.tel} ({EMERGENCIA.nombre}) o acude al servicio de urgencia más cercano.
      </div>

      {modal === 'crisis' && (
        <Modal titulo="Estás a salvo. Vamos paso a paso 🤲" onClose={cerrar} label="Ayuda inmediata">
          <p className="sub" style={{ fontSize: '.92rem' }}>Lo que sientes es intenso, pero va a pasar. Elige una opción:</p>
          <button className="btn blq" onClick={() => setModal('resp')}>🌬️ Respirar conmigo (guiado)</button>
          <button className="btn lila blq" onClick={() => setModal('grounding')}>🖐️ Grounding 5-4-3-2-1</button>
          {LINEAS.map((l) => (
            <a key={l.tel} className="btn sec blq" href={`tel:${l.tel}`}>{l.icono} Llamar: {l.nombre}</a>
          ))}
          <button className="btn rojo blq" onClick={() => setModal('sos')}>🆘 Avisar a mi contacto de emergencia</button>
          <small className="nota">Si estás en peligro inmediato, llama al {EMERGENCIA.tel} ({EMERGENCIA.nombre}).</small>
        </Modal>
      )}
      {modal === 'sos' && <SOS onClose={cerrar} />}
      {modal === 'resp' && <Respiracion patron="478" onClose={cerrar} />}
      {modal === 'grounding' && <Grounding onClose={cerrar} />}
    </section>
  )
}
