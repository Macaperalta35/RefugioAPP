export default function Modal({ titulo, onClose, children, label }) {
  return (
    <div className="modal-bg" role="dialog" aria-modal="true" aria-label={label || titulo}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h2>{titulo}</h2>
          <button className="cerrar" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
