# Sitio raíz `Macaperalta35.github.io`

Plantilla del repositorio que publica `https://macaperalta35.github.io/.well-known/assetlinks.json`.
Android lo lee para confirmar que la app de Play y el sitio son de la misma persona; sin él, la app
muestra una barra con la dirección arriba.

Hoy el repositorio no existe. Se crea cuando estén las huellas (paso 5 de `docs/publicar-play-store.md`).

| Archivo | Para qué |
|---|---|
| `.nojekyll` | Sin él, GitHub Pages no publica carpetas que empiezan con punto, como `.well-known` |
| `index.html` | Redirige la raíz del dominio a la app en `/RefugioAPP/` |
| `generar-assetlinks.mjs` | Crea `.well-known/assetlinks.json` y valida que las huellas estén bien escritas |

## Generar `assetlinks.json`

```bash
cd docs/play-store/sitio-raiz
node generar-assetlinks.mjs "HUELLA_CLAVE_DE_SUBIDA" "HUELLA_PLAY_APP_SIGNING"
```

- **Clave de subida:** está en el `assetlinks.json` del ZIP de PWABuilder, o en `signing-key-info.txt`.
- **Play App Signing:** Play Console → tu app → *Prueba y lanzamiento → Configuración → Integridad de la app → Firma de apps*. Aparece después de subir el primer `.aab`.

Las huellas son públicas (cualquiera puede leer `assetlinks.json`), así que puedes pegarlas en el chat sin riesgo.
**Lo que nunca se comparte ni se sube es el archivo `signing.keystore` y sus contraseñas.**

## Publicar

1. Crea el repositorio público `Macaperalta35.github.io`.
2. Sube `.nojekyll`, `index.html` y `.well-known/assetlinks.json` (no hace falta subir el script).
3. *Settings → Pages → Deploy from a branch → main / (root)*.
4. Comprueba que https://macaperalta35.github.io/.well-known/assetlinks.json muestre el JSON.
