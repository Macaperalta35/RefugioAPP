import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useCerrarConAtras } from '../hooks/useCerrarConAtras'
import { vozDisponible, hablar, callar } from '../features/voz'
import Carita from './Carita'

/** Pantalla completa para mostrar un estado de ánimo o mensaje de pictogramas */
export default function FullScreenEstado() {
  const { fullScreen, setFullScreen } = useApp()
  if (!fullScreen) return null
  return <Contenido datos={fullScreen} cerrar={() => setFullScreen(null)} />
}

function Contenido({ datos, cerrar }) {
  const cajaRef = useRef(null)
  useCerrarConAtras(cerrar)

  useEffect(() => {
    const previo = document.activeElement
    cajaRef.current?.focus()
    return () => { callar(); if (previo?.isConnected) previo.focus() }
  }, [])

  const esPictos = datos.tipo === 'pictos'
  const texto = esPictos
    ? datos.items.map((i) => i[1]).join(', ')
    : [datos.estado.n, datos.estado.msj].filter(Boolean).join('. ')

  const botonVoz = vozDisponible && (
    <button className="btn sec btn-voz" onClick={(e) => { e.stopPropagation(); hablar(texto) }}>
      🔊 Leer en voz alta
    </button>
  )

  if (esPictos) {
    return (
      <div className="full-estado" style={{ background: 'linear-gradient(160deg,#7FA792,#B7A9D6)' }} ref={cajaRef} tabIndex={-1}
        onClick={cerrar} role="dialog" aria-modal="true" aria-label="Mensaje con pictogramas en pantalla completa">
        <div className="picto-full">{datos.items.map((i) => i[0]).join(' ')}</div>
        <h2>{datos.items.map((i) => i[1]).join(' · ')}</h2>
        {botonVoz}
        <p style={{ fontSize: '.8rem', opacity: .75 }}>Toca la pantalla para volver</p>
      </div>
    )
  }

  const e = datos.estado
  return (
    <div className="full-estado" style={{ background: `linear-gradient(160deg,${e.color},#2F5347)` }} ref={cajaRef} tabIndex={-1}
      onClick={cerrar} role="dialog" aria-modal="true" aria-label="Estado de ánimo en pantalla completa">
      <div className={`carita ${e.anim}`}><Carita expr={e.expr} color={e.color} /></div>
      <h2>{e.n}</h2>
      {e.msj && <p>{e.msj}</p>}
      {botonVoz}
      <p style={{ fontSize: '.8rem', opacity: .75 }}>Toca la pantalla para volver</p>
    </div>
  )
}
