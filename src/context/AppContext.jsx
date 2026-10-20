import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Solo se guarda si la persona elige un tema; si no, se sigue el modo del sistema
  const [temaElegido, setTemaElegido] = useLocalStorage('tema', null)
  const temaSistema = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const theme = temaElegido || temaSistema
  const [toastMsg, setToastMsg] = useState(null)
  const [fullScreen, setFullScreen] = useState(null) // { tipo: 'estado' | 'pictos', ... }

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const toggleTheme = useCallback(() => {
    setTemaElegido(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTemaElegido])

  const toast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3200)
  }, [])

  return (
    <AppContext.Provider value={{ theme, toggleTheme, toast, toastMsg, fullScreen, setFullScreen }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
