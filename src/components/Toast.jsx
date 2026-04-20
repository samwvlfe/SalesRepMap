import { useEffect } from 'react'
import './Toast.css'

export default function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={`toast toast-${type}`} onClick={onDismiss}>
      <span className="toast-icon">{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  )
}
