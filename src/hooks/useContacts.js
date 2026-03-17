import { useState, useEffect } from 'react'

export function useContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('hs_access_token')

    if (!token) {
      setError('No access token found')
      setLoading(false)
      return
    }

    fetch('http://localhost:3001/api/contacts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('HubSpot contacts:', data)
        setContacts(data.results || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { contacts, loading, error }
}