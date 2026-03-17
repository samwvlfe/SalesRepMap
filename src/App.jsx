import { useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useContacts } from './hooks/useContacts'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const stageColors = {
  customer: '#1D9E75',
  lead: '#378ADD',
  opportunity: '#BA7517',
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
          onClick={() => setSelected(contact)}
        >
          <div style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: stageColors[contact.lifecycleStage] || '#888',
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