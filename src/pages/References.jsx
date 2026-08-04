import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { ReferenceCard } from '../components/References.jsx'
import { SecHead } from '../components/PageParts.jsx'
import { REFERENCES } from '../data/references.js'
import { IconChevronRight, IconStarFilled } from '@tabler/icons-react'

// Filtre podľa oblasti služby – zoznam sa skladá z dát, nech nezostarne pri pridaní referencie.
const ALL = 'Vše'

export default function References() {
  const [tag, setTag] = useState(ALL)
  const tags = [ALL, ...Array.from(new Set(REFERENCES.map((r) => r.tag)))]
  const shown = tag === ALL ? REFERENCES : REFERENCES.filter((r) => r.tag === tag)
  const avg = (REFERENCES.reduce((s, r) => s + r.stars, 0) / REFERENCES.length).toFixed(1)

  return (
    <div className="site">
      {/* ============ HLAVIČKA STRÁNKY ============ */}
      <section className="page-head">
        <div className="wrap">
          <nav className="page-crumb">
            <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} /><b>Reference</b>
          </nav>
          {/* ten istý blok ako hlavička ktorejkoľvek sekcie – len s h1 (titulok stránky) */}
          <SecHead
            level={1}
            ey="Reference"
            title={<>Co říkají <b>klienti</b></>}
            lead="Zkušenosti lidí, kteří s námi řeší pojištění, finance i reality. Bez filtrů a bez vybraných výjimek."
          >
            <div className="page-head-nums">
              <span><IconStarFilled size={16} /> <b>{avg}</b> průměrné hodnocení</span>
              <span><b>{REFERENCES.length}</b> referencí</span>
              <span><b>230 000+</b> klientů</span>
            </div>
          </SecHead>
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
