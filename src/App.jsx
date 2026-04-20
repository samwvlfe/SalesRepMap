import { useState, useEffect, useCallback } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useContacts } from './hooks/useContacts'
import ContactList from './components/ContactList'
import ContactPopup from './components/ContactPopup'
import Header from './components/Header'
import CreateListModal from './components/CreateListModal'
import Toast from './components/Toast'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const leadStatusColors = {
  CONNECTED: '#22c55e',
  ATTEMPTED_TO_CONTACT: '#eab308',
  NEW: '#3b82f6',
}

const DEFAULT_VIEW = { longitude: -79.51959, latitude: 33.42633, zoom: 7 }

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('hs_access_token'))
  const { contacts } = useContacts(token)
  const [selected, setSelected] = useState(null)
  const [listOpen, setListOpen] = useState(false)
  const [initialView, setInitialView] = useState(null)
  const [selectedIds, setSelectedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('salesmap_selected_contacts')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })
  const [showCreateList, setShowCreateList] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const createHubSpotList = useCallback(async (listName) => {
    setShowCreateList(false)
    setListLoading(true)
    const token = localStorage.getItem('hs_access_token')
    const contactIds = [...selectedIds]
    console.log('contactIds:', contactIds, typeof contactIds[0])
    try {
      const res = await fetch('http://localhost:3001/api/lists/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listName, contactIds: [...selectedIds] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create list')
      setToast({ message: `List "${data.listName}" created with ${selectedIds.size} contacts`, type: 'success' })
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setListLoading(false)
    }
  }, [selectedIds])

  const toggleSelect = (contact) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(contact.id)) next.delete(contact.id)
      else next.add(contact.id)
      localStorage.setItem('salesmap_selected_contacts', JSON.stringify([...next]))
      return next
    })
  }

  const clearAll = () => {
    setSelectedIds(new Set())
    localStorage.removeItem('salesmap_selected_contacts')
  }

  const selectAll = (filteredContacts) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      filteredContacts.forEach(c => next.add(c.id))
      localStorage.setItem('salesmap_selected_contacts', JSON.stringify([...next]))
      return next
    })
  }

  useEffect(() => {
    if (contacts.length === 0) return
    const selectedContacts = contacts.filter(c => selectedIds.has(c.id))
    localStorage.setItem('salesmap_selected_contacts_data', JSON.stringify(selectedContacts))
  }, [selectedIds, contacts])

  useEffect(() => {
    if (!navigator.geolocation) {
      setInitialView(DEFAULT_VIEW)
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setInitialView({ longitude: coords.longitude, latitude: coords.latitude, zoom: 9 }),
      () => setInitialView(DEFAULT_VIEW)
    )
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')
    if (token) {
      localStorage.setItem('hs_access_token', token)
      setToken(token)
      window.history.replaceState({}, '', '/') // clean the URL
    }
  }, [])

  if (!initialView) return null

  return (
    <>
      <Header />
      <Map
        initialViewState={initialView}
        style={{ width: '100vw', height: '95vh' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        projection="mercator"
      >
        {contacts.map(contact => {
          if (!contact.coordinates) return null
          return (
            <Marker
              key={contact.id}
              longitude={contact.coordinates[0]}
              latitude={contact.coordinates[1]}
              anchor="bottom"
              onClick={() => setSelected(contact)}
            >
              <div style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: leadStatusColors[contact.properties?.hs_lead_status] || '#888',
                border: '2px solid white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
              }} />
            </Marker>
          )
        })}
      </Map>
      <ContactPopup
        contact={selected}
        listOpen={listOpen}
        onClose={() => setSelected(null)}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />
      <ContactList
        contacts={contacts}
        open={listOpen}
        onToggle={() => setListOpen(o => !o)}
        onSelectContact={setSelected}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onSelectAll={selectAll}
        onClearAll={clearAll}
        onCreateList={() => setShowCreateList(true)}
        listLoading={listLoading}
      />
      {showCreateList && (
        <CreateListModal
          contactCount={selectedIds.size}
          onConfirm={createHubSpotList}
          onClose={() => setShowCreateList(false)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  )
}
