import './ContactList.css'

const leadStatusColors = {
  CONNECTED: '#22c55e',
  ATTEMPTED_TO_CONTACT: '#eab308',
  NEW: '#3b82f6',
}

export default function ContactList({ contacts = [], open, onToggle }) {

  return (
    <>
      {/* Toggle button */}
      <button className="contact-list-toggle" onClick={onToggle}>
        {open ? '✕' : '☰'}
      </button>

      {/* Sliding panel */}
      <div className={`contact-list-panel ${open ? 'open' : ''}`}>
        <div className="contact-list-header">
          <span>Contacts ({contacts.filter(c => c.coordinates).length})</span>
        </div>
        <ul className="contact-list-items">
          {contacts.map(contact => {
            const p = contact.properties || {}
            const name = [p.firstname, p.lastname].filter(Boolean).join(' ') || 'Unknown'
            const color = leadStatusColors[p.hs_lead_status] || '#888'

            return (
              <li key={contact.id} className="contact-list-item">
                <span className="contact-list-pip" style={{ background: color }} />
                <div className="contact-list-info">
                  <div className="contact-list-name">{name}</div>
                  {p.company && <div className="contact-list-company">{p.company}</div>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
