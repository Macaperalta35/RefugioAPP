import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buscarEspaciosCalma, lineasDeAyuda, tecnicaDeCalma, adaptaciones, pictogramas, TECNICAS } from '../herramientas.js'

test('espacios: ordena por cercanía y excluye sitios a evitar', () => {
  // Plaza de la Independencia, Concepción
  const r = buscarEspaciosCalma({ lat: -36.8270, lng: -73.0503, limite: 3 })
  assert.match(r, /^Espacios ordenados por cercanía/)
  assert.match(r.split('\n')[2], /^1\. Biblioteca Municipal de Concepción \(a \d+ m\)/)
  assert.doesNotMatch(r, /Mall Plaza Trébol|Terminal de Buses/)
  assert.match(r, /131 \(SAMU\)/)
})

test('espacios: filtro de sitios a evitar los muestra', () => {
  const r = buscarEspaciosCalma({ filtro: 'sobreestimulacion' })
  assert.match(r, /Mall Plaza Trébol/)
})

test('espacios: filtro techado con ubicación en Santiago', () => {
  const r = buscarEspaciosCalma({ filtro: 'techado', lat: -33.44, lng: -70.65, limite: 1 })
  assert.match(r, /Biblioteca de Santiago/)
})

test('líneas de ayuda incluye SAMU y *4141', () => {
  const r = lineasDeAyuda()
  assert.match(r, /SAMU: 131/)
  assert.match(r, /\*4141/)
})

test('cada técnica responde con pasos y aviso de emergencia', () => {
  for (const tipo of TECNICAS) {
    const r = tecnicaDeCalma({ tipo })
    assert.ok(r.length > 80, tipo)
    assert.match(r, /Si hay peligro inmediato/, tipo)
  }
  assert.match(tecnicaDeCalma({ tipo: 'respiracion-478' }), /Inhala por la nariz \(4 s\) → Retén el aire \(7 s\) → Exhala lento por la boca \(8 s\)/)
  assert.throws(() => tecnicaDeCalma({ tipo: 'otra' }), /Técnica desconocida/)
})

test('adaptaciones por condición y contexto', () => {
  const r = adaptaciones({ condicion: 'tdah', contexto: 'tareas' })
  assert.match(r, /TDAH/)
  assert.match(r, /Para tareas básicas/)
  assert.doesNotMatch(r, /Para adecuar clases/)
  assert.match(adaptaciones(), /TEL mixto/)
})

test('pictogramas por categoría', () => {
  assert.match(pictogramas({ categoria: 'Necesidades' }), /💧 Agua/)
  assert.throws(() => pictogramas({ categoria: 'X' }), /Categoría desconocida/)
})
