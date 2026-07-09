import { useApp } from '../context/AppContext'
import Carita from './Carita'

/** Pantalla completa para mostrar un estado de ánimo o mensaje de pictogramas */
export default function FullScreenEstado() {
  const { fullScreen, setFullScreen } = useApp()
  if (!fullScreen) return null

  const cerrar = () => setFullScreen(null)

  if (fullScreen.tipo === 'pictos') {
    return (
      <div className="full-estado" style={{ background: 'linear-gradient(160deg,#7FA792,#B7A9D6)' }}
        onClick={cerrar} role="dialog" aria-label="Mensaje con pictogramas en pantalla completa">
        <div className="picto-full">{fullScreen.items.map((i) => i[0]).join(' ')}</div>
        <h2>{fullScreen.items.map((i) => i[1]).join(' · ')}</h2>
        <p style={{ fontSize: '.8rem', opacity: .75 }}>Toca la pantalla para volver</p>
      </div>
    )
  }

  const e = fullScreen.estado
  return (
    <div className="full-estado" style={{ background: `linear-gradient(160deg,${e.color},#2F5347)` }}
      onClick={cerrar} role="dialog" aria-label="Estado de ánimo en pantalla completa">
      <div className={`carita ${e.anim}`}><Carita expr={e.expr} color={e.color} /></div>
      <h2>{e.n}</h2>
      {e.msj && <p>{e.msj}</p>}
      <p style={{ fontSize: '.8rem', opacity: .75 }}>Toca la pantalla para volver</p>
    </div>
  )
}
