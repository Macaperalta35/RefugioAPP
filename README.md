# 🌿 Refugio

**Red de espacios de calma, apoyo en crisis e inclusión neurodivergente — Chile 🇨🇱**

Plataforma web que conecta a personas en crisis de ansiedad o episodios complejos de salud mental con espacios físicos de calma georreferenciados, técnicas de contención inmediata, herramientas de comunicación para personas neurodivergentes y profesionales de la salud.

> ⚠️ Refugio es una herramienta de apoyo y **no reemplaza la atención médica de urgencia**. Ante una emergencia vital, llama al 131 (SAMU).

---

## ✨ Módulos

| Módulo | Descripción |
|---|---|
| 🤲 **Modo Crisis** | Botón de ayuda inmediata con técnicas guiadas y llamada directa a la línea *4141 y Salud Responde |
| 🆘 **SOS** | Envía la georreferenciación en tiempo real al contacto de emergencia por WhatsApp o SMS |
| 🗺️ **Mapa** | Espacios de calma georreferenciados (Leaflet + OpenStreetMap) con filtros, incluido bajo estímulo sensorial |
| 🌬️ **Calma** | Respiración 4-7-8 y de caja animadas, grounding 5-4-3-2-1 y relajación muscular progresiva |
| 🧩 **Neuro** | Adaptaciones para TDAH, TEA, dislexia, TEL expresivo y mixto + tablero de pictogramas |
| 😊 **Mi Estado** | Estados de ánimo personalizables con caricaturas SVG animadas, en pantalla completa |
| 🩺 **Profesionales** | Registro de especialistas con verificación y tips gratuitos para la comunidad |

## 🛠️ Tecnologías

- **React 18** + **Vite 5** — SPA rápida y modular
- **Leaflet 1.9** — mapas con OpenStreetMap (sin API key)
- **CSS custom properties** — sistema de diseño con modo calma (oscuro) y tipografía Atkinson Hyperlegible (amigable con dislexia)

## 🚀 Empezar (VS Code)

Requisitos: [Node.js 18+](https://nodejs.org) y [Git](https://git-scm.com).

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
# → abre http://localhost:5173

# 3. Build de producción
npm run build
# → genera la carpeta dist/
```

Al abrir la carpeta en VS Code, acepta las **extensiones recomendadas** (ESLint, Prettier, snippets de React).

## 📤 Subir a GitHub

```bash
# Dentro de la carpeta del proyecto
git init
git add .
git commit -m "feat: versión inicial de Refugio"

# Crea un repositorio vacío en github.com llamado 'refugio' y luego:
git branch -M main
git remote add origin https://github.com/TU_USUARIO/refugio.git
git push -u origin main
```

### Desplegar gratis

- **Vercel / Netlify**: importa el repo, framework *Vite*, build `npm run build`, output `dist/`.
- **GitHub Pages**: `npm run build`, sube `dist/` con la acción *deploy-pages* (el `base: './'` de `vite.config.js` ya lo deja listo).

## 📁 Estructura del proyecto

```
refugio/
├── index.html               # Punto de entrada HTML
├── vite.config.js           # Configuración de Vite
├── package.json
└── src/
    ├── main.jsx             # Bootstrap de React
    ├── App.jsx              # Enrutado de vistas y layout general
    ├── styles/
    │   └── global.css       # Tokens de diseño, temas y estilos globales
    ├── context/
    │   └── AppContext.jsx   # Estado global: tema, toasts, pantalla completa
    ├── components/          # Componentes reutilizables (Header, Modal, Carita…)
    ├── features/            # Funcionalidades: Respiración, Grounding, SOS…
    ├── views/               # Vistas principales: Inicio, Mapa, Calma, Neuro…
    └── data/                # Datos desacoplados (espacios, adaptaciones, líneas…)
```

**Principio de escalabilidad:** todo el contenido vive en `src/data/`. Cuando exista un backend, basta reemplazar esos imports por llamadas a una API sin tocar los componentes.

## 🗺️ Roadmap escalable

- [ ] **Backend** (Node/Express o Flask) con base de datos (PostgreSQL + PostGIS para consultas georreferenciadas)
- [ ] **Autenticación** de usuarios y profesionales (verificación contra Registro Nacional de Prestadores)
- [ ] **API REST** para espacios de calma sugeridos con moderación
- [ ] **PWA**: instalable en el teléfono y funcional sin conexión (crítico en crisis)
- [ ] **Notificaciones** al contacto de emergencia vía API de mensajería
- [ ] Pictogramas ARASAAC oficiales y lector de voz (accesibilidad total)

## 📞 Líneas de ayuda (Chile)

- **Línea \*4141** — Prevención del suicidio (Ministerio de Salud)
- **Salud Responde** — 600 360 7777
- **SAMU** — 131 (emergencias)

---

Hecho con 💚 como proyecto de impacto social · INACAP
