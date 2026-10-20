import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { ESPACIOS_INICIALES, FILTROS } from '../data/espacios'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'

/**
 * Contenido del popup armado con nodos DOM y textContent (no con HTML
 * interpolado): los nombres que escribe la comunidad nunca se interpretan
 * como código, aunque traigan etiquetas <script> o atributos onerror.
 */
const crearPopup = (espacio) => {
  const caja = document.createElement('div')
  const linea = (tag, texto) => {
    const el = document.createElement(tag)
    el.textContent = texto
    caja.append(el, document.createElement('br'))
  }
  linea('b', espacio.n)
  linea('small', espacio.d)
  linea('small', `🏷️ ${espacio.tags.join(' · ')}`)
  const a = document.createElement('a')
  a.href = `https://www.google.com/maps/dir/?api=1&destination=${Number(espacio.lat)},${Number(espacio.lng)}`
  a.target = '_blank'
  a.rel = 'noreferrer'
  a.textContent = 'Cómo llegar →'
  caja.append(a)
  return caja
}

const iconoMarcador = (espacio) => {
  const esAlerta = espacio.tags.includes('sobreestimulacion') || espacio.tags.includes('sin-acceso')
  const esSugerido = espacio.tags.includes('sugerido')
  const bg = esAlerta ? '#3F7CA6' : esSugerido ? '#B7A9D6' : '#7FA792'
  const emoji = espacio.tags.includes('sin-acceso') ? '🚫' : espacio.tags.includes('sobreestimulacion') ? '⚡' : esSugerido ? '💜' : '🌿'
  return L.divIcon({
    className: '',
    html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 6px;background:${bg};display:grid;place-items:center;color:#fff;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.3)">${emoji}</div>`,
    iconSize: [34, 34], iconAnchor: [17, 34],
  })
}

export default function Mapa() {
  const { toast } = useApp()
  const cajaRef = useRef(null)
  const mapaRef = useRef(null)
  const capaRef = useRef(null)
  const miMarkerRef = useRef(null)
  const [modo, setModo] = useState(null) // null | 'calma' | 'alerta': esperando un toque en el mapa
  const modoRef = useRef(null)
  const [pendiente, setPendiente] = useState(null) // { lat, lng, tipo } del punto tocado
  const [nombre, setNombre] = useState('')
  const [motivo, setMotivo] = useState('sobreestimulacion')
  const [espacios, setEspacios] = useState(ESPACIOS_INICIALES)
  const [filtro, setFiltro] = useState('todos')

  const cambiarModo = (m) => { modoRef.current = m; setModo(m) }

  // Inicializar mapa una sola vez
  useEffect(() => {
    const mapa = L.map(cajaRef.current).setView([-36.827, -73.0503], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap',
    }).addTo(mapa)
    capaRef.current = L.layerGroup().addTo(mapa)
    mapaRef.current = mapa

    mapa.on('click', (e) => {
      if (!modoRef.current) return
      setPendiente({ lat: e.latlng.lat, lng: e.latlng.lng, tipo: modoRef.current })
      modoRef.current = null
      setModo(null)
    })

    setTimeout(() => mapa.invalidateSize(), 150)
    return () => mapa.remove()
  }, [])

  // Repintar marcadores al cambiar filtro o espacios
  useEffect(() => {
    const capa = capaRef.current
    if (!capa) return
    capa.clearLayers()
    espacios
      .filter((e) => filtro === 'todos' || e.tags.includes(filtro))
      .forEach((e) => {
        L.marker([e.lat, e.lng], { icon: iconoMarcador(e) })
          .bindPopup(() => crearPopup(e))
          .addTo(capa)
      })
  }, [espacios, filtro])

  const cerrarSugerencia = () => { setPendiente(null); setNombre(''); setMotivo('sobreestimulacion') }

  const guardarSugerencia = () => {
    const n = nombre.trim()
    if (!n) { toast('Escribe el nombre del lugar'); return }
    const esAlerta = pendiente.tipo === 'alerta'
    setEspacios((prev) => [...prev, {
      id: Date.now(), n, lat: pendiente.lat, lng: pendiente.lng,
      tags: esAlerta ? [motivo] : ['sugerido'],
      d: esAlerta
        ? 'Sitio reportado por la comunidad (pendiente de verificación).'
        : 'Espacio sugerido por la comunidad (pendiente de verificación).',
    }])
    toast(esAlerta ? '⚠️ Gracias por avisar. Ayudará a otras personas a evitarlo.' : '🌿 ¡Gracias! Tu espacio fue sugerido.')
    cerrarSugerencia()
  }

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
        <button className="btn azul" onClick={ubicarme}>📍 Mi ubicación</button>
        <button className="btn sec" onClick={() => { cambiarModo('calma'); toast('Toca el punto del mapa donde está el espacio 🌿') }}>
          ➕ Sugerir un espacio
        </button>
        <button className="btn sec" onClick={() => { cambiarModo('alerta'); toast('Toca el punto del mapa que quieres reportar ⚠️') }}>
          ⚠️ Reportar sitio a evitar
        </button>
      </div>
      {modo && (
        <div className="aviso" role="status">
          👆 Toca el mapa donde está el {modo === 'alerta' ? 'sitio a reportar' : 'espacio de calma'}.{' '}
          <button type="button" className="link-btn" onClick={() => cambiarModo(null)}>Cancelar</button>
        </div>
      )}
      <small className="nota">🌿 Calma · 💜 Sugerido por la comunidad · 🔵 Sitio a evitar (sobreestimulación o poca accesibilidad). Presiona un botón y luego toca el punto del mapa donde se encuentra.</small>

      {pendiente && (
        <Modal
          titulo={pendiente.tipo === 'alerta' ? '⚠️ Reportar sitio a evitar' : '🌿 Sugerir espacio de calma'}
          onClose={cerrarSugerencia}
          label={pendiente.tipo === 'alerta' ? 'Reportar sitio' : 'Sugerir espacio'}
        >
          <label htmlFor="sugNombre">Nombre del lugar</label>
          <input id="sugNombre" value={nombre} maxLength={80} onChange={(e) => setNombre(e.target.value)}
            placeholder={pendiente.tipo === 'alerta' ? 'Ej: Terminal de buses' : 'Ej: Plaza de la biblioteca'} />
          {pendiente.tipo === 'alerta' && (
            <fieldset className="opciones">
              <legend>¿Cuál es el problema?</legend>
              <label><input type="radio" name="motivo" value="sobreestimulacion" checked={motivo === 'sobreestimulacion'}
                onChange={(e) => setMotivo(e.target.value)} /> ⚡ Sobreestimulación (ruido, luces, aglomeración)</label>
              <label><input type="radio" name="motivo" value="sin-acceso" checked={motivo === 'sin-acceso'}
                onChange={(e) => setMotivo(e.target.value)} /> 🚫 Poca accesibilidad (movilidad reducida, silla de ruedas)</label>
            </fieldset>
          )}
          <button className="btn blq" onClick={guardarSugerencia}>
            {pendiente.tipo === 'alerta' ? 'Reportar sitio' : 'Sugerir espacio'}
          </button>
          <small className="nota">Las sugerencias quedan pendientes de verificación antes de mostrarse como espacios confirmados.</small>
        </Modal>
      )}
    </section>
  )
}
