// Lógica de las herramientas del servidor MCP. Usa los mismos datos que la app
// (src/data), así que un cambio en un espacio o una línea de ayuda llega a ambos.
import { ESPACIOS, FILTROS } from '../src/data/espacios.js'
import { LINEAS, EMERGENCIA } from '../src/data/lineas.js'
import { PASOS_GROUNDING, PATRONES_RESPIRACION, RELAJACION } from '../src/data/grounding.js'
import { JUEGOS_SENSORIALES } from '../src/data/juegos.js'
import { ADAPTACIONES } from '../src/data/adaptaciones.js'
import { PICTOGRAMAS } from '../src/data/pictogramas.js'
import { distanciaKm, formatoDistancia } from '../src/lib/distancia.js'

export const URL_APP = 'https://macaperalta35.github.io/RefugioAPP/'

export const FILTROS_ESPACIO = FILTROS.filter((f) => f.id !== 'todos').map((f) => f.id)
export const TECNICAS = ['respiracion-478', 'respiracion-caja', 'grounding', 'relajacion', 'juegos-sensoriales']
export const CONDICIONES = ADAPTACIONES.map((a) => a.id)
export const CATEGORIAS_PICTOGRAMAS = Object.keys(PICTOGRAMAS)

const ETIQUETAS = Object.fromEntries(FILTROS.map((f) => [f.id, f.label]))
const SITIOS_A_EVITAR = ['sobreestimulacion', 'sin-acceso']

/** Va al final de cada respuesta: ningún asistente debe dejar a alguien en crisis sin estos números */
export const avisoEmergencia = () => [
  '',
  '---',
  `⚠️ Si hay peligro inmediato, llama al ${EMERGENCIA.tel} (${EMERGENCIA.nombre}).`,
  `Líneas de apoyo en Chile: ${LINEAS.map((l) => `${l.nombre} (${l.tel})`).join(' · ')}.`,
  `Refugio no reemplaza la atención de urgencia. Más herramientas en ${URL_APP}`,
].join('\n')

const responder = (texto) => texto + '\n' + avisoEmergencia()

export function buscarEspaciosCalma({ lat, lng, filtro, limite = 5, incluirAEvitar = false } = {}) {
  const conUbicacion = Number.isFinite(lat) && Number.isFinite(lng)
  let lista = ESPACIOS.filter((e) => (filtro ? e.tags.includes(filtro) : true))
  // Los sitios a evitar solo aparecen si se piden explícitamente
  if (!incluirAEvitar && !SITIOS_A_EVITAR.includes(filtro)) {
    lista = lista.filter((e) => !e.tags.some((t) => SITIOS_A_EVITAR.includes(t)))
  }
  if (conUbicacion) {
    lista = lista.map((e) => ({ ...e, km: distanciaKm({ lat, lng }, e) })).sort((a, b) => a.km - b.km)
  }
  lista = lista.slice(0, limite)

  if (!lista.length) {
    return responder(`No encontré espacios${filtro ? ` con el filtro «${ETIQUETAS[filtro] || filtro}»` : ''}. Puedes sugerir uno desde el mapa de ${URL_APP}#mapa`)
  }
  const titulo = conUbicacion ? 'Espacios ordenados por cercanía:' : 'Espacios de calma (sin ubicación, en orden de la lista):'
  const items = lista.map((e, i) => [
    `${i + 1}. ${e.n}${e.km !== undefined ? ` (${formatoDistancia(e.km)})` : ''}`,
    `   ${e.d}`,
    `   Etiquetas: ${e.tags.map((t) => ETIQUETAS[t] || t).join(', ')}`,
    `   Cómo llegar: https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`,
  ].join('\n'))
  return responder([titulo, '', ...items].join('\n'))
}

export function lineasDeAyuda() {
  return [
    'Líneas de ayuda en Chile:',
    `- ${EMERGENCIA.nombre}: ${EMERGENCIA.tel} (emergencias médicas, peligro inmediato)`,
    ...LINEAS.map((l) => `- ${l.nombre}: ${l.tel}`),
    '',
    `Desde ${URL_APP} también se puede enviar la ubicación a un contacto de confianza (SOS).`,
  ].join('\n')
}

export function tecnicaDeCalma({ tipo }) {
  if (tipo === 'respiracion-478' || tipo === 'respiracion-caja') {
    const p = PATRONES_RESPIRACION[tipo === 'respiracion-478' ? '478' : 'caja']
    const ciclo = p.fases.map(([texto, seg]) => `${texto} (${seg} s)`).join(' → ')
    return responder([`${p.t}`, '', `Un ciclo: ${ciclo}.`, 'Repite 4 ciclos con calma. Si te mareas, vuelve a respirar normal.',
      `Versión guiada y animada: ${URL_APP}#calma`].join('\n'))
  }
  if (tipo === 'grounding') {
    return responder(['Grounding 5-4-3-2-1 (volver al presente con los sentidos):', '',
      ...PASOS_GROUNDING.map(([n, texto, ayuda]) => `${n}. ${texto} ${ayuda}`)].join('\n'))
  }
  if (tipo === 'relajacion') {
    return responder(['Relajación muscular progresiva. Tensa cada zona 5 segundos y suéltala 10, notando la diferencia:', '',
      ...RELAJACION.map((r) => `- ${r.z}: ${r.d}`)].join('\n'))
  }
  if (tipo === 'juegos-sensoriales') {
    return responder(['Juegos sensoriales simples para bajar la ansiedad o la sobrecarga:', '',
      ...JUEGOS_SENSORIALES.map((j) => `- ${j.ic} ${j.t}: ${j.d}`)].join('\n'))
  }
  throw new Error(`Técnica desconocida: ${tipo}. Opciones: ${TECNICAS.join(', ')}`)
}

export function adaptaciones({ condicion, contexto = 'ambos' } = {}) {
  const lista = condicion ? ADAPTACIONES.filter((a) => a.id === condicion) : ADAPTACIONES
  if (!lista.length) throw new Error(`Condición desconocida: ${condicion}. Opciones: ${CONDICIONES.join(', ')}`)
  const bloques = lista.map((a) => [
    `${a.icono} ${a.nombre} (${a.tag})`,
    ...(contexto !== 'tareas' ? ['Para adecuar clases:', ...a.clases.map((c) => `- ${c}`)] : []),
    ...(contexto !== 'clases' ? ['Para tareas básicas:', ...a.tareas.map((t) => `- ${t}`)] : []),
  ].join('\n'))
  return [...bloques, '', 'Son orientaciones generales: cada persona es distinta y conviene coordinarlas con su equipo de apoyo.'].join('\n\n')
}

export function pictogramas({ categoria } = {}) {
  const cats = categoria ? [categoria] : CATEGORIAS_PICTOGRAMAS
  if (categoria && !PICTOGRAMAS[categoria]) {
    throw new Error(`Categoría desconocida: ${categoria}. Opciones: ${CATEGORIAS_PICTOGRAMAS.join(', ')}`)
  }
  return [
    ...cats.map((c) => `${c}: ${PICTOGRAMAS[c].map(([e, t]) => `${e} ${t}`).join(' · ')}`),
    '',
    `Para armar un mensaje, mostrarlo en grande y leerlo en voz alta: ${URL_APP}#neuro`,
  ].join('\n')
}
