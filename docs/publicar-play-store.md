# Publicar Refugio en Google Play (TWA)

Refugio se publica como **Trusted Web Activity (TWA)**: una app Android que abre
`https://macaperalta35.github.io/RefugioAPP/` en Chrome a pantalla completa, sin
barra de direcciones. Cada merge a `main` actualiza la app sin subir versiones
nuevas a Play.

| Paso | Quién | Estado |
|---|---|---|
| 1. PWA (manifiesto, service worker, íconos, capturas) y política de privacidad | Código | ✅ Listo en este repo |
| 2. Revisar contenido de ejemplo | Código + tú | ✅ Ejemplos eliminados · ⏳ revisar espacios del mapa |
| 3. Cuenta de Google Play Console | Tú | ⏳ **Esperando la verificación de identidad de Google** |
| 4. Generar el paquete Android con PWABuilder | Tú | ⏳ Opciones listas abajo |
| 5. Verificar el dominio (Digital Asset Links) | Código + tú | ✅ Plantilla y generador listos en [`play-store/sitio-raiz/`](play-store/sitio-raiz/README.md) · ⏳ faltan las huellas |
| 6. Ficha y formularios en Play Console | Tú | ✅ Textos, capturas y respuestas listos en [`play-store/`](play-store/) · ⏳ copiarlos en Play Console |
| 7. Prueba cerrada (12 testers × 14 días) | Tú | ⏳ Página de registro lista en `#testers` |
| 8. Solicitar acceso a producción | Tú | ⏳ Borrador del cuestionario en [`play-store/formularios.md`](play-store/formularios.md) |

### Lo que ya está listo en el repo

| Qué | Dónde |
|---|---|
| Textos de la ficha (nombre, descripción breve y completa, novedades), con límites verificados | [`play-store/ficha.md`](play-store/ficha.md) |
| 6 capturas de teléfono 1080×1920 con título | [`play-store/capturas/`](play-store/capturas/) |
| Ícono 512×512 y gráfico de funciones 1024×500 | `marca/play-icono-512.png`, `marca/play-grafico-funciones-1024x500.png` |
| Respuestas de todos los formularios de *Contenido de la app* | [`play-store/formularios.md`](play-store/formularios.md) |
| Sitio raíz para `assetlinks.json` y generador con validación de huellas | [`play-store/sitio-raiz/`](play-store/sitio-raiz/README.md) |
| Política de privacidad publicada | https://macaperalta35.github.io/RefugioAPP/privacidad.html |

**Mientras Google verifica tu identidad, no hay nada más que hacer en el código.** Cuando aprueben la cuenta, sigue desde el paso 4.

---

## 1. PWA ✅

- Manifiesto: `vite.config.js` (`VitePWA`). Nombre, colores, íconos, accesos directos (Calma, Mapa, Organizar) y capturas para el diálogo de instalación (`public/screenshots/`).
- Íconos: `public/app-icon-512.png` y versiones adaptables `public/app-icon-maskable-*.png`.
- Sin conexión: Workbox precarga toda la app; las técnicas de calma, pictogramas y estados funcionan sin internet.
  El mapa necesita conexión para descargar las imágenes de OpenStreetMap.
- Política de privacidad: `public/privacidad.html` →
  **https://macaperalta35.github.io/RefugioAPP/privacidad.html** (esta es la URL que pide Play).

## 2. Revisar contenido de ejemplo ⚠️

Play rechaza apps de salud con afirmaciones engañosas. Antes de pasar a producción:

- Las solicitudes de profesionales y tiendas, y las sugerencias y reportes del mapa, llegan por correo a la creadora (`src/data/contacto.js`). Para publicarlas, agrégalas a `src/data/profesionales.js`, `src/data/emprendedores.js` o `src/data/espacios.js`. En profesionales, marca `ver: true` solo si verificaste el registro.
- ✅ Se eliminaron los profesionales, tips y tiendas de ejemplo; las listas parten vacías y muestran un mensaje invitando a enviar la solicitud.
- `src/data/espacios.js`: confirmar que los lugares y sus etiquetas sean correctos.

## 3. Cuenta de Google Play Console

