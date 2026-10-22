// Prueba de punta a punta: lanza el servidor por stdio y lo usa con el cliente oficial de MCP
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const SERVIDOR = fileURLToPath(new URL('../server.js', import.meta.url))

test('el servidor lista sus herramientas y responde llamadas', async () => {
  const cliente = new Client({ name: 'prueba', version: '1.0.0' })
  await cliente.connect(new StdioClientTransport({ command: process.execPath, args: [SERVIDOR] }))
  try {
    const { tools } = await cliente.listTools()
    assert.deepEqual(tools.map((t) => t.name).sort(),
      ['adaptaciones', 'buscar_espacios_calma', 'lineas_de_ayuda', 'pictogramas', 'tecnica_de_calma'])
    assert.ok(tools.every((t) => t.annotations?.readOnlyHint === true))

    const r = await cliente.callTool({ name: 'buscar_espacios_calma', arguments: { lat: -33.4378, lng: -70.6505, filtro: 'silencio', limite: 2 } })
    assert.match(r.content[0].text, /1\. Cerro Santa Lucía/)

    const mal = await cliente.callTool({ name: 'tecnica_de_calma', arguments: { tipo: 'inventada' } })
    assert.equal(mal.isError, true)
  } finally {
    await cliente.close()
  }
})
