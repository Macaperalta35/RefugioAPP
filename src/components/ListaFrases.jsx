import { useState } from 'react'

/** Chips de sugerencias + frases propias. Las seleccionadas quedan en `valor`. */
export default function ListaFrases({ id, titulo, sugeridas, valor, onChange, placeholder }) {
  const [nueva, setNueva] = useState('')
  const alternar = (f) => onChange(valor.includes(f) ? valor.filter((x) => x !== f) : [...valor, f])
  const agregar = () => {
    const f = nueva.trim()
    if (f && !valor.includes(f)) onChange([...valor, f])
    setNueva('')
  }
  const propias = valor.filter((f) => !sugeridas.includes(f))

  return (
    <fieldset className="opciones">
      <legend>{titulo}</legend>
      <div className="frases">
        {[...sugeridas, ...propias].map((f) => (
          <button key={f} type="button" className={`chipf ${valor.includes(f) ? 'on' : ''}`}
            aria-pressed={valor.includes(f)} onClick={() => alternar(f)}>
            {valor.includes(f) ? '✓ ' : ''}{f}
          </button>
        ))}
      </div>
      <div className="frase-nueva">
        <input id={id} value={nueva} maxLength={80} placeholder={placeholder} aria-label={`Agregar: ${titulo}`}
          onChange={(e) => setNueva(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregar() } }} />
        <button type="button" className="btn sec" onClick={agregar}>➕</button>
      </div>
    </fieldset>
  )
}
