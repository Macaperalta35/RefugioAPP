// Opciones sugeridas para la tarjeta de crisis (la persona puede agregar las suyas)
export const MENSAJE_INICIAL = 'Estoy pasando por una crisis y me cuesta hablar. Por favor, ten paciencia.'

export const AYUDA_SUGERIDA = [
  'Háblame despacio y con frases cortas',
  'Llévame a un lugar tranquilo',
  'Dame espacio y tiempo',
  'Ofréceme agua',
  'Déjame usar mis audífonos',
  'Quédate cerca, en silencio',
  'Respira lento conmigo',
  'Llama a mi contacto',
]

export const EVITAR_SUGERIDO = [
  'No me toques sin preguntar',
  'No me hables fuerte',
  'No me pidas que hable',
  'No me dejes sola/o',
  'No me rodeen muchas personas',
  'No me apures',
]

export const TARJETA_VACIA = {
  nombre: '',
  mensaje: MENSAJE_INICIAL,
  condicion: '',
  ayuda: [],
  evitar: [],
  medico: '',
  contactoNombre: '',
  contactoFono: '',
}
