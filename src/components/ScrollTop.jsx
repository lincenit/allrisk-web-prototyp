import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top whenever the route changes (so product pages start at the top).
// `behavior: 'instant'` prebíja globálne html{scroll-behavior:smooth} – inak by sa
// nová stránka pri každom prekliku najprv odrolovala zdola nahor. Plynulý scroll
// tak ostáva len tam, kam patrí: pri kotvách v rámci jednej stránky.
export default function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return null
}
