// Espacios de calma iniciales. En el futuro: reemplazar por fetch a una API.
export const ESPACIOS_INICIALES = [
  { id: 1, n: 'Parque Ecuador', lat: -36.8329, lng: -73.0522, tags: ['naturaleza', 'silencio', 'accesible'], d: 'Amplio parque urbano con sombra y bancas, ideal para caminar y regular.' },
  { id: 2, n: 'Biblioteca Municipal de Concepción', lat: -36.827, lng: -73.0503, tags: ['techado', 'silencio', 'accesible', 'sensorial'], d: 'Espacio techado, silencioso y de baja estimulación.' },
  { id: 3, n: 'Laguna Redonda', lat: -36.8065, lng: -73.057, tags: ['naturaleza', 'silencio'], d: 'Laguna tranquila con senderos y aves para observar.' },
  { id: 4, n: 'Parque Tumbes, Talcahuano', lat: -36.708, lng: -73.105, tags: ['naturaleza'], d: 'Cerro con senderos y vistas al mar, aire limpio.' },
  { id: 5, n: 'Cerro Santa Lucía', lat: -33.4402, lng: -70.644, tags: ['naturaleza', 'silencio'], d: 'Rincones tranquilos y jardines en pleno centro de Santiago.' },
  { id: 6, n: 'Parque Bicentenario', lat: -33.4066, lng: -70.6014, tags: ['naturaleza', 'accesible'], d: 'Extensas áreas verdes junto a la laguna, muy accesible.' },
  { id: 7, n: 'Biblioteca de Santiago', lat: -33.446, lng: -70.6797, tags: ['techado', 'silencio', 'accesible', 'sensorial'], d: 'Salas silenciosas, techadas y con zonas de baja estimulación.' },
  { id: 8, n: 'Parque Quinta Normal', lat: -33.4415, lng: -70.681, tags: ['naturaleza', 'accesible'], d: 'Parque histórico con lagunas, árboles centenarios y espacios amplios.' },
]

export const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'naturaleza', label: '🌳 Naturaleza' },
  { id: 'silencio', label: '🤫 Silencio' },
  { id: 'techado', label: '🏠 Techado' },
  { id: 'accesible', label: '♿ Accesible' },
  { id: 'sensorial', label: '🧩 Bajo estímulo sensorial' },
]
