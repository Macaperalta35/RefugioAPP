import { useEffect, useState } from 'react'

const PREFIJO = 'refugio:'

/** Lee un valor guardado; si el almacenamiento está bloqueado (modo privado) usa el valor inicial */
export function leerGuardado(clave, inicial) {
  try {
    const v = localStorage.getItem(PREFIJO + clave)
    return v === null ? inicial : JSON.parse(v)
  } catch {
    return inicial
  }
}

/** useState que persiste en este dispositivo. Los datos nunca salen del navegador. */
export function useLocalStorage(clave, inicial) {
  const [valor, setValor] = useState(() => leerGuardado(clave, typeof inicial === 'function' ? inicial() : inicial))

  useEffect(() => {
    try {
      if (valor === null || valor === undefined) localStorage.removeItem(PREFIJO + clave)
      else localStorage.setItem(PREFIJO + clave, JSON.stringify(valor))
    } catch { /* sin almacenamiento: la app sigue funcionando solo en memoria */ }
  }, [clave, valor])

  return [valor, setValor]
}
