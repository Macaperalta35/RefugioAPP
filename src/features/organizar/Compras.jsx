import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { CATEGORIAS_COMPRA } from '../../data/organizar'
import { nuevoId } from '../../lib/id'

/** Texto de lo que falta comprar, agrupado, para pegar en WhatsApp o en una nota */
export const textoLista = (items) => {
  const pendientes = items.filter((i) => !i.hecho)
  const grupos = CATEGORIAS_COMPRA
    .map((c) => [c, pendientes.filter((i) => i.cat === c.id)])
    .filter(([, lista]) => lista.length)
  return ['🛒 Lista de compras', ...grupos.flatMap(([c, lista]) => ['', `${c.ic} ${c.t}`, ...lista.map((i) => `- ${i.texto}`)])].join('\n')
}

export default function Compras({ toast }) {
  const [items, setItems] = useLocalStorage('compras', [])
  const [texto, setTexto] = useState('')
  const [cat, setCat] = useState('otros')
  const [confirmando, setConfirmando] = useState(false)
  const comprados = items.filter((i) => i.hecho).length
  const pendientes = items.length - comprados

  const agregar = (e) => {
    e.preventDefault()
    const t = texto.trim()
    if (!t) return
    if (items.some((i) => !i.hecho && i.texto.toLowerCase() === t.toLowerCase())) { toast('Ya está en la lista'); return }
    setItems([...items, { id: nuevoId(), texto: t, cat, hecho: false }])
    setTexto('')
  }
  const alternar = (id) => setItems(items.map((i) => (i.id === id ? { ...i, hecho: !i.hecho } : i)))

  const copiar = async () => {
    const t = textoLista(items)
    try { await navigator.clipboard.writeText(t); toast('📋 Lista copiada. Pégala en WhatsApp o en una nota.') }
    catch { toast('No se pudo copiar en este navegador') }
  }

  return (
    <div className="compras">
      <form className="card org-form" onSubmit={agregar}>
        <label htmlFor="coTexto">¿Qué necesitas comprar?</label>
        <div className="org-fila">
          <input id="coTexto" value={texto} maxLength={60} onChange={(e) => setTexto(e.target.value)} placeholder="Ej: Leche" />
          <button type="submit" className="btn">➕</button>
        </div>
        <div className="frases" role="radiogroup" aria-label="Categoría">
          {CATEGORIAS_COMPRA.map((c) => (
            <button key={c.id} type="button" role="radio" aria-checked={cat === c.id} className={`chipf ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>{c.ic} {c.t}</button>
          ))}
        </div>
      </form>

      {items.length === 0 && <p className="card vacio">Tu lista está vacía. Agrega lo primero que recuerdes.</p>}
      {items.length > 0 && <p className="rutina-avance">{pendientes} por comprar · {comprados} en el carro</p>}

      {CATEGORIAS_COMPRA.map((c) => {
        const lista = items.filter((i) => i.cat === c.id).sort((a, b) => Number(a.hecho) - Number(b.hecho))
        if (!lista.length) return null
        return (
          <section key={c.id} className="compras-grupo">
            <h4>{c.ic} {c.t}</h4>
            <ul className="lista-check">
              {lista.map((i) => (
                <li key={i.id} className={i.hecho ? 'hecho' : ''}>
                  <label>
                    <input type="checkbox" checked={i.hecho} onChange={() => alternar(i.id)} />
                    <span>{i.texto}</span>
                  </label>
                  <button className="cerrar" onClick={() => setItems(items.filter((x) => x.id !== i.id))} aria-label={`Quitar ${i.texto}`}>✕</button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      {items.length > 0 && (
        <div className="compras-acciones">
          {pendientes > 0 && <button className="btn" onClick={copiar}>📋 Copiar lista</button>}
          {comprados > 0 && <button className="btn sec" onClick={() => setItems(items.filter((i) => !i.hecho))}>🧹 Quitar lo comprado ({comprados})</button>}
          {!confirmando
            ? <button className="link-btn" onClick={() => setConfirmando(true)}>Vaciar la lista</button>
            : (
              <span className="nota">¿Vaciar toda la lista?{' '}
                <button className="link-btn" onClick={() => { setItems([]); setConfirmando(false) }}>Sí, vaciar</button>{' · '}
                <button className="link-btn" onClick={() => setConfirmando(false)}>Cancelar</button>
              </span>
            )}
        </div>
      )}
    </div>
  )
}
