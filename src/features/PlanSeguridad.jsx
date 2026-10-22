import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'
import ListaFrases from '../components/ListaFrases'
import { useCerrarConAtras } from '../hooks/useCerrarConAtras'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { LINEAS, EMERGENCIA } from '../data/lineas'
import { PASOS_PLAN, RAZONES_SUGERIDAS, PLAN_VACIO } from '../data/plan'

/** El plan se guarda solo en este dispositivo (null = aún no creado) */
export const usePlan = () => useLocalStorage('plan-seguridad', null)

const limpiarFono = (tel) => tel.replace(/[^\d+*#]/g, '')

/** Lista de contactos (nombre + teléfono) que se agregan y quitan */
function ListaContactos({ id, titulo, valor, onChange }) {
  const [nombre, setNombre] = useState('')
  const [tel, setTel] = useState('')
  const agregar = () => {
    if (!nombre.trim()) return
    onChange([...valor, { nombre: nombre.trim(), tel: tel.trim() }])
    setNombre(''); setTel('')
  }

  return (
    <fieldset className="opciones">
      <legend>{titulo}</legend>
      {valor.length > 0 && (
        <ul className="plan-contactos">
          {valor.map((c, i) => (
            <li key={`${c.nombre}-${i}`}>
              <span>{c.nombre}{c.tel && <small> · {c.tel}</small>}</span>
              <button type="button" className="cerrar" aria-label={`Quitar a ${c.nombre}`}
                onClick={() => onChange(valor.filter((_, k) => k !== i))}>✕</button>
            </li>
          ))}
        </ul>
      )}
      <div className="frase-nueva">
        <input id={`${id}Nombre`} value={nombre} maxLength={60} placeholder="Nombre. Ej: Mi hermana" aria-label={`Nombre: ${titulo}`}
          onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="frase-nueva">
        <input id={`${id}Tel`} type="tel" value={tel} maxLength={20} placeholder="Teléfono (opcional)" aria-label={`Teléfono: ${titulo}`}
          onChange={(e) => setTel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregar() } }} />
        <button type="button" className="btn sec" onClick={agregar} aria-label={`Agregar contacto: ${titulo}`}>➕</button>
      </div>
    </fieldset>
  )
}

const tieneContenido = (p) => Object.values(p).some((v) => Array.isArray(v) && v.length > 0)

export function PlanEditor({ inicial, onGuardar, onEliminar, onClose }) {
  const [p, setP] = useState(() => ({ ...PLAN_VACIO, ...inicial }))
  const [error, setError] = useState('')
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false)
  const set = (k) => (v) => setP({ ...p, [k]: v })

  const guardar = () => {
    if (!tieneContenido(p)) { setError('Completa al menos un paso para guardar tu plan.'); return }
    onGuardar(p)
  }

  return (
    <Modal titulo="📋 Mi plan de seguridad" onClose={onClose} label="Editar plan de seguridad">
      <p className="sub" style={{ fontSize: '.9rem' }}>
        Prepáralo en un momento de calma, idealmente junto a tu psicóloga/o o alguien de confianza.
        En una crisis, sigue los pasos en orden: si uno no basta, pasa al siguiente.
      </p>

      <ListaFrases id="plRazones" titulo="💚 Lo que más me importa" sugeridas={RAZONES_SUGERIDAS}
        valor={p.razones} onChange={set('razones')} placeholder="¿Qué hace que valga la pena seguir?" />

      {PASOS_PLAN.map((paso) => (
        <div key={paso.id} className="plan-editor-paso">
          <h3>Paso {paso.num} · {paso.ic} {paso.titulo}</h3>
          <p className="nota">{paso.pregunta}</p>
          {!paso.soloContactos && (
            <ListaFrases id={`pl-${paso.id}`} titulo={paso.contactos ? 'Lugares' : 'Escribe o elige'} sugeridas={paso.sugeridas}
              valor={p[paso.id]} onChange={set(paso.id)} placeholder="Agregar otra" />
          )}
          {(paso.contactos || paso.soloContactos) && (
            <ListaContactos id={`pl-${paso.id}C`} titulo={paso.contactos ? 'Personas' : 'Contactos'}
              valor={p[`${paso.id}Contactos`]} onChange={set(`${paso.id}Contactos`)} />
          )}
        </div>
      ))}

      {error && <small className="nota" role="alert" style={{ color: 'var(--sos)' }}>{error}</small>}
      <button className="btn blq" onClick={guardar}>💾 Guardar plan</button>
      {onEliminar && !confirmandoBorrar && (
        <button className="btn sec blq" onClick={() => setConfirmandoBorrar(true)}>🗑️ Borrar plan</button>
      )}
      {confirmandoBorrar && (
        <>
          <p className="sub" style={{ fontSize: '.9rem', marginTop: 12 }}>¿Seguro? El plan se borrará de este dispositivo.</p>
          <button className="btn rojo blq" onClick={onEliminar}>Sí, borrar plan</button>
          <button className="btn sec blq" onClick={() => setConfirmandoBorrar(false)}>Cancelar</button>
        </>
      )}
      <small className="nota">Se guarda solo en este dispositivo y nunca se envía a Refugio. No reemplaza la atención profesional.</small>
    </Modal>
  )
}

