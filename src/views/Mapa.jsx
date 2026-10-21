import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { ESPACIOS, FILTROS } from '../data/espacios'
import { useApp } from '../context/AppContext'
import { CREADORA, mailtoCreadora } from '../data/contacto'
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

const ETIQUETAS = Object.fromEntries(FILTROS.map((f) => [f.id, f.label]))

/** Distancia en km entre dos puntos (fórmula de Haversine) */
const distanciaKm = (a, b) => {
  const rad = (g) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

const formatoDistancia = (km) =>
  km < 1 ? `a ${Math.round(km * 1000 / 50) * 50} m` : `a ${km.toLocaleString('es-CL', { maximumFractionDigits: km < 10 ? 1 : 0 })} km`

const iconoMarcador = (espacio) => {
  const esAlerta = espacio.tags.includes('sobreestimulacion') || espacio.tags.includes('sin-acceso')
  const bg = esAlerta ? '#3F7CA6' : '#7FA792'
  const emoji = espacio.tags.includes('sin-acceso') ? '🚫' : espacio.tags.includes('sobreestimulacion') ? '⚡' : '🌿'
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
  const [detalle, setDetalle] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [miPosicion, setMiPosicion] = useState(null) // { lat, lng } tras tocar "Mi ubicación"
  const marcadoresRef = useRef({})

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

  const visibles = ESPACIOS.filter((e) => filtro === 'todos' || e.tags.includes(filtro))
  // Lista accesible (alternativa al mapa para lectores de pantalla): por cercanía si se conoce la ubicación
  const lista = miPosicion
    ? visibles.map((e) => ({ ...e, km: distanciaKm(miPosicion, e) })).sort((a, b) => a.km - b.km)
    : visibles

  // Repintar marcadores al cambiar el filtro
  useEffect(() => {
    const capa = capaRef.current
    if (!capa) return
    capa.clearLayers()
    marcadoresRef.current = {}
    ESPACIOS
      .filter((e) => filtro === 'todos' || e.tags.includes(filtro))
      .forEach((e) => {
        marcadoresRef.current[e.id] = L.marker([e.lat, e.lng], { icon: iconoMarcador(e) })
          .bindPopup(() => crearPopup(e))
          .addTo(capa)
      })
  }, [filtro])

  const verEnMapa = (e) => {
    cajaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    mapaRef.current.setView([e.lat, e.lng], 16)
    marcadoresRef.current[e.id]?.openPopup()
  }

  const cerrarSugerencia = () => { setPendiente(null); setNombre(''); setMotivo('sobreestimulacion'); setDetalle('') }

  // Igual que profesionales y tiendas: la sugerencia se envía por correo a la
  // creadora, que la verifica antes de agregarla a data/espacios.js.
  const enviarSugerencia = () => {
    const n = nombre.trim()
    if (!n) { toast('Escribe el nombre del lugar'); return }
    const esAlerta = pendiente.tipo === 'alerta'
    const lat = pendiente.lat.toFixed(5), lng = pendiente.lng.toFixed(5)
    window.location.href = mailtoCreadora(
      `Refugio · ${esAlerta ? 'Reporte de sitio a evitar' : 'Sugerencia de espacio de calma'}: ${n}`,
      [
        esAlerta ? 'Hola, quiero reportar un sitio a evitar.' : 'Hola, quiero sugerir un espacio de calma.',
        '',
        `Lugar: ${n}`,
        ...(esAlerta ? [`Problema: ${motivo === 'sin-acceso' ? 'Poca accesibilidad' : 'Sobreestimulación'}`] : []),
        `Detalle: ${detalle.trim() || '—'}`,
        `Coordenadas: ${lat}, ${lng}`,
        `Ver en el mapa: https://maps.google.com/?q=${lat},${lng}`,
      ],
    )
    toast('📧 Envía el correo que se abrió. El lugar se agregará al mapa tras revisarlo.')
    cerrarSugerencia()
  }

  const ubicarme = () => {
    if (!navigator.geolocation) { toast('Tu navegador no permite geolocalización'); return }
    navigator.geolocation.getCurrentPosition((p) => {
      const { latitude: la, longitude: lo } = p.coords
      setMiPosicion({ lat: la, lng: lo })
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
      <h3 className="lista-titulo">
        {miPosicion ? 'Espacios ordenados por cercanía' : 'Lista de espacios'} ({lista.length})
      </h3>
      {!miPosicion && <small className="nota">Toca «📍 Mi ubicación» para ordenarlos del más cercano al más lejano.</small>}
      <ul className="lista-espacios">
        {lista.map((e) => (
          <li key={e.id} className="card">
            <h4>{e.n} {e.km !== undefined && <span className="dist">{formatoDistancia(e.km)}</span>}</h4>
            <p>{e.d}</p>
            <p className="etiquetas">{e.tags.map((t) => ETIQUETAS[t] || t).join(' · ')}</p>
            <div className="acciones">
              <button className="btn sec" onClick={() => verEnMapa(e)}>🗺️ Ver en el mapa</button>
              <a className="btn azul" href={`https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`} target="_blank" rel="noreferrer">🧭 Cómo llegar</a>
            </div>
          </li>
        ))}
        {lista.length === 0 && <li className="card vacio">No hay espacios con este filtro.</li>}
      </ul>

      {modo && (
        <div className="aviso" role="status">
          👆 Toca el mapa donde está el {modo === 'alerta' ? 'sitio a reportar' : 'espacio de calma'}.{' '}
          <button type="button" className="link-btn" onClick={() => cambiarModo(null)}>Cancelar</button>
        </div>
      )}
      <small className="nota">🌿 Calma · 🔵 Sitio a evitar (sobreestimulación o poca accesibilidad). Para sugerir o reportar, presiona un botón y luego toca el punto del mapa donde se encuentra.</small>

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
          <label htmlFor="sugDetalle">{pendiente.tipo === 'alerta' ? 'Cuéntanos qué pasa (opcional)' : '¿Por qué es un buen espacio de calma? (opcional)'}</label>
          <textarea id="sugDetalle" rows={2} maxLength={400} value={detalle} onChange={(e) => setDetalle(e.target.value)}
            placeholder={pendiente.tipo === 'alerta' ? 'Ej: música muy fuerte y luces intermitentes' : 'Ej: tiene bancas a la sombra y poco ruido'} />
          <button className="btn blq" onClick={enviarSugerencia}>
            📧 {pendiente.tipo === 'alerta' ? 'Enviar reporte' : 'Enviar sugerencia'}
          </button>
          <small className="nota">
            Se abrirá tu app de correo con los datos listos para enviar a {CREADORA.nombre}, que revisará el lugar antes de agregarlo al mapa.
            Si no se abre, escribe a <a href={`mailto:${CREADORA.correo}`}>{CREADORA.correo}</a>.
          </small>
        </Modal>
      )}
    </section>
  )
}
