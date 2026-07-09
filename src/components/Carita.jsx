const BOCAS = {
  feliz: 'M24 46 Q37 58 50 46',
  triste: 'M24 52 Q37 42 50 52',
  ansioso: 'M24 50 Q30 46 37 50 Q44 54 50 50',
  enojado: 'M25 52 L49 52',
  cansado: 'M28 50 Q37 54 46 50',
  neutro: 'M27 50 L47 50',
}

const CEJAS = {
  enojado: [['M20 26 L32 31'], ['M54 26 L42 31']],
  triste: [['M20 30 L32 27'], ['M54 30 L42 27']],
  ansioso: [['M21 27 L32 29'], ['M53 27 L42 29']],
}

/** Caricatura SVG animable para estados de ánimo */
export default function Carita({ expr = 'neutro', color = '#7FA792' }) {
  const cejas = CEJAS[expr] || []
  return (
    <svg viewBox="0 0 74 74" width="100%" height="100%" aria-hidden="true">
      <circle cx="37" cy="37" r="34" fill={color} />
      <circle cx="37" cy="37" r="34" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
      {cejas.map(([d], i) => (
        <path key={i} d={d} stroke="#2C3833" strokeWidth="3" strokeLinecap="round" />
      ))}
      {expr === 'cansado' ? (
        <>
          <path d="M25 37 Q30 41 35 37" stroke="#2C3833" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M39 37 Q44 41 49 37" stroke="#2C3833" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <g className="ojo" style={{ transformOrigin: '30px 37px' }}><circle cx="30" cy="37" r="4" fill="#2C3833" /></g>
          <g className="ojo" style={{ transformOrigin: '44px 37px' }}><circle cx="44" cy="37" r="4" fill="#2C3833" /></g>
        </>
      )}
      <path d={BOCAS[expr] || BOCAS.neutro} stroke="#2C3833" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {expr === 'ansioso' && (<><circle cx="58" cy="24" r="3.5" fill="#6FA8C9" /><circle cx="63" cy="32" r="2.5" fill="#6FA8C9" /></>)}
      {expr === 'feliz' && (<><circle cx="24" cy="45" r="4" fill="rgba(255,255,255,.45)" /><circle cx="50" cy="45" r="4" fill="rgba(255,255,255,.45)" /></>)}
    </svg>
  )
}
