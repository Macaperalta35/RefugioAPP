import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'
import ListaFrases from '../components/ListaFrases'
import { useCerrarConAtras } from '../hooks/useCerrarConAtras'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { vozDisponible, hablar, callar } from './voz'
import { EMERGENCIA } from '../data/lineas'
import { AYUDA_SUGERIDA, EVITAR_SUGERIDO, TARJETA_VACIA } from '../data/tarjeta'

/** La tarjeta se guarda solo en este dispositivo (null = aún no creada) */
export const useTarjeta = () => useLocalStorage('tarjeta-crisis', null)

export function TarjetaEditor({ inicial, onGuardar, onEliminar, onClose }) {
  const [t, setT] = useState(() => ({ ...TARJETA_VACIA, ...inicial }))
  const [error, setError] = useState('')
  const [confirmandoBorrar, setConfirmandoBorrar] = useState(false)
  const set = (k) => (e) => setT({ ...t, [k]: e.target.value })

  const guardar = () => {
    if (!t.mensaje.trim()) { setError('Escribe qué te está pasando, es lo primero que verá la otra persona.'); return }
    onGuardar({
      ...t,
      nombre: t.nombre.trim(), mensaje: t.mensaje.trim(), condicion: t.condicion.trim(), medico: t.medico.trim(),
      contactoNombre: t.contactoNombre.trim(), contactoFono: t.contactoFono.trim(),
    })
  }

  return (
    <Modal titulo="🪪 Mi tarjeta de crisis" onClose={onClose} label="Editar tarjeta de crisis">
      <p className="sub" style={{ fontSize: '.9rem' }}>
        Prepárala con calma. En una crisis la muestras en pantalla completa a quien esté contigo.
      </p>

      <label htmlFor="tcMensaje">¿Qué te pasa? (lo primero que leerán)</label>
      <textarea id="tcMensaje" rows={3} maxLength={200} value={t.mensaje} onChange={set('mensaje')} />
      {error && <small className="nota" role="alert" style={{ color: 'var(--sos)' }}>{error}</small>}

      <label htmlFor="tcNombre">Tu nombre (opcional)</label>
      <input id="tcNombre" value={t.nombre} maxLength={60} onChange={set('nombre')} placeholder="Ej: Maca" />

      <label htmlFor="tcCondicion">Condición o diagnóstico (opcional)</label>
      <input id="tcCondicion" value={t.condicion} maxLength={100} onChange={set('condicion')} placeholder="Ej: Soy autista · Tengo trastorno de pánico" />

      <ListaFrases id="tcAyudaNueva" titulo="✅ Lo que me ayuda" sugeridas={AYUDA_SUGERIDA}
        valor={t.ayuda} onChange={(ayuda) => setT({ ...t, ayuda })} placeholder="Agregar otra cosa que te ayuda" />
      <ListaFrases id="tcEvitarNueva" titulo="🚫 Por favor, no" sugeridas={EVITAR_SUGERIDO}
        valor={t.evitar} onChange={(evitar) => setT({ ...t, evitar })} placeholder="Agregar otra cosa que evitar" />

      <label htmlFor="tcMedico">Información médica importante (opcional)</label>
      <textarea id="tcMedico" rows={2} maxLength={200} value={t.medico} onChange={set('medico')} placeholder="Ej: Alergia a la penicilina · Tomo sertralina" />

      <label htmlFor="tcContacto">Contacto de emergencia</label>
      <input id="tcContacto" value={t.contactoNombre} maxLength={60} onChange={set('contactoNombre')} placeholder="Nombre. Ej: Mamá" />
      <input id="tcFono" type="tel" value={t.contactoFono} maxLength={20} onChange={set('contactoFono')}
        placeholder="Teléfono. Ej: +56912345678" aria-label="Teléfono del contacto de emergencia" style={{ marginTop: 8 }} />

      <button className="btn blq" onClick={guardar}>💾 Guardar tarjeta</button>
      {onEliminar && !confirmandoBorrar && (
        <button className="btn sec blq" onClick={() => setConfirmandoBorrar(true)}>🗑️ Borrar tarjeta</button>
      )}
      {confirmandoBorrar && (
        <>
          <p className="sub" style={{ fontSize: '.9rem', marginTop: 12 }}>¿Seguro? La tarjeta se borrará de este dispositivo.</p>
          <button className="btn rojo blq" onClick={onEliminar}>Sí, borrar tarjeta</button>
          <button className="btn sec blq" onClick={() => setConfirmandoBorrar(false)}>Cancelar</button>
        </>
      )}
      <small className="nota">Se guarda solo en este dispositivo y nunca se envía a Refugio.</small>
    </Modal>
  )
}

