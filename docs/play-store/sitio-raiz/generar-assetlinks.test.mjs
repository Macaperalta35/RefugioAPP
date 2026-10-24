import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assetlinks, normalizarHuella, PAQUETE } from './generar-assetlinks.mjs'

const H = 'ab'.repeat(32)

test('normaliza minúsculas y sin dos puntos', () => {
  assert.equal(normalizarHuella(H), Array(32).fill('AB').join(':'))
})

test('rechaza una huella SHA-1 o con caracteres extra', () => {
  assert.throws(() => normalizarHuella('AB:CD:EF'), /Huella inválida/)
  assert.throws(() => normalizarHuella('ZZ'.repeat(32)), /Huella inválida/)
})

test('arma el JSON con el paquete y sin huellas repetidas', () => {
  const [x] = assetlinks([H, H.toUpperCase(), 'cd'.repeat(32)])
  assert.equal(x.target.package_name, PAQUETE)
  assert.deepEqual(x.relation, ['delegate_permission/common.handle_all_urls'])
  assert.equal(x.target.sha256_cert_fingerprints.length, 2)
})

test('exige al menos una huella', () => {
  assert.throws(() => assetlinks([]), /al menos una huella/)
})
