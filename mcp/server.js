#!/usr/bin/env node
// Servidor MCP de Refugio (transporte stdio, para uso local en Claude Desktop o Claude Code).
// Todas las herramientas son de solo lectura y no reciben ni guardan datos personales.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  buscarEspaciosCalma, lineasDeAyuda, tecnicaDeCalma, adaptaciones, pictogramas,
  FILTROS_ESPACIO, TECNICAS, CONDICIONES, CATEGORIAS_PICTOGRAMAS,
} from './herramientas.js'

const SOLO_LECTURA = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
const texto = (t) => ({ content: [{ type: 'text', text: t }] })

export function crearServidor() {
  const server = new McpServer(
    { name: 'refugio', version: '1.0.0' },
    {
      instructions: 'Refugio ofrece espacios de calma, técnicas para atravesar una crisis y apoyo neurodivergente en Chile. '
        + 'Si la persona describe riesgo para su vida o la de otros, entrega primero las líneas de ayuda (lineas_de_ayuda) '
        + 'y recomienda llamar al 131 (SAMU). Responde con calma, en frases cortas y sin juicios.',
    },
  )

  server.registerTool('buscar_espacios_calma', {
    title: 'Buscar espacios de calma',
    description: 'Busca lugares tranquilos en Chile (parques, bibliotecas, espacios de bajo estímulo sensorial). '
      + 'Con lat y lng los ordena por cercanía. Por defecto excluye los sitios que conviene evitar.',
    inputSchema: {
      lat: z.number().min(-90).max(90).optional().describe('Latitud de la persona, si se conoce'),
      lng: z.number().min(-180).max(180).optional().describe('Longitud de la persona, si se conoce'),
      filtro: z.enum(FILTROS_ESPACIO).optional().describe('naturaleza, silencio, techado, accesible, sensorial (bajo estímulo); sobreestimulacion o sin-acceso para ver sitios a evitar'),
      limite: z.number().int().min(1).max(20).optional().describe('Cantidad máxima de resultados (por defecto 5)'),
      incluirAEvitar: z.boolean().optional().describe('Incluir sitios reportados por sobreestimulación o poca accesibilidad'),
    },
    annotations: SOLO_LECTURA,
  }, async (args) => texto(buscarEspaciosCalma(args)))

  server.registerTool('lineas_de_ayuda', {
    title: 'Líneas de ayuda',
    description: 'Teléfonos oficiales de emergencia y apoyo en salud mental en Chile (SAMU 131, Línea *4141, Salud Responde).',
    inputSchema: {},
    annotations: SOLO_LECTURA,
  }, async () => texto(lineasDeAyuda()))

  server.registerTool('tecnica_de_calma', {
    title: 'Técnica de calma',
    description: 'Pasos de una técnica breve para bajar la ansiedad: respiración 4-7-8, respiración de caja, grounding 5-4-3-2-1, relajación muscular progresiva o juegos sensoriales.',
    inputSchema: { tipo: z.enum(TECNICAS).describe('Técnica a explicar') },
    annotations: SOLO_LECTURA,
  }, async (args) => texto(tecnicaDeCalma(args)))

  server.registerTool('adaptaciones', {
    title: 'Adaptaciones neurodivergentes',
    description: 'Estrategias concretas para adecuar clases y tareas cotidianas para TDAH, TEA, dislexia, TEL expresivo y TEL mixto.',
    inputSchema: {
      condicion: z.enum(CONDICIONES).optional().describe('Sin este campo devuelve todas'),
      contexto: z.enum(['clases', 'tareas', 'ambos']).optional().describe('Por defecto ambos'),
    },
    annotations: SOLO_LECTURA,
  }, async (args) => texto(adaptaciones(args)))

  server.registerTool('pictogramas', {
    title: 'Pictogramas',
    description: 'Pictogramas (emoji y palabra) para comunicarse sin hablar, por categoría: necesidades, emociones, acciones y lugares.',
    inputSchema: { categoria: z.enum(CATEGORIAS_PICTOGRAMAS).optional().describe('Sin este campo devuelve todas') },
    annotations: SOLO_LECTURA,
  }, async (args) => texto(pictogramas(args)))

  return server
}

// Arranca solo cuando se ejecuta directamente (no al importarlo en las pruebas)
const esPrincipal = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
if (esPrincipal) {
  await crearServidor().connect(new StdioServerTransport())
}
