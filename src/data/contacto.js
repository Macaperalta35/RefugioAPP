// Datos públicos de la creadora (configurables en un solo lugar)
export const CREADORA = {
  nombre: 'Lilith',
  correo: 'macaperalta35@gmail.com',
  github: 'https://github.com/Macaperalta35',
  instagram: 'refugioapp_chile',
}

/** Enlace mailto con asunto y cuerpo ya escritos para enviar una solicitud a la creadora */
export const mailtoCreadora = (asunto, lineas) =>
  `mailto:${CREADORA.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(lineas.join('\n'))}`
