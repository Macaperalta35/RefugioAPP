# Servidor MCP de Refugio

Servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) que permite a asistentes como Claude consultar
los datos de Refugio cuando alguien pide ayuda: espacios de calma cercanos, líneas de ayuda, técnicas de calma
guiadas, adaptaciones neurodivergentes y pictogramas.

- **Local:** funciona por `stdio` en tu computador. No abre puertos ni se conecta a internet.
- **Solo lectura:** no recibe ni guarda datos personales.
- **Mismos datos que la app:** lee `../src/data/`, así que al editar un espacio o una línea de ayuda se actualiza en la app y en el servidor.
- **Aviso de emergencia:** las respuestas sobre espacios y técnicas terminan con las líneas de emergencia (131 SAMU, \*4141, Salud Responde).

## Herramientas

| Herramienta | Parámetros | Qué devuelve |
|---|---|---|
| `buscar_espacios_calma` | `lat`, `lng`, `filtro`, `limite`, `incluirAEvitar` (todos opcionales) | Espacios ordenados por cercanía (si hay ubicación), con descripción, etiquetas y enlace "Cómo llegar". Por defecto excluye los sitios a evitar. |
| `lineas_de_ayuda` | — | SAMU 131, Línea \*4141 y Salud Responde |
| `tecnica_de_calma` | `tipo`: `respiracion-478`, `respiracion-caja`, `grounding`, `relajacion`, `juegos-sensoriales` | Pasos de la técnica |
| `adaptaciones` | `condicion` (`tdah`, `tea`, `dislexia`, `tel-expresivo`, `tel-mixto`), `contexto` (`clases`, `tareas`, `ambos`) | Estrategias para clases y tareas |
| `pictogramas` | `categoria` (`Necesidades`, `Emociones`, `Acciones`, `Lugares`) | Pictogramas (emoji + palabra) |

Filtros de `buscar_espacios_calma`: `naturaleza`, `silencio`, `techado`, `accesible`, `sensorial` (bajo estímulo),
`sobreestimulacion` y `sin-acceso` (sitios a evitar).

## Instalación

Requisitos: [Node.js 18+](https://nodejs.org) y este repositorio clonado.

```bash
git clone https://github.com/Macaperalta35/RefugioAPP.git
cd RefugioAPP/mcp
npm install
npm test        # 8 pruebas, incluida una de punta a punta con el cliente MCP oficial
```

## Conectarlo

En los ejemplos, reemplaza `/RUTA/A/RefugioAPP` por la carpeta donde clonaste el repositorio.
En Windows usa la ruta con barras dobles, por ejemplo `C:\\Users\\Maca\\RefugioAPP\\mcp\\server.js`.

### Claude Code

```bash
claude mcp add refugio -- node /RUTA/A/RefugioAPP/mcp/server.js
```

### Claude Desktop

1. Abre **Configuración → Desarrollador → Editar configuración**. Se abre `claude_desktop_config.json`.
2. Agrega esto y reinicia Claude Desktop:

```json
{
  "mcpServers": {
    "refugio": {
      "command": "node",
      "args": ["/RUTA/A/RefugioAPP/mcp/server.js"]
    }
  }
}
```

### Probar

Pregúntale a Claude, por ejemplo:

- *"Estoy con ansiedad cerca de Plaza de Armas de Santiago, ¿hay algún lugar tranquilo cerca?"*
- *"Guíame con la respiración 4-7-8"*
- *"¿Qué adaptaciones sirven para un estudiante con dislexia en clases?"*

## Próximos pasos

Para que cualquier asistente lo use con una URL, sin instalar nada, hay que publicarlo con transporte HTTP
(Streamable HTTP) en un hosting como Cloudflare Workers o Render. Ese paso necesita una cuenta en el hosting
y conviene agregarle límite de solicitudes.
