import { useState, useEffect, useRef } from 'react'
import './CreateListModal.css'

export default function CreateListModal({ contactCount, onConfirm, onClose }) {
  const [name, setName] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) onConfirm(name.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Create HubSpot List</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-subtitle">
          {contactCount} contact{contactCount !== 1 ? 's' : ''} will be added to this list.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="modal-input"
            type="text"
            placeholder="List name…"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={100}
          />
          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-confirm" disabled={!name.trim()}>
              Create List
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
