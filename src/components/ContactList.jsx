import { useState, useMemo } from 'react'
import { IoMdAddCircle, IoMdRemoveCircle } from 'react-icons/io'
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

export default function ContactList({ contacts = [], open, onToggle, onSelectContact, selectedIds = new Set(), onToggleSelect, onSelectAll, onClearAll, onCreateList, listLoading }) {
  const [tab, setTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [addressSearch, setAddressSearch] = useState('')

  const leadStatuses = useMemo(() => {
    const statuses = contacts.map(c => c.properties?.hs_lead_status).filter(Boolean)
    return [...new Set(statuses)].sort()
  }, [contacts])

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const p = c.properties || {}
      const addressFields = [p.address, p.city, p.state, p.zip].filter(Boolean).join(' ').toLowerCase()
      const matchesStatus = !statusFilter || p.hs_lead_status === statusFilter
      const matchesAddress = !addressSearch || addressFields.includes(addressSearch.toLowerCase())
      return matchesStatus && matchesAddress
    })
  }, [contacts, statusFilter, addressSearch])

  const selectedContacts = useMemo(() => {
    return contacts.filter(c => selectedIds.has(c.id))
  }, [contacts, selectedIds])

  return (
    <>
      <button className="contact-list-toggle" onClick={onToggle}>
        {open ? '✕' : '☰'}
      </button>

      <div className={`contact-list-panel ${open ? 'open' : ''}`}>

        {/* Tabs */}
        <div className="contact-list-tabs">
          <button
            className={`contact-list-tab${tab === 'all' ? ' active' : ''}`}
            onClick={() => setTab('all')}
          >
            All Contacts
            <span className="tab-count">{contacts.length}</span>
          </button>
          <button
            className={`contact-list-tab${tab === 'selected' ? ' active' : ''}`}
            onClick={() => setTab('selected')}
          >
            Selected
            {selectedIds.size > 0 && (
              <span className="tab-count tab-count-selected">{selectedIds.size}</span>
            )}
          </button>
        </div>

        {tab === 'all' && (
          <>
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
              <div className="sel-all" onClick={() => onSelectAll?.(filtered)}>
                Select All Shown
                {selectedIds.size > 0 && (
                  <span className="sel-count">{selectedIds.size} selected</span>
                )}
              </div>
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
                  const isSelected = selectedIds.has(contact.id)

                  return (
                    <li
                      key={contact.id}
                      className={`contact-list-item${hasCoords ? '' : ' no-coords'}${isSelected ? ' item-selected' : ''}`}
                      onClick={() => hasCoords && onSelectContact?.(contact)}
                    >
                      <span
                        className="contact-list-pip"
                        style={{ background: color, boxShadow: `0 0 0 4px ${hexWithAlpha(color, 0.18)}` }}
                      />
                      <div className="contact-list-info">
                        <div className="contact-list-name">{name}</div>
                        <div className="contact-list-meta">
                          {p.company && <span>{p.company}</span>}
                          {p.company && location && <span className="meta-dot">·</span>}
                          {location && <span>{location}</span>}
                        </div>
                      </div>
                      {badgeLabel && (
                        <span
                          className="contact-list-badge"
                          style={{ background: hexWithAlpha(color, 0.12), color }}
                        >
                          {badgeLabel}
                        </span>
                      )}
                      <div
                        className={`add-to-list${isSelected ? ' selected' : ''}`}
                        title={isSelected ? 'Remove from list' : 'Add to list'}
                        onClick={e => { e.stopPropagation(); onToggleSelect?.(contact) }}
                      >
                        {isSelected
                          ? <IoMdRemoveCircle size={22} />
                          : <IoMdAddCircle size={22} />}
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </>
        )}

        {tab === 'selected' && (
          <div className="selected-tab-body">
            {selectedContacts.length > 0 && (
              <div className="selected-tab-toolbar">
                <span>{selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected</span>
                <div className="toolbar-actions">
                  <button
                    className="create-list-btn"
                    onClick={onCreateList}
                    disabled={listLoading}
                  >
                    {listLoading ? 'Creating…' : '+ HubSpot List'}
                  </button>
                  <button className="clear-all-btn" onClick={onClearAll}>Clear</button>
                </div>
              </div>
            )}
            {selectedContacts.length === 0 ? (
              <div className="contact-list-empty">
                No contacts selected.<br />
                <span style={{ fontSize: 12, color: '#bbb' }}>Use the + button in the All Contacts tab.</span>
              </div>
            ) : (
              <ul className="selected-contact-list">
                {selectedContacts.map(contact => {
                  const p = contact.properties || {}
                  const name = [p.firstname, p.lastname].filter(Boolean).join(' ') || 'Unknown'
                  const color = LEAD_STATUS_COLORS[p.hs_lead_status] || '#888'
                  const badgeLabel = BADGE_LABELS[p.hs_lead_status]
                  const hasCoords = !!contact.coordinates

                  return (
                    <li
                      key={contact.id}
                      className={`selected-contact-item${hasCoords ? '' : ' no-coords'}`}
                      onClick={() => hasCoords && onSelectContact?.(contact)}
                    >
                      <div className="selected-contact-header">
                        <span
                          className="contact-list-pip"
                          style={{ background: color, boxShadow: `0 0 0 3px ${hexWithAlpha(color, 0.15)}` }}
                        />
                        <span className="selected-contact-name">{name}</span>
                        {badgeLabel && (
                          <span
                            className="contact-list-badge"
                            style={{ background: hexWithAlpha(color, 0.12), color }}
                          >
                            {badgeLabel}
                          </span>
                        )}
                        <div
                          className="add-to-list selected"
                          title="Remove from list"
                          onClick={e => { e.stopPropagation(); onToggleSelect?.(contact) }}
                        >
                          <IoMdRemoveCircle size={20} />
                        </div>
                      </div>
                      <div className="selected-contact-details">
                        {p.company && <div><span className="detail-label">Company</span>{p.company}</div>}
                        {p.email && <div><span className="detail-label">Email</span>{p.email}</div>}
                        {p.phone && <div><span className="detail-label">Phone</span>{p.phone}</div>}
                        {(p.address || p.city || p.state || p.zip) && (
                          <div>
                            <span className="detail-label">Address</span>
                            {[p.address, p.city, p.state, p.zip].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}

      </div>
    </>
  )
}
