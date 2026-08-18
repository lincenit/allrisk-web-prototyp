import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { ReferenceCard } from '../components/References.jsx'
import { SecHead } from '../components/PageParts.jsx'
import { Decor } from '../components/Decor.jsx'
import { Line } from '../components/Line.jsx'
import { REFERENCES, HERO_PHOTO } from '../data/references.js'
import { useHeroHeader } from '../useHeroHeader.js'
import { IconChevronRight, IconStarFilled } from '@tabler/icons-react'

// Filtre podľa oblasti služby - zoznam sa skladá z dát, nech nezostarne pri pridaní referencie.
const ALL = 'Vše'

export default function References() {
  const [tag, setTag] = useState(ALL)
  // hlavička je nad fotkou, takže header musí byť hore priehľadný (ako na /blog)
  useHeroHeader()

  const tags = [ALL, ...Array.from(new Set(REFERENCES.map((r) => r.tag)))]
  const shown = tag === ALL ? REFERENCES : REFERENCES.filter((r) => r.tag === tag)
  const avgNum = REFERENCES.reduce((s, r) => s + r.stars, 0) / REFERENCES.length
  const avg = avgNum.toFixed(1).replace('.', ',')

  return (
    <div className="site">
      {/* ============ HLAVIČKA STRÁNKY ============ */}
      {/* Foto pod modrým gradientom - spoločný recept .photo-hero (wireframe.css).
          Bez eyebrowu: „Reference" už nesie drobečková navigácia, druhýkrát to isté
          slovo je len šum (rovnako ako na /blog). Číslo hodnotenia nie je riadok
          údajov pod vetou, ale samostatná dlaždica vpravo - je to jediná vec,
          ktorú na tejto stránke človek hľadá ako prvú. */}
      <section className="page-head photo-hero">
        <div className="photo-hero-bg" style={{ backgroundImage: `url(${HERO_PHOTO})` }} aria-hidden="true" />
        <Decor />
        <Line pos="hero" />
        <div className="wrap ref-head-in">
          <nav className="page-crumb">
            <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} /><b>Reference</b>
          </nav>
          {/* ten istý blok ako hlavička ktorejkoľvek sekcie - len s h1 (titulok stránky) */}
          <SecHead
            level={1}
            title={<>Co říkají <b>klienti</b></>}
            lead="Zkušenosti lidí, kteří s námi řeší pojištění, finance i reality. Bez filtrů a bez vybraných výjimek."
          />
          <div className="ref-score">
            <div className="ref-score-stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <IconStarFilled key={i} size={18} className={i < Math.round(avgNum) ? '' : 'off'} />
              ))}
            </div>
            <p className="ref-score-num">{avg}<span> / 5</span></p>
            <p className="ref-score-cap">průměrné hodnocení z {REFERENCES.length} referencí</p>
            <p className="ref-score-foot"><b>230 000+</b> klientů</p>
          </div>
        </div>
      </section>

      {/* ============ FILTER + VÝPIS ============ */}
      <section className="sec wrap">
        <div className="ref-filter" role="tablist" aria-label="Filtr referencí">
          {tags.map((t) => (
            <button
              key={t} type="button" role="tab" aria-selected={tag === t}
              className={`ref-chip ${tag === t ? 'on' : ''}`} onClick={() => setTag(t)}
            >{t}</button>
          ))}
        </div>

        <div className="refs-grid">
          {shown.map((r) => <ReferenceCard key={r.name} r={r} />)}
        </div>
      </section>

      <ContactBand />
      <SiteFooter />
    </div>
  )
}
