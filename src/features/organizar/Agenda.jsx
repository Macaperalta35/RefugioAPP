import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { MESES, DIAS_CORTOS, isoLocal, desdeIso, sumarDias, fechaLarga, celdasDelMes } from '../../lib/fechas'
import { CATEGORIAS_EVENTO } from '../../data/organizar'
import { nuevoId } from '../../lib/id'

const CAT = Object.fromEntries(CATEGORIAS_EVENTO.map((c) => [c.id, c]))
const porHora = (a, b) => (a.hora || '99:99').localeCompare(b.hora || '99:99')
const mayuscula = (t) => t.charAt(0).toUpperCase() + t.slice(1)

export default function Agenda({ toast }) {
  const [eventos, setEventos] = useLocalStorage('agenda', [])
  const hoy = isoLocal()
  const [vista, setVista] = useState('dia') // 'anio' | 'mes' | 'dia'
  const [fecha, setFecha] = useState(hoy)
  const d = desdeIso(fecha)
  const anio = d.getFullYear(), mes = d.getMonth()

  const [titulo, setTitulo] = useState('')
  const [hora, setHora] = useState('')
  const [cat, setCat] = useState('personal')

  const delDia = (iso) => eventos.filter((e) => e.fecha === iso)
  const irADia = (iso) => { setFecha(iso); setVista('dia') }

  const agregar = (e) => {
    e.preventDefault()
    if (!titulo.trim()) { toast('Escribe qué tienes que hacer'); return }
    setEventos([...eventos, { id: nuevoId(), fecha, hora, titulo: titulo.trim(), cat, hecho: false }])
    setTitulo(''); setHora('')
  }
  const alternar = (id) => {
    const nuevos = eventos.map((e) => (e.id === id ? { ...e, hecho: !e.hecho } : e))
    setEventos(nuevos)
    const delHoy = nuevos.filter((e) => e.fecha === fecha)
    if (delHoy.length && delHoy.every((e) => e.hecho) && !eventos.find((e) => e.id === id).hecho) toast('🎉 ¡Completaste todo lo del día!')
  }
  const borrar = (id) => setEventos(eventos.filter((e) => e.id !== id))

  const mover = (n) => {
    if (vista === 'dia') setFecha(sumarDias(fecha, n))
    else if (vista === 'mes') setFecha(isoLocal(new Date(anio, mes + n, 1)))
    else setFecha(isoLocal(new Date(anio + n, mes, 1)))
  }
  const tituloVista = vista === 'dia' ? mayuscula(fechaLarga(fecha)) : vista === 'mes' ? `${MESES[mes]} ${anio}` : String(anio)

  return (
    <div className="agenda">
      <div className="segmentos" role="tablist" aria-label="Vista de la agenda">
        {[['anio', 'Año'], ['mes', 'Mes'], ['dia', 'Día']].map(([id, t]) => (
          <button key={id} role="tab" aria-selected={vista === id} className={vista === id ? 'on' : ''} onClick={() => setVista(id)}>{t}</button>
        ))}
      </div>

      <div className="agenda-nav">
        <button className="btn sec" onClick={() => mover(-1)} aria-label="Anterior">‹</button>
        <h3>{tituloVista}</h3>
        <button className="btn sec" onClick={() => mover(1)} aria-label="Siguiente">›</button>
      </div>
      {fecha !== hoy && <button className="link-btn agenda-hoy" onClick={() => setFecha(hoy)}>Volver a hoy</button>}

      {vista === 'anio' && (
        <div className="agenda-anio">
          {MESES.map((m, i) => {
            const prefijo = `${anio}-${String(i + 1).padStart(2, '0')}`
            const n = eventos.filter((e) => e.fecha.startsWith(prefijo)).length
            const actual = hoy.startsWith(prefijo)
            return (
              <button key={m} className={`agenda-mes-btn ${actual ? 'actual' : ''}`} onClick={() => { setFecha(`${prefijo}-01`); setVista('mes') }}>
                <b>{m}</b><span>{n ? `${n} ${n === 1 ? 'evento' : 'eventos'}` : '—'}</span>
              </button>
            )
          })}
        </div>
      )}

      {vista === 'mes' && (
        <div className="agenda-mes" role="grid" aria-label={`${MESES[mes]} ${anio}`}>
          {DIAS_CORTOS.map((x) => <span key={x} className="agenda-dsem">{x}</span>)}
          {celdasDelMes(anio, mes).map((iso, i) => {
            if (!iso) return <span key={`v${i}`} />
            const evs = delDia(iso)
            return (
              <button key={iso} className={`agenda-dia ${iso === hoy ? 'hoy' : ''}`} onClick={() => irADia(iso)}
                aria-label={`${fechaLarga(iso)}${evs.length ? `, ${evs.length} eventos` : ''}`}>
                <b>{Number(iso.slice(8))}</b>
                <span className="agenda-puntos">{evs.slice(0, 3).map((e) => <i key={e.id}>{CAT[e.cat]?.ic}</i>)}</span>
              </button>
            )
          })}
        </div>
      )}

      {vista === 'dia' && (
        <>
          <ul className="lista-check">
            {delDia(fecha).sort(porHora).map((e) => (
              <li key={e.id} className={e.hecho ? 'hecho' : ''}>
                <label>
                  <input type="checkbox" checked={e.hecho} onChange={() => alternar(e.id)} />
                  <span>{CAT[e.cat]?.ic} {e.hora && <b>{e.hora}</b>} {e.titulo}</span>
                </label>
                <button className="cerrar" onClick={() => borrar(e.id)} aria-label={`Borrar ${e.titulo}`}>✕</button>
              </li>
            ))}
            {delDia(fecha).length === 0 && <li className="vacio">Nada anotado para este día.</li>}
          </ul>

          <form className="card org-form" onSubmit={agregar}>
            <label htmlFor="agTitulo">Agregar a este día</label>
            <input id="agTitulo" value={titulo} maxLength={80} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Control con la psicóloga" />
            <div className="org-fila">
              <input id="agHora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} aria-label="Hora (opcional)" />
              <button type="submit" className="btn">➕ Agregar</button>
            </div>
            <div className="frases" role="radiogroup" aria-label="Categoría">
              {CATEGORIAS_EVENTO.map((c) => (
                <button key={c.id} type="button" role="radio" aria-checked={cat === c.id} className={`chipf ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>{c.ic} {c.t}</button>
              ))}
            </div>
          </form>
        </>
      )}
    </div>
  )
}
