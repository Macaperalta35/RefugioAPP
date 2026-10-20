import { useEffect, useRef } from 'react'
import { useCerrarConAtras } from '../hooks/useCerrarConAtras'

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ titulo, onClose, children, label }) {
  const cajaRef = useRef(null)
  useCerrarConAtras(onClose)

  // Llevar el foco al modal y devolverlo al botón que lo abrió al cerrar
  useEffect(() => {
    const previo = document.activeElement
    cajaRef.current?.focus()
    return () => { if (previo?.isConnected) previo.focus() }
  }, [])

  // Mantener el foco dentro del modal mientras está abierto (Tab / Shift+Tab)
  const atraparFoco = (e) => {
    if (e.key !== 'Tab') return
    const items = [...cajaRef.current.querySelectorAll(ENFOCABLES)]
    if (!items.length) return
    const primero = items[0], ultimo = items[items.length - 1]
    if (e.shiftKey && (document.activeElement === primero || document.activeElement === cajaRef.current)) {
      e.preventDefault(); ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primero.focus()
    }
  }

  return (
    <div className="modal-bg" role="dialog" aria-modal="true" aria-label={label || titulo}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" ref={cajaRef} tabIndex={-1} onKeyDown={atraparFoco}>
        <div className="modal-head">
          <h2>{titulo}</h2>
          <button className="cerrar" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
