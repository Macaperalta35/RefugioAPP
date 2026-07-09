import { useState } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'

/** SOS: genera un mensaje con georreferenciación para WhatsApp o SMS */
export default function SOS({ onClose }) {
  const { toast } = useApp()
  const [nombre, setNombre] = useState('')
  const [fono, setFono] = useState('')
  const [msj, setMsj] = useState('Necesito apoyo ahora. Esta es mi ubicación:')
  const [estado, setEstado] = useState('')

  const enviar = (via) => {
    const tel = fono.replace(/\D/g, '')
    if (!tel) { toast('Ingresa el teléfono de tu contacto'); return }
    setEstado('📍 Obteniendo tu ubicación…')

    // Se abre la pestaña de inmediato (dentro del gesto del usuario) para que el
    // navegador no la bloquee como popup; la redirigimos cuando la ubicación esté lista.
    const ventana = via === 'wa' ? window.open('', '_blank') : null

    const abrir = (loc) => {
      const quien = nombre.trim() || 'Alguien que confía en ti'
      const texto = encodeURIComponent(`🆘 SOS de ${quien}. ${msj.trim()} ${loc}`)
      const url = via === 'wa' ? `https://wa.me/${tel}?text=${texto}` : `sms:${tel}?body=${texto}`
      setEstado('✅ Mensaje listo, abriendo…')
      if (ventana) ventana.location.href = url
      else window.location.href = url
    }

    if (!navigator.geolocation) { abrir('(No se pudo obtener la ubicación)'); return }
    navigator.geolocation.getCurrentPosition(
      (p) => abrir(`https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`),
      () => abrir('(No se pudo obtener la ubicación, llámame por favor)'),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <Modal titulo="🆘 SOS con mi ubicación" onClose={onClose} label="SOS contacto de emergencia">
      <p className="sub" style={{ fontSize: '.9rem' }}>
        Enviaremos un mensaje con tu <b>ubicación georreferenciada</b> a tu persona de confianza.
      </p>
      <label htmlFor="sosNombre">Tu nombre</label>
      <input id="sosNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Maca" />
      <label htmlFor="sosContacto">Teléfono del contacto (con código de país)</label>
      <input id="sosContacto" type="tel" value={fono} onChange={(e) => setFono(e.target.value)} placeholder="Ej: 56912345678" />
      <label htmlFor="sosMsj">Mensaje (puedes editarlo)</label>
      <textarea id="sosMsj" rows={3} value={msj} onChange={(e) => setMsj(e.target.value)} />
      {estado && <div style={{ marginTop: 10, fontSize: '.85rem', color: 'var(--tinta-suave)' }}>{estado}</div>}
      <button className="btn rojo blq" onClick={() => enviar('wa')}>📲 Enviar por WhatsApp</button>
      <button className="btn sec blq" onClick={() => enviar('sms')}>✉️ Enviar por SMS</button>
      <small className="nota">Tu ubicación se obtiene solo con tu permiso y se comparte como enlace de Google Maps. Los datos permanecen en tu dispositivo durante la sesión.</small>
    </Modal>
  )
}
