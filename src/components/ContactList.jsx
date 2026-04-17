import { useState, useMemo } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import './ContactList.css'

const LEAD_STATUS_COLORS = {
  CONNECTED: '#22c55e',
  ATTEMPTED_TO_CONTACT: '#eab308',
  NEW: '#3b82f6',
  IN_PROGRESS: '#a855f7',
  OPEN: '#6b7280',
  UNQUALIFIED: '#ef4444',
}

const BADGE_LABELS = {
  CONNECTED: 'Connected',
  ATTEMPTED_TO_CONTACT: 'Attempted',
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  OPEN: 'Open',
  UNQUALIFIED: 'Unqualified',
}

function hexWithAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function ContactList({ contacts = [], open, onToggle, onSelectContact, selectedIds = new Set(), onToggleSelect, onSelectAll }) {
  const [statusFilter, setStatusFilter] = useState('')
  const [addressSearch, setAddressSearch] = useState('')

  const leadStatuses = useMemo(() => {
    const statuses = contacts
      .map(c => c.properties?.hs_lead_status)
      .filter(Boolean)
    return [...new Set(statuses)].sort()
  }, [contacts])

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const p = c.properties || {}
      const addressFields = [p.address, p.city, p.state, p.zip]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesStatus = !statusFilter || p.hs_lead_status === statusFilter
      const matchesAddress = !addressSearch ||
        addressFields.includes(addressSearch.toLowerCase())

      return matchesStatus && matchesAddress
    })
  }, [contacts, statusFilter, addressSearch])

  const totalWithCoords = contacts.filter(c => c.coordinates).length

  return (
    <>
      {/* Toggle button */}
      <button className="contact-list-toggle" onClick={onToggle}>
        {open ? '✕' : '☰'}
      </button>

      {/* Sliding panel */}
      <div className={`contact-list-panel ${open ? 'open' : ''}`}>

        {/* Header */}
        <div className="contact-list-header">
          <div className="contact-list-header-text">
            <span className="contact-list-title">Contacts</span>
            <span className="contact-list-count">
              {filtered.length} of {contacts.length} shown
            </span>
            <div className='sel-all' onClick={() => onSelectAll?.(filtered)}>
              Select All {selectedIds.size > 0 && <span className="sel-count">{selectedIds.size} selected</span>}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="contact-list-filters">
          <select
            className="contact-list-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All lead statuses</option>
            {leadStatuses.map(s => (
              <option key={s} value={s}>
                {BADGE_LABELS[s] || s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <input
            className="contact-list-search"
            type="text"
            placeholder="Search address, city, state..."
            value={addressSearch}
            onChange={e => setAddressSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <ul className="contact-list-items">
          {filtered.length === 0 ? (
            <li className="contact-list-empty">No contacts match your filters</li>
          ) : (
            filtered.map(contact => {
              const p = contact.properties || {}
              const name = [p.firstname, p.lastname].filter(Boolean).join(' ') || 'Unknown'
              const color = LEAD_STATUS_COLORS[p.hs_lead_status] || '#888'
              const badgeLabel = BADGE_LABELS[p.hs_lead_status]
              const location = [p.city, p.state].filter(Boolean).join(', ')
              const hasCoords = !!contact.coordinates

              return (
                <li
                  key={contact.id}
                  className={`contact-list-item${hasCoords ? '' : ' no-coords'}`}
                  onClick={() => hasCoords && onSelectContact?.(contact)}
                >
                  <span
                    className="contact-list-pip"
                    style={{
                      background: color,
                      boxShadow: `0 0 0 3px ${hexWithAlpha(color, 0.15)}`,
                    }}
                  />
                  <div className="contact-list-info">
                    <div className="contact-list-name">{name}</div>
                    {p.company && (
                      <div className="contact-list-company">{p.company}</div>
                    )}
                    {location && (
                      <div className="contact-list-location">{location}</div>
                    )}
                  </div>
                  {badgeLabel && (
                    <span
                      className="contact-list-badge"
                      style={{
                        background: hexWithAlpha(color, 0.12),
                        color: color,
                      }}
                    >
                      {badgeLabel}
                    </span>
                  )}
                  <div
                    className={`add-to-list${selectedIds.has(contact.id) ? ' selected' : ''}`}
                    title="Add To List"
                    onClick={e => { e.stopPropagation(); onToggleSelect?.(contact) }}
                  >
                    <IoMdAddCircle size={22} />
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </>
  )
}