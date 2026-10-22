// Compartido por la app (Mapa) y el servidor MCP (mcp/herramientas.js)

/** Distancia en km entre dos puntos { lat, lng } (fórmula de Haversine) */
export const distanciaKm = (a, b) => {
  const rad = (g) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

/** "a 650 m" o "a 2,9 km" */
export const formatoDistancia = (km) =>
  km < 1 ? `a ${Math.round(km * 1000 / 50) * 50} m` : `a ${km.toLocaleString('es-CL', { maximumFractionDigits: km < 10 ? 1 : 0 })} km`
