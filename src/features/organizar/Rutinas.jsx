import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { isoLocal, sumarDias } from '../../lib/fechas'
import { PLANTILLAS_RUTINA } from '../../data/organizar'
import { nuevoId } from '../../lib/id'

const DIAS_HISTORIAL = 14

const desdePlantilla = (p) => ({
  id: nuevoId(), nombre: p.nombre, ic: p.ic,
  pasos: p.pasos.map(([texto, min]) => ({ id: nuevoId(), texto, min })),
})

function Rutina({ rutina, hechos, onMarcar, onCambiar, onBorrar, onReiniciar }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState('')
  const [min, setMin] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const total = rutina.pasos.length
  const listos = rutina.pasos.filter((p) => hechos.includes(p.id)).length
  const minutos = rutina.pasos.reduce((s, p) => s + (Number(p.min) || 0), 0)
  const completa = total > 0 && listos === total

  const agregarPaso = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    onCambiar({ ...rutina, pasos: [...rutina.pasos, { id: nuevoId(), texto: texto.trim(), min: Number(min) || 0 }] })
    setTexto(''); setMin('')
  }
  const moverPaso = (i, n) => {
    const pasos = [...rutina.pasos]
    const j = i + n
    if (j < 0 || j >= pasos.length) return
    ;[pasos[i], pasos[j]] = [pasos[j], pasos[i]]
    onCambiar({ ...rutina, pasos })
  }

  return (
    <section className={`card rutina ${completa ? 'completa' : ''}`}>
      <div className="rutina-cab">
        <h3>{rutina.ic} {rutina.nombre}</h3>
        <button className="link-btn" onClick={() => { setEditando(!editando); setConfirmando(false) }}>{editando ? 'Listo' : '✏️ Editar'}</button>
      </div>
      <p className="rutina-avance">{completa ? '🎉 ¡Rutina completa por hoy!' : `${listos} de ${total} pasos`}{minutos ? ` · ~${minutos} min` : ''}</p>
      <div className="barra" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={listos} aria-label={`Avance de ${rutina.nombre}`}>
        <i style={{ width: total ? `${(listos / total) * 100}%` : 0 }} />
      </div>

      {editando ? (
        <>
          <label htmlFor={`rn-${rutina.id}`}>Nombre</label>
          <input id={`rn-${rutina.id}`} value={rutina.nombre} maxLength={40} onChange={(e) => onCambiar({ ...rutina, nombre: e.target.value })} />
          <ul className="lista-check editable">
            {rutina.pasos.map((p, i) => (
              <li key={p.id}>
                <span>{p.texto}{p.min ? <small> · {p.min} min</small> : null}</span>
                <span className="paso-acciones">
                  <button className="cerrar" onClick={() => moverPaso(i, -1)} aria-label={`Subir ${p.texto}`} disabled={i === 0}>↑</button>
                  <button className="cerrar" onClick={() => moverPaso(i, 1)} aria-label={`Bajar ${p.texto}`} disabled={i === rutina.pasos.length - 1}>↓</button>
                  <button className="cerrar" onClick={() => onCambiar({ ...rutina, pasos: rutina.pasos.filter((x) => x.id !== p.id) })} aria-label={`Quitar ${p.texto}`}>✕</button>
                </span>
              </li>
            ))}
          </ul>
          <form className="org-fila" onSubmit={agregarPaso}>
            <input value={texto} maxLength={60} onChange={(e) => setTexto(e.target.value)} placeholder="Nuevo paso. Ej: Hacer la cama" aria-label="Nuevo paso" />
            <input type="number" min="0" max="240" value={min} onChange={(e) => setMin(e.target.value)} placeholder="min" aria-label="Minutos (opcional)" className="org-min" />
            <button type="submit" className="btn sec" aria-label="Agregar paso">➕</button>
          </form>
          {!confirmando
            ? <button className="btn sec blq" onClick={() => setConfirmando(true)}>🗑️ Borrar rutina</button>
            : (
              <>
                <p className="nota">¿Borrar «{rutina.nombre}»?</p>
                <button className="btn rojo blq" onClick={onBorrar}>Sí, borrar</button>
                <button className="btn sec blq" onClick={() => setConfirmando(false)}>Cancelar</button>
              </>
            )}
        </>
      ) : (
        <>
          <ul className="lista-check">
            {rutina.pasos.map((p) => (
              <li key={p.id} className={hechos.includes(p.id) ? 'hecho' : ''}>
                <label>
                  <input type="checkbox" checked={hechos.includes(p.id)} onChange={() => onMarcar(p.id)} />
                  <span>{p.texto}{p.min ? <small> · {p.min} min</small> : null}</span>
                </label>
              </li>
            ))}
            {total === 0 && <li className="vacio">Toca «Editar» para agregar pasos.</li>}
          </ul>
          {listos > 0 && <button className="link-btn" onClick={onReiniciar}>Desmarcar todo</button>}
        </>
      )}
    </section>
  )
}

export default function Rutinas({ toast }) {
  const [rutinas, setRutinas] = useLocalStorage('rutinas', [])
  const [registro, setRegistro] = useLocalStorage('rutinas-hechas', {}) // { 'YYYY-MM-DD': [idPaso, …] }
  const hoy = isoLocal()
  const hechosHoy = registro[hoy] || []

  // Guarda solo los últimos días: las marcas de hoy no se arrastran a mañana
  const guardarHoy = (ids) => {
    const limite = sumarDias(hoy, -DIAS_HISTORIAL)
    const recientes = Object.fromEntries(Object.entries(registro).filter(([f]) => f > limite))
    setRegistro({ ...recientes, [hoy]: ids })
  }

  const marcar = (rutina, idPaso) => {
    const yaHecho = hechosHoy.includes(idPaso)
    const ids = yaHecho ? hechosHoy.filter((x) => x !== idPaso) : [...hechosHoy, idPaso]
    guardarHoy(ids)
    if (!yaHecho && rutina.pasos.every((p) => ids.includes(p.id))) toast(`🎉 ¡Terminaste «${rutina.nombre}»!`)
  }

  const cambiar = (r) => setRutinas(rutinas.map((x) => (x.id === r.id ? r : x)))
  const agregar = (r) => setRutinas([...rutinas, r])
  const usadas = rutinas.map((r) => r.nombre)

  return (
    <div className="rutinas">
      <p className="sub" style={{ fontSize: '.9rem' }}>
        Pasos cortos y siempre en el mismo orden. Las marcas se reinician cada día.
      </p>
      {rutinas.map((r) => (
        <Rutina key={r.id} rutina={r} hechos={hechosHoy}
          onMarcar={(id) => marcar(r, id)} onCambiar={cambiar}
          onBorrar={() => setRutinas(rutinas.filter((x) => x.id !== r.id))}
          onReiniciar={() => guardarHoy(hechosHoy.filter((id) => !r.pasos.some((p) => p.id === id)))} />
      ))}

      <div className="card org-plantillas">
        <h3>➕ Agregar una rutina</h3>
        <div className="frases">
          {PLANTILLAS_RUTINA.filter((p) => !usadas.includes(p.nombre)).map((p) => (
            <button key={p.nombre} className="chipf" onClick={() => agregar(desdePlantilla(p))}>{p.ic} {p.nombre}</button>
          ))}
          <button className="chipf" onClick={() => agregar({ id: nuevoId(), nombre: 'Mi rutina', ic: '⭐', pasos: [] })}>⭐ Rutina en blanco</button>
        </div>
      </div>
    </div>
  )
}
