import { useState } from 'react'
import { ADAPTACIONES } from '../data/adaptaciones'
import { PICTOGRAMAS } from '../data/pictogramas'
import { useApp } from '../context/AppContext'

export default function Neuro() {
  const { toast, setFullScreen } = useApp()
  const categorias = Object.keys(PICTOGRAMAS)
  const [cat, setCat] = useState(categorias[0])
  const [tira, setTira] = useState([])

  const mostrar = () => {
    if (!tira.length) { toast('Agrega pictogramas primero 🖼️'); return }
    setFullScreen({ tipo: 'pictos', items: tira })
  }

  return (
    <section className="view">
      <p className="eyebrow">Espacio neurodivergente</p>
      <h2>Ayudas y adaptaciones 🧩</h2>
      <p className="sub">Estrategias concretas para adecuar clases, evaluaciones y tareas cotidianas. Útil para estudiantes, docentes y familias.</p>

      <div className="acordeon">
        {ADAPTACIONES.map((a) => (
          <details key={a.id}>
            <summary>{a.icono} {a.nombre} <span className="tag-nd">{a.tag}</span></summary>
            <div className="cont">
              <h4>Para adecuar clases</h4>
              <ul>{a.clases.map((c) => <li key={c}>{c}</li>)}</ul>
              <h4>Para tareas básicas</h4>
              <ul>{a.tareas.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </details>
        ))}
      </div>

      <h2 style={{ marginTop: 30 }}>Pictogramas 🖼️</h2>
      <p className="sub">Toca los pictogramas para armar un mensaje y muéstralo sin necesidad de hablar.</p>

      <div className="tira">
        {tira.length === 0 && <span className="tira-vacia">Tu mensaje aparecerá aquí…</span>}
        {tira.map(([e, t], i) => (
          <button key={`${t}-${i}`} className="picto" title="Tocar para quitar"
            onClick={() => setTira(tira.filter((_, k) => k !== i))}>
            <b>{e}</b>{t}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
        <button className="btn lila" onClick={mostrar}>👁️ Mostrar en grande</button>
        <button className="btn sec" onClick={() => setTira([])}>🗑️ Limpiar</button>
      </div>

      <div className="picto-cats">
        {categorias.map((c) => (
          <button key={c} className={`chipf ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="picto-grid">
        {PICTOGRAMAS[cat].map(([e, t]) => (
          <button key={t} className="picto" onClick={() => setTira([...tira, [e, t]])}>
            <b>{e}</b>{t}
          </button>
        ))}
      </div>
    </section>
  )
}