function Llamar({ nombre, tel, clase = 'sec' }) {
  const t = limpiarFono(tel || '')
  if (!t) return <li className="plan-persona"><span>{nombre}</span></li>
  return (
    <li className="plan-persona">
      <span>{nombre}</span>
      <a className={`btn ${clase}`} href={`tel:${t}`} aria-label={`Llamar a ${nombre}`}>📞 Llamar</a>
    </li>
  )
}

/** Pantalla completa para seguir el plan paso a paso */
export function PlanVista({ plan: p, onClose }) {
  const cajaRef = useRef(null)
  useCerrarConAtras(onClose)

  useEffect(() => {
    const previo = document.activeElement
    cajaRef.current?.focus()
    return () => { if (previo?.isConnected) previo.focus() }
  }, [])

  return (
    <div className="tarjeta-full" role="dialog" aria-modal="true" aria-label="Plan de seguridad" ref={cajaRef} tabIndex={-1}>
      <div className="tarjeta-hoja plan-hoja">
        <div className="tarjeta-cab">
          <span>📋 Mi plan de seguridad</span>
          <button className="cerrar" onClick={onClose} aria-label="Cerrar plan">✕</button>
        </div>
        <p className="plan-intro">Sigue los pasos en orden. Si uno no basta, pasa al siguiente.</p>

        {p.razones.length > 0 && (
          <section className="tarjeta-bloque plan-razones">
            <h3>💚 Lo que más me importa</h3>
            <ul>{p.razones.map((r) => <li key={r}>{r}</li>)}</ul>
          </section>
        )}

        {PASOS_PLAN.map((paso) => {
          const frases = paso.soloContactos ? [] : p[paso.id]
          const contactos = (paso.contactos || paso.soloContactos) ? p[`${paso.id}Contactos`] : []
          if (!frases.length && !contactos.length && !paso.lineas) return null
          return (
            <section key={paso.id} className="tarjeta-bloque plan-paso">
              <h3><span className="plan-num">{paso.num}</span> {paso.ic} {paso.titulo}</h3>
              {frases.length > 0 && <ul>{frases.map((f) => <li key={f}>{f}</li>)}</ul>}
              {contactos.length > 0 && (
                <ul className="plan-personas">{contactos.map((c, i) => <Llamar key={`${c.nombre}-${i}`} {...c} />)}</ul>
              )}
              {paso.lineas && (
                <ul className="plan-personas">
                  {LINEAS.map((l) => <Llamar key={l.tel} nombre={l.nombre} tel={l.tel} />)}
                  <Llamar nombre={`${EMERGENCIA.nombre} · emergencias`} tel={EMERGENCIA.tel} clase="rojo" />
                </ul>
              )}
            </section>
          )
        })}

        <div className="tarjeta-acciones">
          <a className="btn rojo blq" href={`tel:${EMERGENCIA.tel}`}>🚑 Si estoy en peligro: {EMERGENCIA.tel} ({EMERGENCIA.nombre})</a>
        </div>
      </div>
    </div>
  )
}

/** Bloque para crear, ver y editar el plan (vista Calma) */
export function PlanSeccion({ toast }) {
  const [plan, setPlan] = usePlan()
  const [editando, setEditando] = useState(false)
  const [viendo, setViendo] = useState(false)

  const guardar = (p) => {
    setPlan(p)
    setEditando(false)
    toast('📋 Plan guardado. También lo encuentras en «Necesito ayuda ahora».')
  }
  const eliminar = () => {
    setPlan(null)
    setEditando(false)
    toast('🗑️ Plan borrado de este dispositivo')
  }

  return (
    <>
      <div className="card tarjeta-resumen">
        <h3>📋 Mi plan de seguridad</h3>
        <p>
          {plan
            ? 'Tus pasos para atravesar una crisis: señales de alerta, qué te ayuda, a quién llamar y cómo cuidarte.'
            : 'Arma, con calma, los pasos que seguirás si llega una crisis: qué te ayuda, a quién llamar y cómo cuidarte. Se basa en un modelo clínico de prevención.'}
        </p>
        <div className="acciones">
          {plan && <button className="btn" onClick={() => setViendo(true)}>👁️ Ver mi plan</button>}
          <button className={`btn ${plan ? 'sec' : ''}`} onClick={() => setEditando(true)}>
            {plan ? '✏️ Editar' : '➕ Crear mi plan'}
          </button>
        </div>
      </div>
      {/* Fuera de la .card para que no hereden sus estilos de párrafo */}
      {editando && (
        <PlanEditor inicial={plan} onGuardar={guardar} onEliminar={plan ? eliminar : null} onClose={() => setEditando(false)} />
      )}
      {viendo && plan && <PlanVista plan={plan} onClose={() => setViendo(false)} />}
    </>
  )
}
