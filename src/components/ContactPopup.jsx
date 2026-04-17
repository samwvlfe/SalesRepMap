import './ContactPopup.css'
import { IoClose } from 'react-icons/io5'
import { IoMdAddCircle } from 'react-icons/io'

const LEAD_STATUS_COLORS = {
  CONNECTED: '#22c55e',
  ATTEMPTED_TO_CONTACT: '#eab308',
  NEW: '#3b82f6',
  IN_PROGRESS: '#a855f7',
  OPEN: '#6b7280',
  UNQUALIFIED: '#ef4444',
}

export default function ContactPopup({ contact, listOpen, onClose, selectedIds = new Set(), onToggleSelect }) {
  if (!contact) return null

  const p = contact.properties || {}
  const name = [p.firstname, p.lastname].filter(Boolean).join(' ')
  const photo = p.twitterprofilephoto || p.hs_avatar_filemanager_key || p.photo_url || null
  const initials = [p.firstname?.[0], p.lastname?.[0]].filter(Boolean).join('')

  return (
    <div className={`user-popup${listOpen ? ' list-open' : ''}`}>
      <div className="user-popup-hdr">
        <div className="hdr-toprow">
          <div
            className={`add${selectedIds.has(contact.id) ? ' selected' : ''}`}
            title="Add To List"
            onClick={() => onToggleSelect?.(contact)}
          >
            <IoMdAddCircle size={30} />
          </div>
          <div className="contact-title-cont">
            <div className="contact-thumbnail">
              {photo
                ? <img src={photo} alt="contact" />
                : <div className="initials-avatar">{initials}</div>
              }
            </div>
            <div className="contact-title stack">
              <div className="contact-name">{name}</div>
              <div className="contact-company">{p.company || ''}</div>
            </div>
          </div>
          <div className="exit" onClick={onClose}><IoClose size={22} /></div>
        </div>
      </div>

      <div className="user-popup-content stack">
        {/* <div className="content-title">Contact Info</div> */}

        <div className="content-box">
          <div className="stack">
            <div className="box-title">Phone Number</div>
            <a className="box-content hov" href={p.phone ? `tel:${p.phone}` : undefined} style={{ display: p.phone ? '' : 'none' }}>{p.phone}</a>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Email</div>
            <a className="box-content hov" href={p.email ? `mailto:${p.email}` : undefined} style={{ display: p.email ? '' : 'none' }}>{p.email}</a>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Job Title</div>
            <div className="box-content" style={{ display: p.jobtitle ? '' : 'none' }}>{p.jobtitle}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Company Name</div>
            <div className="box-content" style={{ display: p.company ? '' : 'none' }}>{p.company}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Contact Owner</div>
            <div className="box-content" style={{ display: p.hs_owner_id ? '' : 'none' }}>{p.hs_owner_id}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Lifecycle Stage</div>
            <div className="box-content" style={{ display: p.lifecyclestage ? '' : 'none' }}>{p.lifecyclestage}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Lead Status</div>
            <div className="box-content" style={{ display: p.hs_lead_status ? '' : 'none', color: LEAD_STATUS_COLORS[p.hs_lead_status] }}>{p.hs_lead_status}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Street Address</div>
            <div className="box-content" style={{ display: p.address ? '' : 'none' }}>{p.address}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">City</div>
            <div className="box-content" style={{ display: p.city ? '' : 'none' }}>{p.city}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">State/Region</div>
            <div className="box-content" style={{ display: p.state ? '' : 'none' }}>{p.state}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Postal Code</div>
            <div className="box-content" style={{ display: p.zip ? '' : 'none' }}>{p.zip}</div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Notes</div>
            <div className="box-content" style={{ display: 'none' }}></div>
          </div>
        </div>
        <div className="content-box">
          <div className="stack">
            <div className="box-title">Message</div>
            <div className="box-content" style={{ display: 'none' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
