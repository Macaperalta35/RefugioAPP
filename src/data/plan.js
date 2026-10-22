// Plan de seguridad personal, basado en el modelo de Stanley y Brown (Safety Planning Intervention).
// Los pasos se siguen en orden: si uno no basta, se pasa al siguiente.
export const PASOS_PLAN = [
  {
    id: 'senales', num: 1, ic: '⚠️', titulo: 'Mis señales de alerta',
    pregunta: '¿Qué pensamientos, emociones o situaciones me avisan que se acerca una crisis?',
    sugeridas: ['No puedo dormir', 'Me aíslo de los demás', 'Siento que soy una carga', 'Pienso que nada va a mejorar', 'Discusiones o conflictos', 'Sobrecarga sensorial', 'Dejo de comer o como de más'],
  },
  {
    id: 'estrategias', num: 2, ic: '🌬️', titulo: 'Lo que puedo hacer por mi cuenta',
    pregunta: '¿Qué me ayuda a calmarme o distraerme sin tener que contactar a nadie?',
    sugeridas: ['Respiración 4-7-8', 'Grounding 5-4-3-2-1', 'Escuchar música', 'Salir a caminar', 'Darme una ducha', 'Usar los mini-juegos de Refugio', 'Abrazar mi objeto de calma', 'Escribir lo que siento'],
  },
  {
    id: 'distraccion', num: 3, ic: '🫂', titulo: 'Personas y lugares que me distraen',
    pregunta: '¿Con quién o dónde puedo estar para sentirme acompañada/o, sin necesidad de hablar de la crisis?',
    sugeridas: ['Una plaza o parque cercano', 'La biblioteca', 'La casa de un familiar', 'Un café tranquilo'],
    contactos: true,
  },
  {
    id: 'ayuda', num: 4, ic: '🤝', titulo: 'Personas a quienes puedo pedir ayuda',
    pregunta: '¿A quién puedo contarle que no estoy bien?',
    soloContactos: true,
  },
  {
    id: 'profesionales', num: 5, ic: '🩺', titulo: 'Profesionales y servicios',
    pregunta: '¿Qué profesional me atiende? Las líneas de ayuda aparecen siempre en este paso.',
    soloContactos: true, lineas: true,
  },
  {
    id: 'entorno', num: 6, ic: '🔒', titulo: 'Hacer mi entorno más seguro',
    pregunta: '¿Qué puedo hacer para alejar de mí las cosas con las que podría hacerme daño?',
    sugeridas: ['Pedir a alguien de confianza que guarde mis medicamentos', 'Alejar objetos con los que podría hacerme daño', 'No quedarme sola/o', 'Evitar el alcohol y otras drogas'],
  },
]

export const RAZONES_SUGERIDAS = ['Mi familia', 'Mis amistades', 'Mis mascotas', 'Mis metas y sueños']

export const PLAN_VACIO = {
  razones: [],
  senales: [],
  estrategias: [],
  distraccion: [], distraccionContactos: [],
  ayudaContactos: [],
  profesionalesContactos: [],
  entorno: [],
}
