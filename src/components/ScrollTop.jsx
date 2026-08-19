import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top whenever the route changes (so product pages start at the top).
// `behavior: 'instant'` prebíja globálne html{scroll-behavior:smooth} - inak by sa
// nová stránka pri každom prekliku najprv odrolovala zdola nahor. Plynulý scroll
// tak ostáva len tam, kam patrí: pri kotvách v rámci jednej stránky.
//
// Výnimka pre kotvu: odkaz typu /#spoluprace mieri DOVNÚTRA stránky, ktorá
// sa práve montuje. Prehliadač na hash sám neskočí (router mení históriu, nie
// dokument) a tento efekt by ho aj tak prebil skokom na začiatok. Cieľ preto
// hľadáme až po vykreslení - requestAnimationFrame stačí, sekcie sú v prvom
// renderi. Keď cieľ neexistuje, správame sa ako predtým: hore.
//
// Kotva na TEJ ISTEJ stránke (`<a href="#prof-situace">` v hero na profile) sem ale
// nepatrí. Prehliadač na ňu scrolluje sám a plynulo, lenže fragment zároveň vystrelí
// `popstate`, router si prepíše `hash` a tento efekt mu ten plynulý scroll prebil
// skokom - preto to doteraz skočilo pri každom prvom kliku na kotvu a plynulé to
// bolo až pri druhom (rovnaký hash = žiadna zmena polohy = efekt sa nespustil).
// Pamätáme si teda predošlú cestu: keď sa nezmenila, nerobíme nič.
//
// rAF sa zámerne neruší v cleanupe: v StrictMode beží efekt pri montáži dvakrát a
// druhý beh už vidí rovnakú cestu, takže by zrušený skok nikto nezopakoval a priamy
// odkaz s kotvou (/profil/rodina#prof-situace) by skončil hore. Keby sa cesta zmenila
// ešte v tom jednom snímku, cieľ na novej stránke neexistuje a fallback je aj tak hore.
export default function ScrollTop() {
  const { pathname, hash } = useLocation()
  const prev = useRef(null)

  useEffect(() => {
    const samePage = prev.current === pathname
    prev.current = pathname
    if (samePage) return

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    requestAnimationFrame(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
  }, [pathname, hash])

  return null
}