/** Texto plano de la tarjeta para leerla en voz alta (cada parte termina en punto para que la voz haga pausa) */
const conPunto = (f) => (/[.!?]$/.test(f) ? f : `${f}.`)
const textoTarjeta = (t) => [
  conPunto(t.mensaje),
  t.nombre && `Me llamo ${t.nombre}.`,
  t.condicion && conPunto(t.condicion),
  t.ayuda.length && `Lo que me ayuda: ${t.ayuda.join('. ')}.`,
  t.evitar.length && `Por favor, no: ${t.evitar.map((f) => f.replace(/^No /, '')).join('. ')}.`,
  t.contactoNombre && `Si puedes, llama a ${t.contactoNombre}.`,
].filter(Boolean).join(' ')

/** Pantalla completa para mostrar la tarjeta a otra persona */
export function TarjetaVista({ tarjeta: t, onClose }) {
  const cajaRef = useRef(null)
  useCerrarConAtras(onClose)

  useEffect(() => {
    const previo = document.activeElement
    cajaRef.current?.focus()
    return () => { callar(); if (previo?.isConnected) previo.focus() }
  }, [])

  const fono = t.contactoFono.replace(/[^\d+]/g, '')

  return (
    <div className="tarjeta-full" role="dialog" aria-modal="true" aria-label="Tarjeta de crisis" ref={cajaRef} tabIndex={-1}>
      <div className="tarjeta-hoja">
        <div className="tarjeta-cab">
          <span>🪪 Tarjeta de crisis</span>
          <button className="cerrar" onClick={onClose} aria-label="Cerrar tarjeta">✕</button>
        </div>

        <p className="tarjeta-mensaje">{t.mensaje}</p>
        {(t.nombre || t.condicion) && (
          <p className="tarjeta-quien">{[t.nombre && `Me llamo ${t.nombre}`, t.condicion].filter(Boolean).join(' · ')}</p>
        )}

        {t.ayuda.length > 0 && (
          <section className="tarjeta-bloque ayuda">
            <h3>✅ Lo que me ayuda</h3>
            <ul>{t.ayuda.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
        )}
        {t.evitar.length > 0 && (
          <section className="tarjeta-bloque evitar">
            <h3>🚫 Por favor, no</h3>
            <ul>{t.evitar.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
        )}
        {t.medico && (
          <section className="tarjeta-bloque medico">
            <h3>⚕️ Información médica</h3>
            <p>{t.medico}</p>
          </section>
        )}

        <div className="tarjeta-acciones">
          {fono && (
            <a className="btn blq" href={`tel:${fono}`}>📞 Llamar a {t.contactoNombre || 'mi contacto'}</a>
          )}
          <a className="btn rojo blq" href={`tel:${EMERGENCIA.tel}`}>🚑 Emergencia: {EMERGENCIA.tel} ({EMERGENCIA.nombre})</a>
          {vozDisponible && (
            <button className="btn sec blq" onClick={() => hablar(textoTarjeta(t))}>🔊 Leer en voz alta</button>
          )}
        </div>
      </div>
    </div>
  )
}

/** Bloque para crear, ver y editar la tarjeta (vista Mi estado) */
export function TarjetaSeccion({ toast }) {
  const [tarjeta, setTarjeta] = useTarjeta()
  const [editando, setEditando] = useState(false)
  const [viendo, setViendo] = useState(false)

  const guardar = (t) => {
    setTarjeta(t)
    setEditando(false)
    toast('🪪 Tarjeta guardada. También la encuentras en Inicio.')
  }
  const eliminar = () => {
    setTarjeta(null)
    setEditando(false)
    toast('🗑️ Tarjeta borrada de este dispositivo')
  }

  return (
    <>
      <div className="card tarjeta-resumen">
        <h3>🪪 Mi tarjeta de crisis</h3>
        <p>
          {tarjeta
            ? 'Muéstrala en pantalla completa a quien esté contigo: dice qué te pasa, qué te ayuda y a quién llamar.'
            : 'Prepara una tarjeta para mostrar cuando no puedas explicar lo que te pasa: qué te ayuda, qué evitar y a quién llamar.'}
        </p>
        <div className="acciones">
          {tarjeta && <button className="btn" onClick={() => setViendo(true)}>👁️ Mostrar tarjeta</button>}
          <button className={`btn ${tarjeta ? 'sec' : ''}`} onClick={() => setEditando(true)}>
            {tarjeta ? '✏️ Editar' : '➕ Crear mi tarjeta'}
          </button>
        </div>
      </div>
      {/* Fuera de la .card para que no hereden sus estilos de párrafo */}
      {editando && (
        <TarjetaEditor inicial={tarjeta} onGuardar={guardar} onEliminar={tarjeta ? eliminar : null} onClose={() => setEditando(false)} />
      )}
      {viendo && tarjeta && <TarjetaVista tarjeta={tarjeta} onClose={() => setViendo(false)} />}
    </>
  )
}
