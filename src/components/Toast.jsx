import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toastMsg } = useApp()
  // Región aria-live siempre presente para que los lectores de pantalla anuncien cada aviso
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  )
}
