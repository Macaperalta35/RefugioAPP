// Genera .well-known/assetlinks.json para la app de Refugio en Google Play.
// Uso: node generar-assetlinks.mjs <huella-clave-subida> [<huella-play-app-signing>]
// Las huellas son SHA-256 en formato AB:CD:…  (32 pares). Se aceptan en minúsculas o sin «:».
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PAQUETE = 'io.github.macaperalta35.refugio'

/** Devuelve la huella en mayúsculas y con «:», o lanza un error si no es SHA-256. */
export function normalizarHuella(texto) {
  const hex = String(texto).replace(/[\s:]/g, '').toUpperCase()
  if (!/^[0-9A-F]{64}$/.test(hex)) {
    throw new Error(`Huella inválida: «${texto}». Debe ser SHA-256 (64 caracteres hexadecimales, como AB:CD:…).`)
  }
  return hex.match(/../g).join(':')
}

export function assetlinks(huellas) {
  if (!huellas.length) throw new Error('Falta al menos una huella.')
  const unicas = [...new Set(huellas.map(normalizarHuella))]
  return [{
    relation: ['delegate_permission/common.handle_all_urls'],
    target: { namespace: 'android_app', package_name: PAQUETE, sha256_cert_fingerprints: unicas },
  }]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const json = assetlinks(process.argv.slice(2))
    const destino = join(dirname(fileURLToPath(import.meta.url)), '.well-known', 'assetlinks.json')
    mkdirSync(dirname(destino), { recursive: true })
    writeFileSync(destino, JSON.stringify(json, null, 2) + '\n')
    console.log(`✅ ${destino} con ${json[0].target.sha256_cert_fingerprints.length} huella(s).`)
  } catch (e) {
    console.error('❌ ' + e.message)
    process.exit(1)
  }
}
