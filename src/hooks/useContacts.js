import { useState, useEffect } from 'react'

export function useContacts(token) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return

    fetch(`http://localhost:3001/api/contacts?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setContacts(data.results || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [token])

  return { contacts, loading, error }
}