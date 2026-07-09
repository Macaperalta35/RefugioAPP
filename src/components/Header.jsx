import { useApp } from '../context/AppContext'
import logo from '../assets/refugio-isotipo.svg'

export default function Header() {
  const { theme, toggleTheme } = useApp()
  return (
    <header className="top">
      <div className="logo"><img src={logo} alt="" className="hoja" width="34" height="34" /> Refugio</div>
      <button className="theme-btn" onClick={toggleTheme} aria-label="Cambiar entre modo claro y modo calma oscuro">
        {theme === 'light' ? '🌙 Modo calma' : '☀️ Modo claro'}
      </button>
    </header>
  )
}
