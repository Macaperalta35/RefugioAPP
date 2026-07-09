import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { ESPACIOS_INICIALES, FILTROS } from '../data/espacios'
import { useApp } from '../context/AppContext'

const iconoCalma = (sugerido) => L.divIcon({
  className: '',
  html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 6px;background:${sugerido ? '#B7A9D6' : '#7FA792'};display:grid;place-items:center;color:#fff;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.3)">${sugerido ? '💜' : '🌿'}</div>`,
  iconSize: [34, 34], iconAnchor: [17, 34],
})

export default function Mapa() {
  const { toast } = useApp()
  const cajaRef = useRef(null)
  const mapaRef = useRef(null)
  const capaRef = useRef(null)
  const miMarkerRef = useRef(null)
  const sugiriendoRef = useRef(false)
  const [espacios, setEspacios] = useState(ESPACIOS_INICIALES)
  const [filtro, setFiltro] = useState('todos')

  // Inicializar mapa una sola vez
  useEffect(() => {
    const mapa = L.map(cajaRef.current).setView([-36.827, -73.0503], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap',
    }).addTo(mapa)
    capaRef.current = L.layerGroup().addTo(mapa)
    mapaRef.current = mapa

    mapa.on('click', (e) => {
      if (!sugiriendoRef.current) return
      sugiriendoRef.current = false
      const nombre = window.prompt('Nombre del espacio de calma:')
      if (!nombre) return
      setEspacios((prev) => [...prev, {
        id: Date.now(), n: nombre, lat: e.latlng.lat, lng: e.latlng.lng,
        tags: ['sugerido'], d: 'Espacio sugerido por la comunidad (pendiente de verificación).',
      }])
      toast('🌿 ¡Gracias! Tu espacio fue sugerido.')
    })

    setTimeout(() => mapa.invalidateSize(), 150)
    return () => mapa.remove()
  }, [toast])

  // Repintar marcadores al cambiar filtro o espacios
  useEffect(() => {
    const capa = capaRef.current
    if (!capa) return
    capa.clearLayers()
    espacios
      .filter((e) => filtro === 'todos' || e.tags.includes(filtro))
      .forEach((e) => {
        L.marker([e.lat, e.lng], { icon: iconoCalma(e.tags.includes('sugerido')) })
          .bindPopup(`<b>${e.n}</b><br><small>${e.d}</small><br><small>🏷️ ${e.tags.join(' · ')}</small><br><a href="https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}" target="_blank" rel="noreferrer">Cómo llegar →</a>`)
          .addTo(capa)
      })
  }, [espacios, filtro])

  const ubicarme = () => {
    if (!navigator.geolocation) { toast('Tu navegador no permite geolocalización'); return }
    navigator.geolocation.getCurrentPosition((p) => {
      const { latitude: la, longitude: lo } = p.coords
      mapaRef.current.setView([la, lo], 15)
      if (miMarkerRef.current) mapaRef.current.removeLayer(miMarkerRef.current)
      miMarkerRef.current = L.circleMarker([la, lo], { radius: 9, color: '#B7A9D6', fillColor: '#B7A9D6', fillOpacity: .9 })
        .addTo(mapaRef.current).bindPopup('Estás aquí 💜')
    }, () => toast('No pudimos obtener tu ubicación. Revisa los permisos.'))
  }

  return (
    <section className="view">
      <p className="eyebrow">Georreferenciación</p>
      <h2>Espacios de calma cerca de ti</h2>
      <p className="sub">Lugares tranquilos para recuperar la calma: parques, bibliotecas y espacios amigables con personas neurodivergentes.</p>

      <div className="filtros">
        {FILTROS.map((f) => (
          <button key={f.id} className={`chipf ${filtro === f.id ? 'on' : ''}`} onClick={() => setFiltro(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div ref={cajaRef} className="mapa-caja" role="application" aria-label="Mapa de espacios de calma" />

      <div className="mapa-acciones">
        <button className="btn" onClick={ubicarme}>📍 Mi ubicación</button>
        <button className="btn sec" onClick={() => { sugiriendoRef.current = true; toast('Toca el punto del mapa donde está el espacio 🌿') }}>
          ➕ Sugerir un espacio
        </button>
      </div>
      <small className="nota">Para sugerir un espacio, presiona el botón y luego toca el punto del mapa donde se encuentra.</small>
    </section>
  )
}
