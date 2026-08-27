import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './contact.css'
import { useHeroHeader } from '../useHeroHeader.js'
import TabBar from '../components/TabBar.jsx'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { PageHero, HeroChip, PersonCard } from '../components/PageParts.jsx'
import { BRANCHES, ADVISORS, branchBySlug, initials } from '../data/branches.js'
import BranchMap from '../components/BranchMap.jsx'
import { IconPhone, IconMail, IconSearch, IconMapPin, IconBuilding, IconUsers } from '@tabler/icons-react'

// Poradie sekcií podľa reality webu (/contacts vo vetve realman):
//   hero → mapa cez celú šírku → záložky Pobočky / Poradci → hľadanie → zoznam
// Mapa je nad prepínačom zámerne: je to jeden obraz siete, ktorý platí pre obe
// záložky, len sa v ňom menia piny. Predtým tu bol sticky stĺpec s mapou vpravo,
// ale ten dával mape len 400 px a poradcov nemal kam dať.
const REGION_ORDER = ['praha', 'cechy', 'morava']

const TABS = [
  { key: 'pobocky', label: 'Pobočky', icon: IconBuilding },
  { key: 'poradci', label: 'Poradci', icon: IconUsers },
]

// Hľadá sa bez diakritiky a po slovách - kto píše "brno komarov" nemá dôvod
// trafiť presný zápis adresy.
const key = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const matches = (hay, q) => key(q).split(/\s+/).filter(Boolean).every((n) => hay.includes(n))

export default function Contact() {
  const [tab, setTab] = useState('pobocky')
  const [q, setQ] = useState('')
  useHeroHeader()

  // Zoznam pobočiek je jeden súvislý rad kariet - regióny už nie sú medzititulky,
  // len poradie, nech Praha nestojí medzi moravskými mestami.
  const branches = useMemo(() => {
    const ordered = REGION_ORDER.flatMap((rk) => BRANCHES.filter((b) => b.region === rk))
    if (!q.trim()) return ordered
    return ordered.filter((b) => matches(key([b.name, b.city, b.cityFull, b.street, b.zip].join(' ')), q))
  }, [q])

  const advisors = useMemo(() => {
    const collator = new Intl.Collator('cs')
    const sorted = [...ADVISORS].sort((a, b) => collator.compare(a.name, b.name))
    if (!q.trim()) return sorted
    return sorted.filter((a) => {
      const b = branchBySlug(a.branch)
      return matches(key([a.name, a.role, (a.tags || []).join(' '), b?.name, b?.city].join(' ')), q)
    })
  }, [q])

  // Poradca nemá vlastnú polohu - sedí na pine svojej pobočky. Piny sa preto na
  // záložke Poradci zlučujú a nesú počet, rovnako ako zhluk na reálnej mape.
  const pins = useMemo(() => {
    if (tab === 'pobocky') return branches.map((b) => ({ slug: b.slug, map: b.map, title: b.city }))
    const byBranch = new Map()
    for (const a of advisors) {
      const b = branchBySlug(a.branch)
      if (!b) continue
      byBranch.set(b.slug, { slug: b.slug, map: b.map, title: b.city, count: (byBranch.get(b.slug)?.count || 0) + 1 })
    }
    return [...byBranch.values()]
  }, [tab, branches, advisors])

  const empty = tab === 'pobocky' ? branches.length === 0 : advisors.length === 0

  return (
    <div className="site">
      <PageHero
        crumb="Kontakty"
        photo="/kontakt/hero.jpg"
        title="Kontakty"
        subtitle="Najdete nás po celé České republice. Vyberte si nejbližší pobočku, prohlédněte si tým - nebo nám rovnou napište."
      >
        <div className="hchips">
          <HeroChip href="tel:+420545110341" icon={<IconPhone size={20} stroke={1.8} />}>+420 545 110 341</HeroChip>
          <HeroChip href="mailto:allrisk@allrisk.cz" icon={<IconMail size={20} stroke={1.8} />}>allrisk@allrisk.cz</HeroChip>
        </div>
      </PageHero>

      {/* ===== MAPA + ZÁLOŽKY POBOČKY / PORADCI ===== */}
      <section className="sec wrap">
        {/* štylizovaná mapa ČR cez celú šírku obsahu. Piny si stránka počíta
            sama - filtruje ich hľadanie a na záložke Poradci sa zlučujú. */}
        <BranchMap
          className="band"
          pins={pins}
          label={tab === 'pobocky' ? 'Mapa poboček Allrisk po ČR' : 'Mapa poradců Allrisk po ČR'}
        />

        <TabBar
          items={TABS}
          value={tab}
          onChange={(k) => { setTab(k); setQ('') }}
          label="Pobočky nebo poradci"
        />

        <div className="branch-search">
          <IconSearch size={20} stroke={2} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tab === 'pobocky' ? 'Hledat město, ulici nebo PSČ…' : 'Hledat jméno, specializaci nebo pobočku…'}
            aria-label={tab === 'pobocky' ? 'Hledat pobočku' : 'Hledat poradce'}
          />
        </div>

        {empty ? (
          <div className="branch-empty">
            {tab === 'pobocky'
              ? 'Pro zadané hledání jsme nenašli žádnou pobočku. Zkuste jiný výraz.'
              : 'Pro zadané hledání jsme nenašli žádného poradce. Zkuste jiný výraz.'}
          </div>
        ) : tab === 'pobocky' ? (
          <div className="branch-list">
            {/* karta ako na reality webe: foto, názov, adresa - nič viac */}
            {branches.map((b) => (
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
          <div className="adv-list">
            {advisors.map((a) => (
              <PersonCard
                key={a.slug}
                a={a}
                initials={initials}
                to={`/poradce/${a.slug}`}
                sub={`${a.role} · ${branchBySlug(a.branch)?.city || ''}`}
              />
            ))}
          </div>
        )}
      </section>

      <ContactBand />
      <SiteFooter />
    </div>
  )
}
