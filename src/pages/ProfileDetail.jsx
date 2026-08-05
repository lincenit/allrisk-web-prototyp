import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './wireframe.css'
import './profile.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import TabBar from '../components/TabBar.jsx'
import { DebugPanel, DebugGroup, useDebugOption } from '../components/DebugPanel.jsx'
import { TAB_VARIANTS, TAB_VARIANT_DEFAULT } from '../tabVariants.js'
import {
  SOLVED_VARIANTS, SOLVED_VARIANT_DEFAULT, SOLVED_COLORS, SOLVED_COLOR_DEFAULT,
} from '../solvedVariants.js'
import { PROFILES, profileBySlug, situationCount } from '../data/profiles.js'
import { ProfileIllus, ProfileCards, SituationPanel, SolvedList, iconFor } from '../components/ProfileParts.jsx'
import { SecHead } from '../components/PageParts.jsx'
import {
  IconArrowRight, IconChevronRight, IconLayoutNavbar, IconLayoutColumns, IconPalette,
} from '@tabler/icons-react'

export default function ProfileDetail() {
  const { slug } = useParams()
  const p = profileBySlug(slug)
  useHeroHeader(!!p)
  // V stave je kľúč situácie, nie poradie – „Nejste to úplně vy?" prepne slug na tej istej
  // stránke a index by potom ukazoval na cudziu situáciu. Kľúč, ktorý profil nemá, padne na prvú.
  const [sit, setSit] = useState('')
  // vzhľad radu záložiek – rozpracovaná voľba, drží sa naprieč stránkami (aj na /vozidla)
  const [tabStyle, setTabStyle] = useDebugOption('tabs', TAB_VARIANT_DEFAULT)
  // rozloženie bloku „Co je dobré mít vyřešeno" – tiež rozpracované, drží sa medzi profilmi,
  // lebo varianty sa dajú posúdiť až porovnaním rodiny (5 : 2 : 0) proti ostatným
  const [solvedStyle, setSolvedStyle] = useDebugOption('solved', SOLVED_VARIANT_DEFAULT)
  // farebná škála úrovní je zámerne SAMOSTATNÁ os od rozloženia – inak sa nedá povedať,
  // či za dojmom stojí rozloženie alebo farba (semafor je zatiaľ návrh, viď profile.css)
  const [solvedColors, setSolvedColors] = useDebugOption('solvedColors', SOLVED_COLOR_DEFAULT)

  if (!p) {
    return (
      <div className="site">
        <section className="wrap notfound">
          <h1>Profil nenalezen</h1>
          <p>Takový klientský profil u nás zatím nemáme.</p>
          <Link to="/" className="btn fill">Zpět na úvod <IconArrowRight size={18} stroke={2.2} /></Link>
        </section>
        <SiteFooter />
      </div>
    )
  }

  const active = p.situations.find((s) => s.key === sit) || p.situations[0]
  // ikona je komponent, nie hotový prvok – veľkosť si volí variant záložky
  const tabItems = p.situations.map((s) => ({ key: s.key, label: s.tab, icon: iconFor(s.ic) }))
  const others = PROFILES.filter((x) => x.key !== p.key)

  return (
    <div className="site">
      {/* ============ 1 · HERO ARCHETYPU (rovnaká kostra ako /vozidla) ============ */}
      <section className="hero prof-hero photo-hero">
        {/* foto klienta v modrom duotóne; kým foto chýba, ostane čistý modrý podklad */}
        <div
          className="photo-hero-bg"
          style={{ backgroundImage: `url(${asset(p.photo)}), url(${asset('/kontakt/hero.jpg')})` }}
          aria-hidden="true"
        />
        <div className="wrap hero-in prof-hero-in">
          {/* titulok nesie archetyp aj meno („Podnikatel Martin, 41 let“), popis osoby je rovno pod ním.
              Breadcrumb je súčasťou tohto stĺpca, nie samostatný pás nad ním – inak sa pri
              centrovaní odtrhne a medzera pod ním sa mení s výškou ilustrácie vedľa. */}
          <div className="hero-tx">
            <nav className="prof-crumb">
              <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} />
              <span>Klientské profily</span><IconChevronRight size={14} stroke={2} />
              <b>{p.ey}</b>
            </nav>
            <h1>{p.ey} <b>{p.t}</b></h1>
            <p>{p.intro}</p>
            {/* rovnaká dvojica ako v hero na /vozidla: obe tlačidlá vedú do stránky,
                nie preč z nej. Hlavné na modelové situácie – to je dôvod, prečo si
                človek profil otvoril; kontakt drží spodný pás. */}
            {/* labely sú doslova nadpisy sekcií, na ktoré kotvia – nevymýšľať tu
                druhé znenie, inak človek po kliknutí nevie, či je tam, kam mieril */}
            <div className="hero-cta">
              <a href="#prof-situace" className="btn fill">
                Proč je to dobré mít <IconArrowRight size={18} stroke={2.2} />
              </a>
              <a href="#prof-reseni" className="btn">Co je dobré mít vyřešeno</a>
            </div>
          </div>
          {/* tabler.io ilustrácia profilu – rovnaká, akú nesie dlaždica na landingu */}
          <div className="prof-hero-illus"><ProfileIllus img={p.img} ic={p.ic} /></div>
        </div>
      </section>

      {/* ============ 2 · CO JE DOBRÉ MÍT VYŘEŠENO ============ */}
      {/* nadpis sekcie = label tlačidla v hero, ktoré sem kotví – musia znieť rovnako,
          inak človek po kliknutí nevie, či je tam, kam mieril */}
      <section id="prof-reseni" className="sec wrap">
        {/* zámerne bez skloňovania názvu profilu – „u podnikatel“ česky nedáva zmysel */}
        <SecHead
          title={<>Co je dobré mít <b>vyřešeno</b></>}
          lead="Pro tenhle profil dává smysl tohle – rozdělené podle toho, co by chybělo nejvíc. Nejde o kompletní katalog, jde o to, co v téhle situaci skutečně rozhoduje."
        />
        <SolvedList items={p.solved} variant={solvedStyle} colors={solvedColors} />
      </section>

      {/* ============ 3 · PROČ JE TO DOBRÉ MÍT ============ */}
      <section id="prof-situace" className="sec wrap">
        {/* počet situácií je per profil – rodina ich má víc než ostatní.
            Nadpis = label druhého tlačidla v hero, z rovnakého dôvodu ako pri sekcii vyššie. */}
        <SecHead
          title={<>Proč je to <b>dobré mít</b></>}
          lead={<>Dokud se nic nestane, je to jen položka v rozpočtu. {situationCount(p.situations.length)}, které tenhle profil potkávají nejčastěji – a co v nich pojištění reálně udělalo.</>}
        />

        {/* rovnaký rad záložiek ako produkty na /vozidla – jeden komponent */}
        <TabBar
          items={tabItems} value={active.key} onChange={setSit}
          variant={tabStyle} label="Proč je to dobré mít"
        />

        <div role="tabpanel" className="sit-wrap" key={active.key}>
          <SituationPanel profile={p} situation={active} context="profil" />
        </div>
      </section>

      {/* ============ 4 · OSTATNÉ PROFILY ============ */}
      <section className="sec wrap">
        <SecHead title={<>Nejste to <b>úplně vy?</b></>} lead="Podívejte se na profil, který sedí líp." />
        {/* tie isté dlaždice ako na landingu – jeden komponent, žiadny druhý variant karty */}
        <ProfileCards profiles={others} className="prof-cards-3" />
      </section>

      <ContactBand />
      <SiteFooter />

      {/* ten istý prepínač variantov ako na /vozidla – rad záložiek je tam aj tu ten istý prvok */}
      <DebugPanel>
        <DebugGroup
          icon={IconLayoutNavbar} label="Záložky" value={tabStyle} onChange={setTabStyle} wrap
          options={TAB_VARIANTS}
        />
        <DebugGroup
          icon={IconLayoutColumns} label="Co mít vyřešeno" value={solvedStyle} onChange={setSolvedStyle} wrap
          options={SOLVED_VARIANTS}
        />
        <DebugGroup
          icon={IconPalette} label="Barvy úrovní" value={solvedColors} onChange={setSolvedColors} wrap
          options={SOLVED_COLORS}
        />
      </DebugPanel>
    </div>
  )
}
