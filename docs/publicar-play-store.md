# Publicar Refugio en Google Play (TWA)

Refugio se publica como **Trusted Web Activity (TWA)**: una app Android que abre
`https://macaperalta35.github.io/RefugioAPP/` en Chrome a pantalla completa, sin
barra de direcciones. Cada merge a `main` actualiza la app sin subir versiones
nuevas a Play.

| Paso | Quién | Estado |
|---|---|---|
| 1. PWA (manifiesto, service worker, íconos) y política de privacidad | Código | ✅ Listo en este repo |
| 2. Revisar contenido de ejemplo | Tú | ⏳ Antes de producción |
| 3. Cuenta de Google Play Console | Tú | ⏳ |
| 4. Generar el paquete Android con PWABuilder | Tú | ⏳ |
| 5. Verificar el dominio (Digital Asset Links) | Código + tú | ⏳ Requiere la huella del paso 4 |
| 6. Ficha y formularios en Play Console | Tú | ⏳ |
| 7. Prueba cerrada (12 testers × 14 días) | Tú | ⏳ |
| 8. Solicitar acceso a producción | Tú | ⏳ |

---

## 1. PWA ✅

- Manifiesto: `vite.config.js` (`VitePWA`). Nombre, colores, íconos y accesos directos (Calma, Mapa).
- Íconos: `public/app-icon-512.png` y versiones adaptables `public/app-icon-maskable-*.png`.
- Sin conexión: Workbox precarga toda la app; las técnicas de calma, pictogramas y estados funcionan sin internet.
  El mapa necesita conexión para descargar las imágenes de OpenStreetMap.
- Política de privacidad: `public/privacidad.html` →
  **https://macaperalta35.github.io/RefugioAPP/privacidad.html** (esta es la URL que pide Play).

## 2. Revisar contenido de ejemplo ⚠️

Play rechaza apps de salud con afirmaciones engañosas. Antes de pasar a producción:

- `src/data/profesionales.js`: los profesionales de ejemplo muestran **"✓ Verificado"** sin verificación real. Hay que quitarlos o marcarlos claramente como ejemplo.
- `src/data/emprendedores.js`: tiendas y teléfonos de ejemplo (`+56 9 1234 5678`).
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
   - **Signing key:** *Create new*.
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

**Crear app:** nombre *Refugio*, idioma español (Latinoamérica), tipo *App*, *Gratis*.

**Ficha de Play Store:**
- Descripción breve (máx. 80 caracteres), por ejemplo:
  *Espacios de calma, técnicas para crisis de ansiedad y apoyo neurodivergente.*
- Descripción completa: puedes partir de la tabla de módulos del `README.md`. Incluye el aviso de que no reemplaza la atención de urgencia (131 SAMU).
- Ícono 512×512: `public/app-icon-maskable-512.png`.
- Gráfico de funciones 1024×500 (obligatorio).
- Mínimo 2 capturas de teléfono. Lo más fácil es sacarlas desde el teléfono con la app instalada.
- Categoría: **Salud y bienestar**.

**Contenido de la app** (menú *Política → Contenido de la app*):

| Formulario | Respuesta sugerida |
|---|---|
| Política de privacidad | `https://macaperalta35.github.io/RefugioAPP/privacidad.html` |
| Anuncios | No contiene anuncios |
| Acceso a la app | Toda la funcionalidad está disponible sin restricciones |
| Clasificación de contenido | Completar el cuestionario IARC (sin violencia ni contenido sexual) |
| Público objetivo | 13 años o más. Incluir menores de 13 activa los requisitos del programa Familias. |
| Seguridad de los datos | **No se recopilan ni comparten datos**: todo queda en el dispositivo y el SOS lo envía la persona con su propia app de mensajería. Si en el futuro se agrega un backend, este formulario hay que actualizarlo. |
| Apps de salud | Declarar la categoría de **salud mental y conductual** |
| App gubernamental / Finanzas / COVID-19 | No |

## 7. Prueba cerrada

1. *Prueba y lanzamiento → Pruebas → Prueba cerrada → Crear pista*.
2. Sube el `.aab` del paso 4.
3. Agrega al menos **12 testers** (correos de Google) y compárteles el enlace de suscripción.
4. Los 12 deben **mantenerse suscritos 14 días seguidos**. Conviene invitar a unos 15 por si alguien se retira.
5. Durante la prueba, revisa en un teléfono real: botón atrás, SOS por WhatsApp/SMS, llamadas a las líneas, ubicación, lectura en voz alta y modo sin conexión.

## 8. Producción

Al cumplir los 14 días, en *Panel → Solicitar acceso a producción* responde el cuestionario sobre la prueba.
La revisión de Google puede tardar desde unos días hasta un par de semanas.

---

## Actualizaciones futuras

- **Cambios en la app** (pantallas, contenido, estilos): basta con hacer merge a `main`. La app instalada se actualiza sola.
- **Nuevo `.aab`**, solo si cambias el nombre, el ícono, los colores del manifiesto o la configuración del TWA.
  Genera el paquete con **la misma clave y el mismo Package ID** y sube el **Version code** (2, 3, …).
