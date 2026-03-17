import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken) {
      localStorage.setItem('hs_access_token', accessToken)
      localStorage.setItem('hs_refresh_token', refreshToken)
      navigate('/map')
    } else {
      navigate('/')
    }
  }, [])

  return <div>Connecting...</div>
}