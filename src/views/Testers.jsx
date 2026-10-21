import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CREADORA, mailtoCreadora } from '../data/contacto'

const VACIO = { nombre: '', correo: '', telefono: '', origen: '', acepta: false }
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Registro de testers para la prueba cerrada de Google Play (se envía por correo a la creadora) */
export default function Testers() {
  const { toast } = useApp()
  const [f, setF] = useState(VACIO)
  const [enviado, setEnviado] = useState(null) // texto del correo, para copiarlo si la app de correo no abre
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const lineas = (d) => [
    'Hola, quiero ser tester de Refugio en Google Play.',
    '',
    `Nombre: ${d.nombre}`,
    `Correo de Google (Gmail): ${d.correo}`,
    `Teléfono / versión de Android: ${d.telefono || '—'}`,
    `Cómo conocí Refugio: ${d.origen || '—'}`,
    '',
    'Acepto que usen este correo solo para invitarme a la prueba.',
  ]

  const enviar = (e) => {
    e.preventDefault()
    const d = { ...f, nombre: f.nombre.trim(), correo: f.correo.trim().toLowerCase(), telefono: f.telefono.trim(), origen: f.origen.trim() }
    if (!d.nombre) { toast('Escribe tu nombre'); return }
    if (!CORREO_VALIDO.test(d.correo)) { toast('Revisa tu correo de Google, parece incompleto'); return }
    if (!d.acepta) { toast('Marca la casilla para aceptar el uso de tu correo'); return }
    window.location.href = mailtoCreadora(`Refugio · Quiero ser tester: ${d.nombre}`, lineas(d))
    setEnviado(lineas(d).join('\n'))
  }

  const copiar = async () => {
    try { await navigator.clipboard.writeText(enviado); toast('📋 Copiado. Pégalo en un correo o DM.') }
    catch { toast('No se pudo copiar. Mantén presionado el texto para copiarlo.') }
  }

  if (enviado) {
    return (
      <section className="view">
        <p className="eyebrow">Prueba cerrada de Google Play</p>
        <h2>¡Gracias por sumarte! 💚</h2>
        <p className="sub">
          Se abrió tu app de correo con tus datos. <b>Toca «Enviar»</b> para completar el registro.
          Cuando la prueba comience te llegará un enlace de Google Play a tu Gmail.
        </p>
        <div className="card testers-fallback">
          <h3>¿No se abrió tu correo?</h3>
          <p>Copia este texto y envíalo a <b>{CREADORA.correo}</b> o por mensaje directo a <b>@{CREADORA.instagram}</b>.</p>
          <pre>{enviado}</pre>
          <button className="btn" onClick={copiar}>📋 Copiar texto</button>
        </div>
        <button className="btn sec" style={{ marginTop: 14 }} onClick={() => { setEnviado(null); setF(VACIO) }}>Registrar a otra persona</button>
      </section>
    )
  }

  return (
    <section className="view">
      <p className="eyebrow">Prueba cerrada de Google Play</p>
      <h2>Sé tester de Refugio 🧪</h2>
      <p className="sub">
        Antes de publicar Refugio en Google Play, Google pide que un grupo de personas la pruebe durante 14 días.
        Tu ayuda hace posible que la app llegue a quien la necesita.
      </p>

      <ul className="testers-requisitos">
        <li><span>📱</span>Un teléfono Android</li>
        <li><span>✉️</span>Una cuenta de Google (Gmail)</li>
        <li><span>🗓️</span>Mantener la app instalada 14 días. No hace falta usarla todos los días.</li>
        <li><span>💬</span>Contarnos qué te pareció</li>
      </ul>

      <form className="card testers-form" onSubmit={enviar} noValidate>
        <label htmlFor="tsNombre">Tu nombre</label>
        <input id="tsNombre" value={f.nombre} maxLength={60} onChange={set('nombre')} autoComplete="name" placeholder="Ej: Camila" />

        <label htmlFor="tsCorreo">Tu correo de Google (Gmail)</label>
        <input id="tsCorreo" type="email" inputMode="email" autoComplete="email" value={f.correo} maxLength={100}
          onChange={set('correo')} placeholder="tunombre@gmail.com" />
        <small className="nota">Debe ser el correo con el que usas Google Play en tu teléfono.</small>

        <label htmlFor="tsTelefono">Modelo de teléfono o versión de Android (opcional)</label>
        <input id="tsTelefono" value={f.telefono} maxLength={60} onChange={set('telefono')} placeholder="Ej: Samsung A14 · Android 14" />

        <label htmlFor="tsOrigen">¿Cómo conociste Refugio? (opcional)</label>
        <input id="tsOrigen" value={f.origen} maxLength={80} onChange={set('origen')} placeholder="Ej: Instagram, un amigo, el colegio…" />

        <label className="testers-acepto">
          <input type="checkbox" checked={f.acepta} onChange={set('acepta')} />
          <span>Acepto que usen mi correo solo para invitarme a la prueba de Refugio. Puedo pedir que lo borren cuando quiera.</span>
        </label>

        <button type="submit" className="btn blq">🧪 Quiero ser tester</button>
        <small className="nota">
          Se abrirá tu app de correo con los datos listos para enviar a {CREADORA.nombre}. Refugio no guarda tus datos en ningún servidor.
        </small>
      </form>
    </section>
  )
}
