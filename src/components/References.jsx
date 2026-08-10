import { IconStarFilled, IconStar } from '@tabler/icons-react'
import { CarouselSection } from './Carousel.jsx'

// Jedna kartička reference - zdieľaná medzi carouselom na úvode a stránkou /reference.
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
        {/* meno a pod ním dátum recenzie - kedy hodnocení vzniklo */}
        <div><b>{r.name}</b><small>{r.date}</small></div>
      </figcaption>
    </figure>
  )
}

// Vodorovný posuvný rad referencií. Celý mechanizmus (track, ťahanie, šípky,
// hlavička sekcie) žije v components/Carousel.jsx - rovnaký rad je aj pod produktom.
export function ReferenceCarousel({ items, allTo = '/reference' }) {
  return (
    <CarouselSection
      ey="Reference"
      title={<>Co říkají <b>klienti</b></>}
      allTo={allTo} allLabel="Všechny reference" label="reference"
    >
      {items.map((r) => <ReferenceCard key={r.name} r={r} />)}
    </CarouselSection>
  )
}