1. Entra a <https://play.google.com/console/signup> con la cuenta de Google que será dueña de la app.
2. Elige cuenta **personal**, paga el registro único de **USD 25** y completa la verificación de identidad (documento oficial).
3. Verifica un teléfono Android con la app Play Console, si lo pide.

> Las cuentas personales nuevas deben hacer una **prueba cerrada con al menos 12 testers durante 14 días seguidos** antes de poder publicar en producción (paso 7).

## 4. Generar el paquete Android (PWABuilder)

1. Abre <https://www.pwabuilder.com> e ingresa `https://macaperalta35.github.io/RefugioAPP/`.
2. Revisa el puntaje del manifiesto y el service worker. Ya deberían estar en verde.
3. **Package for stores → Android → Generate package**, con estas opciones:
   - **Package ID:** `io.github.macaperalta35.refugio`. **Es permanente y no se puede cambiar después de publicar.**
   - **App name:** `Refugio` · **Launcher name:** `Refugio`
   - **Version:** `1.0.0` · **Version code:** `1`
   - **Signing key:** *Create new*. Usa tu nombre y «Refugio» en los datos de la clave.
   - **Display mode:** `Standalone` · **Status bar / Nav bar color:** `#F2F6F4`
   - **Notification delegation:** **desactivado**. Refugio no envía notificaciones y así Android no pide ese permiso.
   - **Location delegation:** **activado**. Lo usan «Mi ubicación» en el mapa y el SOS.
   - **Google Play billing:** desactivado (la app es gratis).
   - Deja el resto de opciones como vienen.
4. Descarga el ZIP. Contiene:
   - `*.aab`: el archivo que se sube a Play.
   - `*.apk`: para instalar y probar en tu teléfono.
   - `signing.keystore` y `signing-key-info.txt`: **la clave de firma y sus contraseñas.**
   - `assetlinks.json`: para el paso 5.

> 🔐 **Guarda el keystore y las contraseñas en un lugar seguro** (gestor de contraseñas y una copia de respaldo).
> **Nunca los subas a GitHub.** Si se pierden, no podrás actualizar el paquete de la app.

## 5. Verificar el dominio (Digital Asset Links)

Android solo oculta la barra de direcciones si el sitio declara que confía en la app.
El archivo debe estar en la **raíz del dominio**:
`https://macaperalta35.github.io/.well-known/assetlinks.json`

Como Refugio vive en `/RefugioAPP/`, se necesita un repositorio de sitio de usuario:

1. Crear el repositorio público **`Macaperalta35.github.io`**. Hoy no existe y la raíz del dominio está vacía, así que no se pisa nada.
2. Agregar un archivo vacío `.nojekyll` (sin él, GitHub Pages ignora las carpetas que empiezan con punto).
3. Agregar `.well-known/assetlinks.json` con **dos huellas SHA-256**:
   - la de tu clave de subida (viene en el `assetlinks.json` de PWABuilder), y
   - la de **Play App Signing**: Play Console → tu app → *Prueba y lanzamiento → Integridad de la app → Firma de apps*. Aparece después de subir el primer `.aab`.

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "io.github.macaperalta35.refugio",
    "sha256_cert_fingerprints": [
      "HUELLA_CLAVE_DE_SUBIDA",
      "HUELLA_PLAY_APP_SIGNING"
    ]
  }
}]
```

4. Comprobar con
   <https://developers.google.com/digital-asset-links/tools/generator>
   o abriendo la URL del archivo en el navegador.

> Si la app instalada muestra una barra con la URL arriba, falta o está mal la huella en `assetlinks.json`.

## 6. Ficha y formularios en Play Console

> Los textos exactos, con el conteo de caracteres, están en [`play-store/ficha.md`](play-store/ficha.md),
> y todas las respuestas de los formularios, explicadas, en [`play-store/formularios.md`](play-store/formularios.md).
> Lo de abajo es el resumen.

**Crear app:** nombre *Refugio: calma y apoyo*, idioma español (Latinoamérica), tipo *App*, *Gratis*.

**Ficha de Play Store:**
- Descripción breve y completa: las de `play-store/ficha.md`. La completa ya incluye el aviso de que no reemplaza la atención de urgencia (131 SAMU).
- Ícono 512×512: `docs/marca/play-icono-512.png`.
- Gráfico de funciones 1024×500 (obligatorio): `docs/marca/play-grafico-funciones-1024x500.png`.
- Capturas de teléfono: las 6 de `docs/play-store/capturas/`, en orden.
- Categoría: **Salud y bienestar**.
- Datos de contacto (obligatorio): correo **macaperalta35@gmail.com**, el mismo de `src/data/contacto.js`.

**Contenido de la app** (menú *Política → Contenido de la app*):

| Formulario | Respuesta sugerida |
|---|---|
| Política de privacidad | `https://macaperalta35.github.io/RefugioAPP/privacidad.html` |
| Anuncios | No contiene anuncios |
| Acceso a la app | Toda la funcionalidad está disponible sin restricciones |
| Clasificación de contenido | Completar el cuestionario IARC (sin violencia ni contenido sexual) |
| Público objetivo | 13 años o más. Incluir menores de 13 activa los requisitos del programa Familias. |
| Seguridad de los datos | **La app no recopila ni comparte datos**: todo queda en el dispositivo. El SOS, las solicitudes de profesionales y tiendas y las sugerencias del mapa los envía la propia persona con su app de mensajería o de correo. Si en el futuro se agrega un backend, este formulario hay que actualizarlo. |
| Apps de salud | Declarar la categoría de **salud mental y conductual** |
| App gubernamental / Finanzas / COVID-19 | No |

