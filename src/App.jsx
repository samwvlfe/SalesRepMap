import { useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useContacts } from './hooks/useContacts'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const leadStatusColors = {
  CONNECTED: '#22c55e',
  ATTEMPTED_TO_CONTACT: '#eab308',
  NEW: '#3b82f6',
}

export default function App() {
  const { contacts } = useContacts()
  const [selected, setSelected] = useState(null)

  return (
    <Map
      initialViewState={{ longitude: -79.51959, latitude: 33.42633, zoom: 7 }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      projection="mercator"
    >
      {contacts.map(contact => {
      // skip contacts without coordinates for now
      if (!contact.coordinates) return null

      return (
        <Marker
          key={contact.id}
          longitude={contact.coordinates[0]}
          latitude={contact.coordinates[1]}
          anchor="bottom"
          onClick={() => {
              setSelected(contact)
              const p = contact.properties || {}

              const setText = (id, val) =>
                document.querySelectorAll(`[id="${id}"]`).forEach(el => { el.textContent = val || '' })

              document.getElementById('contact_name').textContent =
                [p.firstname, p.lastname].filter(Boolean).join(' ')

              const photo = p.twitterprofilephoto || p.hs_avatar_filemanager_key || p.photo_url || null
              const initials = [p.firstname?.[0], p.lastname?.[0]].filter(Boolean).join('')
              const photoEl = document.getElementById('contact-photo')
              const initialsEl = document.getElementById('contact-initials')
              if (photo) {
                photoEl.src = photo
                photoEl.style.display = 'block'
                initialsEl.style.display = 'none'
              } else {
                photoEl.style.display = 'none'
                initialsEl.textContent = initials
                initialsEl.style.display = 'flex'
              }

              setText('contact_company1', p.company || '')
              setText('contact_company2', p.company || '')
              setText('job_title', p.jobtitle || '')
              setText('contact_owner', p.hs_owner_id || '')
              setText('lifecycle_stage', p.lifecyclestage || '')
              setText('lead_status', p.hs_lead_status || '')
              setText('addy_street', p.address || '')
              setText('addy_city', p.city || '')
              setText('addy_state_region', p.state || '')
              setText('addy_postal', p.zip || '')
              setText('notes', '')
              setText('message', '')

              // email — <a> gets href, <div> gets text
              document.querySelectorAll('[id="contact_email1"]').forEach(el => {
                if (el.tagName === 'A') el.href = p.email ? `mailto:${p.email}` : '#'
                else el.textContent = p.email || ''
              })

              // phone — <a> gets href, <div> gets text
              document.querySelectorAll('[id="phone_number2"]').forEach(el => {
                if (el.tagName === 'A') el.href = p.phone ? `tel:${p.phone}` : '#'
                else el.textContent = p.phone || ''
              })

              document.getElementById('user-popup').style.display = 'flex'
            }}
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
  )
}