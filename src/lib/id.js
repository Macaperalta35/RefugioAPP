// Identificador único aunque se creen varios en el mismo milisegundo (Date.now() solo puede repetirse)
let contador = 0
export const nuevoId = () => `${Date.now().toString(36)}-${(contador++).toString(36)}-${Math.random().toString(36).slice(2, 7)}`
