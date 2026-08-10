import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useDragScroll } from '../dragScroll.js'

// Vodorovný posuvný rad + hlavička sekcie - JEDEN tvar pre celý web: referencie
// na úvode aj články pod produktom. Predtým to bolo napísané len v References.jsx
// a druhé miesto by ho muselo skopírovať.
//
// Na mobile sa swipuje prstom (scroll-snap), myšou sa dá rad chytiť a potiahnuť,
// na desktope k tomu pribudnú šípky v hlavičke - natívny scroll ostáva vždy funkčný.

// Hlavička sekcie s pravým stĺpcom: vľavo eyebrow + titulok, vpravo odkaz na plný
// zoznam a (voliteľne) šípky. Odkaz je zámerne BEZ ikony: v rade so šípkami by
// vedľa seba stáli dva rôzne druhy šípky.
export function CarouselHead({ ey, title, allTo, allLabel, arrows }) {
  return (
    <div className="sec-h sec-h-row">
      <div>
        {ey && <span className="ey">{ey}</span>}
        <h2>{title}</h2>
      </div>
      <div className="sec-h-act">
        {allTo && <Link to={allTo} className="arrow-link">{allLabel}</Link>}
        {arrows}
      </div>
    </div>
  )
}

// Odkaz (a prípadne šípky) pod radom - na mobile, kde hlavička pravý stĺpec nemá.
export function CarouselFoot({ allTo, allLabel, arrows }) {
  return (
    <div className="carou-foot-m">
      {allTo && <Link to={allTo} className="arrow-link">{allLabel}</Link>}
      {arrows}
    </div>
  )
}

export function CarouselSection({
  ey, title, allTo, allLabel, label = 'položky', className = '', children,
}) {
  const track = useRef(null)
  const [nav, setNav] = useState({ start: true, end: true })
  useDragScroll(track)

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

  // šípky sú bežné tlačidlá (.btn), len v štvorcovom formáte - nie krúžky.
  // Tá istá dvojica sa kreslí na desktope v hlavičke sekcie a na mobile pod radom.
  const arrows = (
    <div className="carou-nav">
      <button type="button" className="btn" onClick={() => go(-1)} disabled={nav.start} aria-label={`Předchozí ${label}`}>
        <IconChevronLeft size={20} stroke={2.2} />
      </button>
      <button type="button" className="btn" onClick={() => go(1)} disabled={nav.end} aria-label={`Další ${label}`}>
        <IconChevronRight size={20} stroke={2.2} />
      </button>
    </div>
  )

  return (
    <>
      <CarouselHead ey={ey} title={title} allTo={allTo} allLabel={allLabel} arrows={arrows} />
      <div className={`carou-track ${className}`.trim()} ref={track} onScroll={sync}>
        {children}
      </div>
      <CarouselFoot allTo={allTo} allLabel={allLabel} arrows={arrows} />
    </>
  )
}
