import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './contact.css'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { PageHero, HeroChip } from '../components/PageParts.jsx'
import { BRANCHES } from '../data/branches.js'
import { IconPhone, IconMail, IconSearch, IconMapPin } from '@tabler/icons-react'

// Poradie sekcií podľa reality webu (/contacts): hero → [zoznam pobočiek | sticky mapa]
// → kontaktný banner. Pobočky sú zoskupené (tam podľa miest, u nás podľa regiónov,
// lebo v jednom meste máme spravidla jednu pobočku).
const REGION_ORDER = ['praha', 'cechy', 'morava']

export default function Contact() {
  const [q, setQ] = useState('')
  useHeroHeader()

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return BRANCHES
    return BRANCHES.filter((b) => [b.city, b.cityFull, b.street, b.zip].some((s) => s.toLowerCase().includes(needle)))
  }, [q])

  // Zoznam je jeden súvislý rad kariet – regióny už nie sú medzititulky, len poradie,
  // nech Praha nestojí medzi moravskými mestami.
  const ordered = REGION_ORDER.flatMap((rk) => filtered.filter((b) => b.region === rk))

  return (
    <div className="site">
      <PageHero
        photo="/kontakt/hero.jpg"
        title="Kontakt"
        subtitle="Najdete nás po celé České republice. Vyberte si nejbližší pobočku, prohlédněte si tým – nebo nám rovnou napište."
      >
        <div className="hchips">
          <HeroChip href="tel:+420545110341" icon={<IconPhone size={20} stroke={1.8} />}>+420 545 110 341</HeroChip>
          <HeroChip href="mailto:allrisk@allrisk.cz" icon={<IconMail size={20} stroke={1.8} />}>allrisk@allrisk.cz</HeroChip>
        </div>
      </PageHero>

      {/* ===== POBOČKY + MAPA ===== */}
      <section className="sec wrap">
        <div className="contact-layout">
          <div className="branch-side">
            <div className="branch-search" style={{ marginBottom: 22 }}>
              <IconSearch size={20} stroke={2} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Hledat město, ulici nebo PSČ…" />
            </div>

            {ordered.length ? (
              <div className="branch-list">
                {/* karta ako na reality webe: foto, názov, adresa – nič viac */}
                {ordered.map((b) => (
                  <Link className="branch-row" key={b.slug} to={`/pobocky/${b.slug}`}>
                    <img src={b.img} alt={b.name} loading="lazy" />
                    <span className="tx">
                      <span className="nm">{b.name}{b.hq && <span className="hq">Centrála</span>}</span>
                      <span className="loc"><IconMapPin size={16} stroke={1.8} />{b.street}, {b.zip} {b.cityFull}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="branch-empty">Pro zadané hledání jsme nenašli žádnou pobočku. Zkuste jiný výraz.</div>
            )}
          </div>

          {/* sticky mapa s pinmi */}
          <div className="cmap-wrap">
            <div className="cmap" role="img" aria-label="Mapa poboček Allrisk po ČR">
              {filtered.map((b) => (
                <span className="cmap-pin" key={b.slug} style={{ left: `${b.map[0]}%`, top: `${b.map[1]}%` }} title={b.city}>
                  <IconMapPin size={30} stroke={1.9} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactBand />
      <SiteFooter />
    </div>
  )
}
