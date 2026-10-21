import { useState } from 'react'
import Modal from '../components/Modal'
import { PROFESIONALES, TIPS, ESPECIALIDADES, MODALIDADES } from '../data/profesionales'
import { EMPRENDEDORES, CATEGORIAS_EMPRENDEDOR } from '../data/emprendedores'
import { useApp } from '../context/AppContext'
import { CREADORA, mailtoCreadora } from '../data/contacto'

export default function Profesionales() {
  const { toast } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ n: '', esp: ESPECIALIDADES[0], reg: '', modo: MODALIDADES[0], com: '', tip: '' })

  const [modalEmp, setModalEmp] = useState(false)
  const [formEmp, setFormEmp] = useState({ n: '', cat: CATEGORIAS_EMPRENDEDOR[0], contacto: '', com: '', modo: 'Envíos y retiro' })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setE = (k) => (e) => setFormEmp({ ...formEmp, [k]: e.target.value })

  // Las solicitudes no se publican solas: se envían por correo a la creadora,
  // que revisa los datos (y el registro en la Superintendencia) antes de publicar.
  const registrar = () => {
    if (!form.n.trim() || !form.reg.trim()) { toast('Completa tu nombre y número de registro'); return }
    window.location.href = mailtoCreadora(`Refugio · Solicitud de profesional: ${form.n.trim()}`, [
      'Hola, quiero ofrecer mis servicios en Refugio.',
      '',
      `Nombre: ${form.n.trim()}`,
      `Especialidad: ${form.esp}`,
      `N° de registro (Superintendencia de Salud): ${form.reg.trim()}`,
      `Modalidad: ${form.modo}`,
      `Comuna: ${form.com.trim() || '—'}`,
      `Tip para la comunidad: ${form.tip.trim() || '—'}`,
    ])
    setModal(false)
    setForm({ n: '', esp: ESPECIALIDADES[0], reg: '', modo: MODALIDADES[0], com: '', tip: '' })
    toast('📧 Envía el correo que se abrió. Tu perfil se publicará tras revisarlo.')
  }

  const registrarEmprendedor = () => {
    if (!formEmp.n.trim() || !formEmp.contacto.trim()) { toast('Completa el nombre y un contacto'); return }
    window.location.href = mailtoCreadora(`Refugio · Solicitud de tienda: ${formEmp.n.trim()}`, [
      'Hola, quiero publicar mi emprendimiento en Refugio.',
      '',
      `Emprendimiento: ${formEmp.n.trim()}`,
      `Qué ofrece: ${formEmp.cat}`,
      `Contacto: ${formEmp.contacto.trim()}`,
      `Comuna: ${formEmp.com.trim() || '—'}`,
      `Modalidad: ${formEmp.modo}`,
    ])
    setModalEmp(false)
    setFormEmp({ n: '', cat: CATEGORIAS_EMPRENDEDOR[0], contacto: '', com: '', modo: 'Envíos y retiro' })
    toast('📧 Envía el correo que se abrió. Tu tienda se publicará tras revisarla.')
  }

  const notaContacto = (
    <small className="nota">
      Al enviar se abrirá tu app de correo con los datos listos para enviar a {CREADORA.nombre}.
      Si no se abre, escribe directamente a <a href={`mailto:${CREADORA.correo}`}>{CREADORA.correo}</a>.
    </small>
  )

  return (
    <section className="view">
      <p className="eyebrow">Red de apoyo</p>
      <h2>Profesionales de la salud 🩺</h2>
      <p className="sub">Especialistas que ofrecen atención en salud mental y neurodivergencias. Los perfiles verificados acreditan su registro en la Superintendencia de Salud.</p>

      <div style={{ margin: '14px 0' }}>
        <button className="btn" onClick={() => setModal(true)}>🩺 Soy profesional: ofrecer mis servicios</button>
        <small className="nota">Los perfiles se publican después de que {CREADORA.nombre} revise la solicitud y el registro profesional.</small>
      </div>

      {PROFESIONALES.length === 0 && (
        <div className="card vacio">🌱 Aún no hay profesionales publicados. Si eres profesional de la salud, envía tu solicitud para ser la primera persona en aparecer.</div>
      )}
      <div className="grid2">
        {PROFESIONALES.map((p) => (
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
        <small className="nota">Las tiendas se publican después de que {CREADORA.nombre} revise la solicitud.</small>
      </div>

      {EMPRENDEDORES.length === 0 && (
        <div className="card vacio">🌱 Aún no hay tiendas publicadas. Si tienes un emprendimiento de material sensorial, envía tu solicitud.</div>
      )}
      <div className="grid2">
        {EMPRENDEDORES.map((x) => (
          <div key={x.id} className="card pro-card">
            <div className="avatar">{x.av}</div>
            <div>
              <h3>{x.n}</h3>
              <p>{x.cat}<br />📍 {x.com} · {x.modo}<br />✉️ {x.contacto}</p>
            </div>
          </div>
        ))}
      </div>

      {TIPS.length > 0 && (
        <>
          <h2 style={{ marginTop: 30 }}>Tips gratuitos 💡</h2>
          <div className="grid2">
            {TIPS.map((x) => (
              <div key={x.id} className="tip-card">💡 {x.t}<div className="autor">— {x.a}</div></div>
            ))}
          </div>
        </>
      )}

      {modal && (
        <Modal titulo="🩺 Solicitar aparecer como profesional" onClose={() => setModal(false)} label="Registro de profesional">
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
          <button className="btn blq" onClick={registrar}>📧 Enviar solicitud</button>
          <small className="nota">El registro será validado contra el Registro Nacional de Prestadores antes de publicar el perfil y mostrar la insignia de verificación.</small>
          {notaContacto}
        </Modal>
      )}

      {modalEmp && (
        <Modal titulo="🧸 Solicitar publicar mi tienda" onClose={() => setModalEmp(false)} label="Registro de emprendimiento sensorial">
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
          <button className="btn blq" onClick={registrarEmprendedor}>📧 Enviar solicitud</button>
          <small className="nota">Refugio no gestiona pagos ni envíos: el contacto y la compra son directamente con el emprendimiento.</small>
          {notaContacto}
        </Modal>
      )}
    </section>
  )
}
