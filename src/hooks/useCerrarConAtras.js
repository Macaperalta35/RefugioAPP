import { useEffect, useRef } from 'react'

// Cantidad de capas (modales / pantalla completa) abiertas. Permite pasar de un
// modal a otro (ej. "Necesito ayuda" → "Respirar") reutilizando la misma
// entrada del historial, sin que el botón atrás quede desfasado.
let abiertos = 0

/**
 * Hace que el botón "atrás" del celular y la tecla Esc cierren la capa
 * en vez de salir de la app.
 */
export function useCerrarConAtras(onClose) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    abiertos++
    if (!window.history.state?.capa) {
      window.history.pushState({ ...window.history.state, capa: true }, '')
    }

    const alVolver = () => onCloseRef.current()
    const alTeclear = (e) => { if (e.key === 'Escape') onCloseRef.current() }
    window.addEventListener('popstate', alVolver)
    window.addEventListener('keydown', alTeclear)

    return () => {
      abiertos--
      window.removeEventListener('popstate', alVolver)
      window.removeEventListener('keydown', alTeclear)
      // Cerrado con ✕ o Esc: quitar la entrada que agregamos, salvo que otra
      // capa se haya abierto en su lugar.
      setTimeout(() => {
        if (abiertos === 0 && window.history.state?.capa) window.history.back()
      }, 0)
    }
  }, [])
}
