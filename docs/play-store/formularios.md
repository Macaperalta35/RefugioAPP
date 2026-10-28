# Formularios de Play Console: respuestas para Refugio

Respuestas para *Política → Contenido de la app* y para la creación de la app, según cómo funciona Refugio hoy.
Si la app cambia (por ejemplo, si se agrega un servidor o analítica), hay que revisar estas respuestas.

## Crear la app

| Pregunta | Respuesta |
|---|---|
| Nombre de la app | Refugio: calma y apoyo |
| Idioma predeterminado | Español (Latinoamérica) – es-419 |
| ¿App o juego? | App |
| ¿Gratis o pagada? | Gratis. No se puede cambiar a pagada después. |
| Declaraciones | Acepta las políticas para desarrolladores y las leyes de exportación de EE. UU. |

## Política de privacidad

```
https://macaperalta35.github.io/RefugioAPP/privacidad.html
```

## Acceso a la app

**Toda la funcionalidad está disponible sin restricciones de acceso.** No hay inicio de sesión.

## Anuncios

**No, la app no contiene anuncios.**

## Clasificación del contenido (cuestionario IARC)

- Correo: macaperalta35@gmail.com
- Categoría: **Todas las demás apps** (no es juego, ni red social, ni de noticias).

| Pregunta | Respuesta | Por qué |
|---|---|---|
| Violencia, sangre | No | |
| Contenido sexual o desnudos | No | |
| Lenguaje ofensivo | No | |
| Drogas, alcohol, tabaco | No | La app no muestra ni promueve sustancias. |
| Apuestas o simulación de apuestas | No | |
| ¿Los usuarios pueden interactuar o intercambiar contenido entre sí? | No | No hay chat, perfiles ni publicaciones dentro de la app. |
| ¿Comparte la ubicación física del usuario con otros usuarios? | **Sí** | El SOS envía la ubicación al contacto de emergencia, solo cuando la persona lo pide. Responder «Sí» es lo más transparente y no sube la clasificación. |
| ¿Permite compras digitales? | No | |
| ¿Acceso sin restricciones a internet? | No | Los enlaces abren sitios puntuales (Google Maps, WhatsApp). |

Resultado esperado: clasificación para todo público o +12, con el aviso «Comparte la ubicación».

## Público objetivo y contenido

| Pregunta | Respuesta |
|---|---|
| Grupos de edad | **13 a 15, 16 a 17 y 18 o más** |
| ¿La app podría atraer a menores de 13? | No |

> Si incluyes menores de 13, la app entra al programa Familias, con requisitos adicionales. Hoy no conviene.

## Seguridad de los datos

Play considera «recopilar» a enviar datos **fuera del teléfono**. Refugio guarda todo en el teléfono y no tiene servidor, por eso:

| Pregunta | Respuesta |
|---|---|
| ¿La app recopila o comparte alguno de los tipos de datos del usuario obligatorios? | **No** |

Por qué cada caso no cuenta como recopilación:

| Función | Qué pasa con los datos |
|---|---|
| Tarjeta de crisis, plan de seguridad, agenda, rutinas, compras, estados, preferencias | Se guardan en el almacenamiento local del teléfono. Nunca se envían. |
| «Mi ubicación» en el mapa | Se usa en el teléfono para centrar el mapa. No se guarda ni se envía. |
| SOS | La persona elige enviar su ubicación con **su propia** app de WhatsApp o SMS. Refugio no la recibe. |
| Solicitudes de profesionales y tiendas, sugerencias del mapa, registro de testers | La persona envía el correo desde **su propia** app de correo. Refugio no tiene servidor que lo reciba. |
| Mapa (OpenStreetMap) | El teléfono descarga las imágenes del mapa directamente de OpenStreetMap. Es una conexión técnica, igual que abrir una página web, y está explicada en la política de privacidad. |

Si el formulario pide más detalle:
- Datos cifrados en tránsito: no aplica (no se recopilan datos).
- Forma de solicitar la eliminación de datos: no aplica (no hay cuentas). Los datos se borran desde la app o al desinstalarla.

## ID de publicidad

**No, la app no usa el ID de publicidad.**
Si Play Console avisa que el paquete declara el permiso `AD_ID`, revisa las opciones de PWABuilder: Refugio no debe incluir servicios de anuncios.

## Apps de salud

En *Contenido de la app → Apps de salud*, marca:

- ✅ **Salud mental y conductual** (ansiedad, crisis, manejo emocional).
- ✅ **Bienestar** o **Gestión del estrés** (respiración, relajación), si aparece en la lista.

No marques funciones médicas, diagnósticas, de medicamentos ni de investigación: Refugio no las tiene.

Lo que Play revisa en una app de salud, y cómo lo cumple Refugio:

| Requisito | Dónde está |
|---|---|
| No afirmar que diagnostica o trata | Descripción de la ficha («no entrega diagnósticos ni tratamientos») y pantalla de inicio («es una herramienta de apoyo y no reemplaza la atención médica de urgencia») |
| Aviso de emergencias visible | «Necesito ayuda ahora» muestra el 131 (SAMU) y la Línea *4141; también está en la ficha |
| Política de privacidad accesible | Enlace en la ficha y en el pie de todas las pantallas de la app |

## Otras declaraciones

| Formulario | Respuesta |
|---|---|
| App gubernamental | No |
| Funciones financieras | Ninguna |
| App de noticias | No |
| COVID-19 (rastreo de contactos o estado) | No |
| Permisos de ubicación en segundo plano | No se usan (solo ubicación cuando la persona toca un botón) |

## Cuestionario de acceso a producción (borrador)

Al terminar los 14 días de prueba cerrada, Google pregunta cómo fue la prueba.
Completa los `[…]` con lo que realmente pase en la prueba; Google rechaza respuestas genéricas.

**¿Cómo reclutaste a los testers?**
> Invité a personas de la comunidad de Refugio en Instagram (@refugioapp_chile) y a conocidos que viven con ansiedad, TDAH o autismo, o que acompañan a alguien que vive con ellos. Se inscribieron en la página de testers de la app (macaperalta35.github.io/RefugioAPP/#testers). Participaron [N] personas durante [N] días.

**¿Qué comentarios recibiste?**
> [Ejemplo: «La tarjeta de crisis fue lo más útil», «El texto de la respiración quedaba tapado», «Faltaba una forma de organizar rutinas».]

**¿Qué cambiaste a partir de esos comentarios?**
> [Ejemplo: corregí el círculo de respiración que tapaba la instrucción, agregué el modo bajo estímulo y la sección Organizar mi día.]

**¿Por qué la app está lista para producción?**
> Las funciones principales (ayuda inmediata, SOS, tarjeta de crisis, plan de seguridad, técnicas de calma y organizador) se probaron en [N] teléfonos Android distintos sin errores bloqueantes. La app no recopila datos, funciona sin conexión y muestra en todo momento los números de emergencia de Chile.
