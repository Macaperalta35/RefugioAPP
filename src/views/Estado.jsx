import { useState } from 'react'
import Modal from '../components/Modal'
import Carita from '../components/Carita'
import { ESTADOS_INICIALES, EXPRESIONES, COLORES, ANIMACIONES } from '../data/estados'
import { useApp } from '../context/AppContext'

export default function Estado() {
  const { toast, setFullScreen } = useApp()
  const [estados, setEstados] = useState(ESTADOS_INICIALES)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ n: '', expr: 'feliz', color: '#7FA792', anim: 'anim-flotar', msj: '' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const crear = () => {
    if (!form.n.trim()) { toast('Ponle un nombre a tu estado 😊'); return }
    setEstados([{ ...form, id: Date.now(), n: form.n.trim(), msj: form.msj.trim() }, ...estados])
    setModal(false)
    setForm({ n: '', expr: 'feliz', color: '#7FA792', anim: 'anim-flotar', msj: '' })
    toast('💚 Estado creado. Tócalo para mostrarlo en grande.')
  }

  return (
    <section className="view">
      <p className="eyebrow">Comunicación sin palabras</p>
      <h2>Mi estado de ánimo 😊</h2>
      <p className="sub">Elige o crea un estado con su propia caricatura animada y muéstralo en pantalla completa. Ideal cuando hablar cuesta demasiado.</p>

      <div style={{ marginTop: 14 }}>
        <button className="btn" onClick={() => setModal(true)}>➕ Crear mi propio estado</button>
      </div>

      <div className="estados-grid">
        {estados.map((e) => (
          <button key={e.id} className="estado-card" onClick={() => setFullScreen({ tipo: 'estado', estado: e })}>
            <div className={`carita ${e.anim}`}><Carita expr={e.expr} color={e.color} /></div>
            <div className="nom">{e.n}</div>
          </button>
        ))}
      </div>

      {modal && (
        <Modal titulo="➕ Crear mi estado" onClose={() => setModal(false)} label="Crear estado de ánimo">
          <label htmlFor="neNombre">¿Cómo se llama tu estado?</label>
          <input id="neNombre" value={form.n} onChange={set('n')} placeholder="Ej: Sobrecargada, Necesito silencio…" />
          <label htmlFor="neExpr">Expresión de la caricatura</label>
          <select id="neExpr" value={form.expr} onChange={set('expr')}>
            {EXPRESIONES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <label htmlFor="neColor">Color</label>
          <select id="neColor" value={form.color} onChange={set('color')}>
            {COLORES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <label htmlFor="neAnim">Movimiento</label>
          <select id="neAnim" value={form.anim} onChange={set('anim')}>
            {ANIMACIONES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <label htmlFor="neMsj">Mensaje para quien lo vea (opcional)</label>
          <input id="neMsj" value={form.msj} onChange={set('msj')} placeholder="Ej: Por favor háblame despacio" />
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <div className={`carita ${form.anim}`} style={{ width: 90, height: 90 }}>
              <Carita expr={form.expr} color={form.color} />
            </div>
            <small className="nota">Así se verá tu caricatura ✨</small>
          </div>
          <button className="btn blq" onClick={crear}>Guardar estado</button>
        </Modal>
      )}
    </section>
  )
}
