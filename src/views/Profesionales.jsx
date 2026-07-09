import { useState } from 'react'
import Modal from '../components/Modal'
import { PROS_INICIALES, TIPS_INICIALES, ESPECIALIDADES, MODALIDADES } from '../data/profesionales'
import { useApp } from '../context/AppContext'

export default function Profesionales() {
  const { toast } = useApp()
  const [pros, setPros] = useState(PROS_INICIALES)
  const [tips, setTips] = useState(TIPS_INICIALES)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ n: '', esp: ESPECIALIDADES[0], reg: '', modo: MODALIDADES[0], com: '', tip: '' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const registrar = () => {
    if (!form.n.trim() || !form.reg.trim()) { toast('Completa tu nombre y número de registro'); return }
    setPros([{ id: Date.now(), n: form.n.trim(), esp: form.esp, modo: form.modo, com: form.com.trim() || '—', ver: false, av: '🩺' }, ...pros])
    if (form.tip.trim()) setTips([{ id: Date.now(), t: form.tip.trim(), a: form.n.trim() }, ...tips])
    setModal(false)
    setForm({ n: '', esp: ESPECIALIDADES[0], reg: '', modo: MODALIDADES[0], com: '', tip: '' })
    toast('🩺 Perfil publicado (pendiente de verificación).')
  }

  return (
    <section className="view">
      <p className="eyebrow">Red de apoyo</p>
      <h2>Profesionales de la salud 🩺</h2>
      <p className="sub">Especialistas que ofrecen atención en salud mental y neurodivergencias. Los perfiles verificados acreditan su registro en la Superintendencia de Salud.</p>

      <div style={{ margin: '14px 0' }}>
        <button className="btn" onClick={() => setModal(true)}>🩺 Soy profesional: ofrecer mis servicios</button>
      </div>

      <div className="grid2">
        {pros.map((p) => (
          <div key={p.id} className="card pro-card">
            <div className="avatar">{p.av}</div>
            <div>
              <h3>{p.n} {p.ver && <span className="badge">✓ Verificado</span>}</h3>
              <p>{p.esp}<br />📍 {p.com} · {p.modo}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 30 }}>Tips gratuitos 💡</h2>
      <div className="grid2">
        {tips.map((x) => (
          <div key={x.id} className="tip-card">💡 {x.t}<div className="autor">— {x.a}</div></div>
        ))}
      </div>

      {modal && (
        <Modal titulo="🩺 Ofrecer mis servicios" onClose={() => setModal(false)} label="Registro de profesional">
          <label htmlFor="prNombre">Nombre completo</label>
          <input id="prNombre" value={form.n} onChange={set('n')} placeholder="Ej: Ps. Camila Fuentes" />
          <label htmlFor="prEsp">Especialidad</label>
          <select id="prEsp" value={form.esp} onChange={set('esp')}>
            {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
          </select>
          <label htmlFor="prReg">N° de registro (Superintendencia de Salud)</label>
          <input id="prReg" value={form.reg} onChange={set('reg')} placeholder="Ej: 123456" />
          <label htmlFor="prModo">Modalidad</label>
          <select id="prModo" value={form.modo} onChange={set('modo')}>
            {MODALIDADES.map((m) => <option key={m}>{m}</option>)}
          </select>
          <label htmlFor="prComuna">Comuna</label>
          <input id="prComuna" value={form.com} onChange={set('com')} placeholder="Ej: Concepción" />
          <label htmlFor="prTip">Comparte un tip gratuito (opcional)</label>
          <textarea id="prTip" rows={2} value={form.tip} onChange={set('tip')} placeholder="Un consejo breve para la comunidad…" />
          <button className="btn blq" onClick={registrar}>Publicar perfil</button>
          <small className="nota">El registro será validado contra el Registro Nacional de Prestadores antes de mostrar la insignia de verificación.</small>
        </Modal>
      )}
    </section>
  )
}
