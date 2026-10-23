import { useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import NavTabs from './components/NavTabs'
import Toast from './components/Toast'
import FullScreenEstado from './components/FullScreenEstado'
import Inicio from './views/Inicio'
import Mapa from './views/Mapa'
import Calma from './views/Calma'
import Neuro from './views/Neuro'
import Estado from './views/Estado'
import Profesionales from './views/Profesionales'
import Testers from './views/Testers'
import Organizar from './views/Organizar'
import { EMERGENCIA, LINEAS } from './data/lineas'
import { CREADORA } from './data/contacto'

// 'testers' y 'organizar' no están en la barra inferior: se abren con su enlace (#testers, #organizar)
const VISTAS = ['inicio', 'mapa', 'calma', 'neuro', 'estado', 'pros', 'testers', 'organizar']
const vistaDesdeHash = () => {
  const v = window.location.hash.slice(1)
  return VISTAS.includes(v) ? v : 'inicio'
}

export default function App() {
  // La vista vive en la URL (#mapa, #calma…): el botón atrás vuelve a la
  // pestaña anterior y se pueden compartir enlaces directos.
  const [vista, setVista] = useState(vistaDesdeHash)

  useEffect(() => {
    const alCambiar = () => {
      setVista(vistaDesdeHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  const irA = (v) => {
    if (v === vista) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.hash = v
  }

  return (
    <AppProvider>
      <Header />
      <main>
        {vista === 'inicio' && <Inicio irA={irA} />}
        {vista === 'mapa' && <Mapa />}
        {vista === 'calma' && <Calma />}
        {vista === 'neuro' && <Neuro />}
        {vista === 'estado' && <Estado />}
        {vista === 'pros' && <Profesionales />}
        {vista === 'testers' && <Testers />}
        {vista === 'organizar' && <Organizar />}
      </main>
      <footer>
        <p><b>Refugio</b> · Proyecto de impacto social · Chile 🇨🇱</p>
        <p>Ante una emergencia vital llama al {EMERGENCIA.tel} ({EMERGENCIA.nombre}) · {LINEAS.map((l) => l.nombre).join(' · ')}</p>
        <p>
          Creado por <a href={CREADORA.github} target="_blank" rel="noreferrer">{CREADORA.nombre}</a> ·
          Contacto: <a href={`mailto:${CREADORA.correo}`}>{CREADORA.correo}</a> ·
          Instagram: <a href={`https://www.instagram.com/${CREADORA.instagram}/`} target="_blank" rel="noreferrer">@{CREADORA.instagram}</a> ·{' '}
          <a href="#testers">Ser tester</a> · <a href="./privacidad.html">Privacidad</a>
        </p>
      </footer>
      <NavTabs vista={vista} irA={irA} />
      <Toast />
      <FullScreenEstado />
    </AppProvider>
  )
}
