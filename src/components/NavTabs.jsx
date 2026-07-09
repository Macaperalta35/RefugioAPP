const TABS = [
  { id: 'inicio', ic: '🏡', label: 'Inicio' },
  { id: 'mapa', ic: '🗺️', label: 'Mapa' },
  { id: 'calma', ic: '🌬️', label: 'Calma' },
  { id: 'neuro', ic: '🧩', label: 'Neuro' },
  { id: 'estado', ic: '😊', label: 'Estado' },
  { id: 'pros', ic: '🩺', label: 'Apoyo' },
]

export default function NavTabs({ vista, irA }) {
  return (
    <nav className="tabs" aria-label="Navegación principal">
      {TABS.map((t) => (
        <button key={t.id} className={vista === t.id ? 'act' : ''} onClick={() => irA(t.id)}>
          <span className="ic">{t.ic}</span>{t.label}
        </button>
      ))}
    </nav>
  )
}
