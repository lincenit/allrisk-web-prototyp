import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { ReferenceCard } from '../components/References.jsx'
import { Decor } from '../components/Decor.jsx'
import { Line } from '../components/Line.jsx'
import { REFERENCES, HERO_PHOTO } from '../data/references.js'
import { useHeroHeader } from '../useHeroHeader.js'
import { IconChevronRight, IconStarFilled, IconUsers } from '@tabler/icons-react'

// Filtre podľa oblasti služby - zoznam sa skladá z dát, nech nezostarne pri pridaní referencie.
const ALL = 'Vše'

export default function References() {
  const [tag, setTag] = useState(ALL)
  // hlavička je nad fotkou, takže header musí byť hore priehľadný (ako na /blog)
  useHeroHeader()

  const tags = [ALL, ...Array.from(new Set(REFERENCES.map((r) => r.tag)))]
  const shown = tag === ALL ? REFERENCES : REFERENCES.filter((r) => r.tag === tag)
  // priemer z dát, nie napísané číslo - pridaná referencia ho posunie sama
  const avg = (REFERENCES.reduce((s, r) => s + r.stars, 0) / REFERENCES.length).toFixed(1).replace('.', ',')

  return (
    <div className="site">
      {/* ============ 1 · HERO STRÁNKY (rovnaká kostra ako /vozidla a /profil) ============ */}
      {/* Foto pod modrým gradientom - spoločný recept .photo-hero (wireframe.css).
          Bez eyebrowu: „Reference" už nesie drobečková navigácia, druhýkrát to isté
          slovo je len šum (rovnako ako na /blog). Titulok, breadcrumb aj rytmika sú
          tie isté triedy ako na ostatných heroch (user, 2026-08-19) - .hero-tx s h1,
          nie .page-head so SecHead. Vpravo dve sklenené karty .hero-points: hodnotenie
          a počet klientov, presne ako body v hero na /vozidla. */}
      <section className="hero ref-hero photo-hero">
        <div className="photo-hero-bg" style={{ backgroundImage: `url(${HERO_PHOTO})` }} aria-hidden="true" />
        <Decor />
        <Line pos="hero" />
        <div className="wrap hero-in ref-hero-in">
          <div className="hero-tx">
            <nav className="page-crumb">
              <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} /><b>Reference</b>
            </nav>
            <h1>Co říkají <b>klienti</b></h1>
            <p>Zkušenosti lidí, kteří s námi řeší pojištění, finance i reality. Bez filtrů a bez vybraných výjimek.</p>
          </div>
          {/* jeden fakt na kartu - hodnotenie sa počíta z dát, nech nezostarne pri
              pridaní referencie; počet klientov je údaj spoločnosti */}
          <ul className="hero-points">
            <li>
              <span className="hp-ic"><IconStarFilled size={24} /></span>
              <span className="hp-tx"><b>Průměrné hodnocení {avg} / 5</b></span>
            </li>
            <li>
              <span className="hp-ic"><IconUsers size={24} stroke={1.7} /></span>
              <span className="hp-tx"><b>230 000+ klientů</b></span>
            </li>
          </ul>
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
