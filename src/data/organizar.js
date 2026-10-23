// Herramientas de organización pensadas para TDAH: agenda, rutinas y lista de compras.

export const CATEGORIAS_EVENTO = [
  { id: 'estudio', ic: '📚', t: 'Estudio' },
  { id: 'trabajo', ic: '💼', t: 'Trabajo' },
  { id: 'salud', ic: '🩺', t: 'Salud' },
  { id: 'casa', ic: '🏠', t: 'Casa' },
  { id: 'personal', ic: '🎉', t: 'Personal' },
]

export const PLANTILLAS_RUTINA = [
  {
    nombre: 'Rutina de mañana', ic: '🌅',
    pasos: [['💧 Tomar un vaso de agua', 1], ['🚿 Ducharme', 10], ['👕 Vestirme', 5], ['🥣 Desayunar', 15], ['💊 Tomar mis remedios', 1], ['🎒 Revisar mochila o bolso', 3]],
  },
  {
    nombre: 'Rutina de noche', ic: '🌙',
    pasos: [['👕 Dejar lista la ropa de mañana', 5], ['🔌 Cargar el celular', 1], ['🪥 Lavarme los dientes', 3], ['📵 Apagar pantallas', 1], ['📖 Leer o respirar 5 minutos', 5]],
  },
  {
    nombre: 'Antes de estudiar', ic: '📚',
    pasos: [['🧹 Despejar el escritorio', 3], ['💧 Tener agua a mano', 1], ['🔕 Silenciar el celular', 1], ['🎯 Elegir UNA tarea', 1], ['⏱️ Estudiar 15 minutos y descansar 5', 20]],
  },
]

export const CATEGORIAS_COMPRA = [
  { id: 'frutas', ic: '🥦', t: 'Frutas y verduras' },
  { id: 'despensa', ic: '🥫', t: 'Despensa' },
  { id: 'lacteos', ic: '🥛', t: 'Lácteos y huevos' },
  { id: 'carnes', ic: '🍗', t: 'Carnes y pescados' },
  { id: 'limpieza', ic: '🧼', t: 'Limpieza e higiene' },
  { id: 'otros', ic: '🛍️', t: 'Otros' },
]
