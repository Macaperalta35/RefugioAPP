import { useApp } from '../context/AppContext'

export default function Header() {
  const { theme, toggleTheme } = useApp()
  return (
    <header className="top">
      <div className="logo"><span className="hoja">🌿</span> Refugio</div>
      <button className="theme-btn" onClick={toggleTheme} aria-label="Cambiar entre modo claro y modo calma oscuro">
        {theme === 'light' ? '🌙 Modo calma' : '☀️ Modo claro'}
      </button>
    </header>
  )
}
