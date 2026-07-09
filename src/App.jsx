import { useState } from 'react'
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
import { EMERGENCIA, LINEAS } from './data/lineas'

export default function App() {
  const [vista, setVista] = useState('inicio')

  const irA = (v) => {
    setVista(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      </main>
      <footer>
        <p><b>Refugio</b> · Prototipo con fines educativos y sociales · Chile 🇨🇱</p>
        <p>Ante una emergencia vital llama al {EMERGENCIA.tel} ({EMERGENCIA.nombre}) · {LINEAS.map((l) => l.nombre).join(' · ')}</p>
      </footer>
      <NavTabs vista={vista} irA={irA} />
      <Toast />
      <FullScreenEstado />
    </AppProvider>
  )
}
