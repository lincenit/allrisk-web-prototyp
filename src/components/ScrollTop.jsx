import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top whenever the route changes (so product pages start at the top).
// `behavior: 'instant'` prebíja globálne html{scroll-behavior:smooth} - inak by sa
// nová stránka pri každom prekliku najprv odrolovala zdola nahor. Plynulý scroll
// tak ostáva len tam, kam patrí: pri kotvách v rámci jednej stránky.
//
// Výnimka pre kotvu: odkaz typu /podnikatele#garant mieri DOVNÚTRA stránky, ktorá
// sa práve montuje. Prehliadač na hash sám neskočí (router mení históriu, nie
// dokument) a tento efekt by ho aj tak prebil skokom na začiatok. Cieľ preto
// hľadáme až po vykreslení - requestAnimationFrame stačí, sekcie sú v prvom
// renderi. Keď cieľ neexistuje, správame sa ako predtým: hore.
export default function ScrollTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    let raf = requestAnimationFrame(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}
