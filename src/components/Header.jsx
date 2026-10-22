import { useApp } from '../context/AppContext'
import logo from '../assets/refugio-isotipo.svg'

export default function Header() {
  const { theme, toggleTheme, bajoEstimulo, toggleBajoEstimulo, toast } = useApp()

  const alternarEstimulo = () => {
    toggleBajoEstimulo()
    toast(bajoEstimulo
      ? 'Modo bajo estímulo desactivado'
      : '🎚️ Modo bajo estímulo activado')
  }
  return (
    <header className="top">
      <div className="logo"><img src={logo} alt="" className="hoja" width="34" height="34" /> Refugio</div>
      <div className="top-acciones">
      <button className={`theme-btn estimulo-btn ${bajoEstimulo ? 'on' : ''}`} onClick={alternarEstimulo}
        aria-pressed={bajoEstimulo} aria-label="Modo bajo estímulo" title="Modo bajo estímulo">
        🎚️<span className="estimulo-txt"> Bajo estímulo</span>
      </button>
      <button className="theme-btn" onClick={toggleTheme} aria-label="Cambiar entre modo claro y modo calma oscuro">
        {theme === 'light' ? '🌙 Modo calma' : '☀️ Modo claro'}
      </button>
      </div>
    </header>
  )
}
