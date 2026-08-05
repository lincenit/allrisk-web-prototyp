import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { IconStarFilled, IconStar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

// Jedna kartička reference – zdieľaná medzi carouselom na úvode a stránkou /reference.
export function ReferenceCard({ r }) {
  return (
    <figure className="ref">
      <div className="ref-top">
        <div className="stars" aria-label={`Hodnocení ${r.stars} z 5`}>
          {[0, 1, 2, 3, 4].map((i) => (i < r.stars
            ? <IconStarFilled key={i} size={16} />
            : <IconStar key={i} size={16} className="off" />))}
        </div>
        {r.tag && <span className="ref-tag">{r.tag}</span>}
      </div>
      <blockquote><p>„{r.text}“</p></blockquote>
      <figcaption className="who">
        <span className="av">{r.av}</span>
        {/* meno a pod ním dátum recenzie – kedy hodnocení vzniklo */}
        <div><b>{r.name}</b><small>{r.date}</small></div>
      </figcaption>
    </figure>
  )
}

// Vodorovný posuvný rad referencií. Na mobile sa swipuje prstom (scroll-snap),
// na desktope k tomu pribudnú šípky – natívny scroll nechávame vždy funkčný.
export function ReferenceCarousel({ items, allTo = '/reference' }) {
  const track = useRef(null)
  const [nav, setNav] = useState({ start: true, end: true })

  const sync = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setNav({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  // Krok = šírka jednej kartičky vrátane medzery, aby posun vždy dosadol na snap bod.
  const go = (dir) => {
    const el = track.current
    const card = el?.firstElementChild
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: 'smooth' })
  }

  // šípky sú bežné tlačidlá (.btn), len v štvorcovom formáte – nie krúžky.
  // Tá istá dvojica sa kreslí na desktope v hlavičke sekcie a na mobile pod radom.
  const arrows = (
    <div className="carou-nav">
      <button type="button" className="btn" onClick={() => go(-1)} disabled={nav.start} aria-label="Předchozí reference">
        <IconChevronLeft size={20} stroke={2.2} />
      </button>
      <button type="button" className="btn" onClick={() => go(1)} disabled={nav.end} aria-label="Další reference">
        <IconChevronRight size={20} stroke={2.2} />
      </button>
    </div>
  )

  return (
    <>
      <div className="sec-h sec-h-row">
        <div>
          <span className="ey">Reference</span>
          <h2>Co říkají <b>klienti</b></h2>
        </div>
        <div className="sec-h-act">
          <Link to={allTo} className="arrow-link">Všechny reference</Link>
          {arrows}
        </div>
      </div>

      <div className="refs-track" ref={track} onScroll={sync}>
        {items.map((r) => <ReferenceCard key={r.name} r={r} />)}
      </div>

      {/* na mobile sa hlavička nerozdelí na dva stĺpce – odkaz aj šípky preto stoja
          v jednom riadku pod radom: odkaz vľavo, ovládanie vpravo */}
      <div className="refs-foot-m">
        <Link to={allTo} className="arrow-link">Všechny reference</Link>
        {arrows}
      </div>
    </>
  )
}
