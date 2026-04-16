import './Header.css'

export default function Header() {
  return (
    <header>
      <div className="header">
        <div className="header-txt">DockStar Sales Rep Map</div>
        <div className="map-key">
          <div>
            <div className="pip" style={{ backgroundColor: '#22c55e' }} />
            <div>Connected</div>
          </div>
          <div>
            <div className="pip" style={{ backgroundColor: '#eab308' }} />
            <div>New</div>
          </div>
          <div>
            <div className="pip" style={{ backgroundColor: '#3b82f6' }} />
            <div>Attempted To Connect</div>
          </div>
        </div>
      </div>
    </header>
  )
}
