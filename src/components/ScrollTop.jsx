import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top whenever the route changes (so product pages start at the top).
export default function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