## 7. Prueba cerrada

1. *Prueba y lanzamiento → Pruebas → Prueba cerrada → Crear pista*.
2. Sube el `.aab` del paso 4.
3. Agrega al menos **12 testers** (correos de Google) y compárteles el enlace de suscripción.
4. Los 12 deben **mantenerse suscritos 14 días seguidos**. Conviene invitar a unos 15 por si alguien se retira.
5. Durante la prueba, revisa en un teléfono real: botón atrás, SOS por WhatsApp/SMS, llamadas a las líneas, ubicación, lectura en voz alta y modo sin conexión.

## 8. Producción

### 8.1 Solicitar acceso a producción
Solo para cuentas personales nuevas, al cumplir los 14 días de la prueba cerrada:

1. *Panel → Solicitar acceso a producción*.
2. Responde el cuestionario. Google pregunta cómo reclutaste a los testers, qué te comentaron, qué cambiaste a partir de eso y por qué la app está lista. Responde con detalle: las respuestas genéricas son motivo frecuente de rechazo.
3. Google responde en unos días. Si la rechaza, normalmente pide extender la prueba cerrada.

### 8.2 Crear la versión de producción
1. *Prueba y lanzamiento → Producción → Crear versión*.
2. **Agregar desde la biblioteca**: elige el mismo `.aab` que probaste en la prueba cerrada. No hace falta generar otro.
3. Escribe las **notas de la versión**: copia las de [`play-store/ficha.md`](play-store/ficha.md).
4. *Países y regiones*: agrega **Chile**, o más países si quieres.
5. *Revisar versión → Iniciar lanzamiento a producción*.

### 8.3 Revisión de Google
- La primera revisión suele tardar de unos días a una semana. En apps de salud puede tomar más.
- Para ver el estado, entra a *Panel → Resumen de publicación*. Si Google pide cambios, lo indica ahí y por correo.
- Una vez aprobada, la app aparece en Play Store en unas horas.

### 8.4 Después de publicar
- Para revisar errores (ANR, fallos) y reseñas, entra a *Calidad → Android vitals* y *Calificaciones y reseñas*.
- Responde las reseñas, sobre todo las que reporten problemas en una crisis.

---

## Actualizaciones futuras

- **Cambios en la app** (pantallas, contenido, estilos): basta con hacer merge a `main`. La app instalada se actualiza sola.
- **Nuevo `.aab`**, solo si cambias el nombre, el ícono, los colores del manifiesto o la configuración del TWA.
  Genera el paquete con **la misma clave y el mismo Package ID** y sube el **Version code** (2, 3, …).
