import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [toastMsg, setToastMsg] = useState(null)
  const [fullScreen, setFullScreen] = useState(null) // { tipo: 'estado' | 'pictos', ... }

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const nuevo = t === 'light' ? 'dark' : 'light'
      document.documentElement.dataset.theme = nuevo
      return nuevo
    })
  }, [])

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
