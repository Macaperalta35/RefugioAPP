// Lectura en voz alta con la Web Speech API del navegador (sin dependencias ni red)

export const vozDisponible = typeof window !== 'undefined' && 'speechSynthesis' in window

let vozEs = null
const elegirVoz = () => {
  const voces = window.speechSynthesis.getVoices()
  vozEs = voces.find((v) => v.lang === 'es-CL')
    || voces.find((v) => ['es-419', 'es-US', 'es-MX'].includes(v.lang))
    || voces.find((v) => v.lang?.startsWith('es'))
    || null
}
if (vozDisponible) {
  elegirVoz()
  window.speechSynthesis.addEventListener?.('voiceschanged', elegirVoz)
}

/** Lee el texto con voz tranquila; cancela cualquier lectura anterior */
export function hablar(texto) {
  if (!vozDisponible || !texto?.trim()) return false
  const s = window.speechSynthesis
  s.cancel()
  const u = new SpeechSynthesisUtterance(texto)
  u.lang = vozEs?.lang || 'es-CL'
  if (vozEs) u.voice = vozEs
  u.rate = 0.9
  s.speak(u)
  return true
}

export function callar() {
  if (vozDisponible) window.speechSynthesis.cancel()
}
