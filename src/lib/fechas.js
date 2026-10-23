// Fechas en hora local (no UTC): en Chile, toISOString() cambiaría el día a partir de las 21:00.

export const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
export const DIAS_CORTOS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'] // la semana parte el lunes
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

const dos = (n) => String(n).padStart(2, '0')

/** 'YYYY-MM-DD' de una fecha (por defecto hoy) */
export const isoLocal = (d = new Date()) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`

export const desdeIso = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export const sumarDias = (iso, n) => {
  const d = desdeIso(iso)
  d.setDate(d.getDate() + n)
  return isoLocal(d)
}

/** "jueves 22 de octubre" */
export const fechaLarga = (iso) => {
  const d = desdeIso(iso)
  return `${DIAS_LARGOS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`
}

/** Celdas del mes para una grilla lunes-domingo: null en los huecos */
export function celdasDelMes(anio, mes) {
  const primero = new Date(anio, mes, 1)
  const hueco = (primero.getDay() + 6) % 7 // lunes = 0
  const dias = new Date(anio, mes + 1, 0).getDate()
  const celdas = Array.from({ length: hueco }, () => null)
  for (let d = 1; d <= dias; d++) celdas.push(`${anio}-${dos(mes + 1)}-${dos(d)}`)
  while (celdas.length % 7) celdas.push(null)
  return celdas
}
