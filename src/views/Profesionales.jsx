import { useState } from 'react'
import Modal from '../components/Modal'
import { PROS_INICIALES, TIPS_INICIALES, ESPECIALIDADES, MODALIDADES } from '../data/profesionales'
import { EMPRENDEDORES_INICIALES, CATEGORIAS_EMPRENDEDOR } from '../data/emprendedores'
import { useApp } from '../context/AppContext'

export default function Profesionales() {
  const { toast } = useApp()
  const [pros, setPros] = useState(PROS_INICIALES)
  const [tips, setTips] = useState(TIPS_INICIALES)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ n: '', esp: ESPECIALIDADES[0], reg: '', modo: MODALIDADES[0], com: '', tip: '' })

  const [emprendedores, setEmprendedores] = useState(EMPRENDEDORES_INICIALES)
  const [modalEmp, setModalEmp] = useState(false)
  const [formEmp, setFormEmp] = useState({ n: '', cat: CATEGORIAS_EMPRENDEDOR[0], contacto: '', com: '', modo: 'Envíos y retiro' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setE = (k) => (e) => setFormEmp({ ...formEmp, [k]: e.target.value })

  const registrar = () => {
    if (!form.n.trim() || !form.reg.trim()) { toast('Completa tu nombre y número de registro'); return }
    setPros([{ id: Date.now(), n: form.n.trim(), esp: form.esp, modo: form.modo, com: form.com.trim() || '—', ver: false, av: '🩺' }, ...pros])
    if (form.tip.trim()) setTips([{ id: Date.now(), t: form.tip.trim(), a: form.n.trim() }, ...tips])
    setModal(false)
    setForm({ n: '', esp: ESPECIALIDADES[0], reg: '', modo: MODALIDADES[0], com: '', tip: '' })
    toast('🩺 Perfil publicado (pendiente de verificación).')
  }

  const registrarEmprendedor = () => {
    if (!formEmp.n.trim() || !formEmp.contacto.trim()) { toast('Completa el nombre y un contacto'); return }
    setEmprendedores([{ id: Date.now(), n: formEmp.n.trim(), cat: formEmp.cat, contacto: formEmp.contacto.trim(), com: formEmp.com.trim() || '—', modo: formEmp.modo, av: '🧸' }, ...emprendedores])
    setModalEmp(false)
    setFormEmp({ n: '', cat: CATEGORIAS_EMPRENDEDOR[0], contacto: '', com: '', modo: 'Envíos y retiro' })
    toast('🧸 ¡Gracias! Tu emprendimiento fue publicado.')
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

      <h2 style={{ marginTop: 30 }}>Emprendedores de material sensorial 🧸</h2>
      <p className="sub">Tiendas y emprendimientos que venden juguetes sensoriales, fidgets, mantas con peso, audífonos y más.</p>

      <div style={{ margin: '14px 0' }}>
        <button className="btn azul" onClick={() => setModalEmp(true)}>🧸 Tengo un emprendimiento: publicar mi tienda</button>
      </div>

      <div className="grid2">
        {emprendedores.map((x) => (
          <div key={x.id} className="card pro-card">
            <div className="avatar">{x.av}</div>
            <div>
              <h3>{x.n}</h3>
              <p>{x.cat}<br />📍 {x.com} · {x.modo}<br />✉️ {x.contacto}</p>
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

      {modalEmp && (
        <Modal titulo="🧸 Publicar mi emprendimiento" onClose={() => setModalEmp(false)} label="Registro de emprendimiento sensorial">
          <label htmlFor="empNombre">Nombre del emprendimiento</label>
          <input id="empNombre" value={formEmp.n} onChange={setE('n')} placeholder="Ej: Sensorial Kids CL" />
          <label htmlFor="empCat">¿Qué ofreces?</label>
          <select id="empCat" value={formEmp.cat} onChange={setE('cat')}>
            {CATEGORIAS_EMPRENDEDOR.map((c) => <option key={c}>{c}</option>)}
          </select>
          <label htmlFor="empContacto">Contacto (Instagram, WhatsApp o web)</label>
          <input id="empContacto" value={formEmp.contacto} onChange={setE('contacto')} placeholder="Ej: @sensorialkids.cl" />
          <label htmlFor="empComuna">Comuna</label>
          <input id="empComuna" value={formEmp.com} onChange={setE('com')} placeholder="Ej: Concepción" />
          <label htmlFor="empModo">Modalidad</label>
          <select id="empModo" value={formEmp.modo} onChange={setE('modo')}>
            <option>Envíos a todo Chile</option>
            <option>Envíos y retiro</option>
            <option>Solo retiro en persona</option>
            <option>Tienda física</option>
          </select>
          <button className="btn blq" onClick={registrarEmprendedor}>Publicar emprendimiento</button>
          <small className="nota">Refugio no gestiona pagos ni envíos: el contacto y la compra son directamente con el emprendimiento.</small>
        </Modal>
      )}
    </section>
  )
}
