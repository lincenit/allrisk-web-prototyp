/* ============================================================
   SiteHeader - JEDEN spoločný header pre celý prototyp.

   Lišta má ŠTYRI verzie (headerVariants.js, prepínač je v ladiacom paneli).
   Všetky odpovedajú na tú istú otázku - patrí publikum (jednotlivci a rodiny /
   podnikatelé / města a obce) do navigácie, a ak áno, čo tomu ustúpi:

   `prepinac` - jedna položka „Produkty", publikum sa vyberá až v paneli.
                Lišta zostáva krátka, publikum je o klik ďalej.
   `pas`      - každé publikum vlastná položka, ale utility (Společnost,
                Kontakt, hľadanie, účet) odchádza do tenkého pásu NAD lištu.
                Hlavná lišta nesie logo, tri publiká plnými názvami
                a „Nahlásit škodu" - vojde sa do bežnej šírky obsahu a nič
                neustupuje. Cena je výška hlavičky.
   `kontext`  - publikum je kontext, nie cieľ: prepínač stojí hneď pri
                „Produkty" a je vidieť aj so zavretým menu. Výber platí pre
                celý web, nie len pre menu (src/segment.js).
   `karty`    - lišta ako `prepinac`, ale panel začína tromi kartami publík
                na plnú šírku namiesto úzkeho bočného stĺpca.

   V každej verzii vedú Podnikatelé rovno na /podnikatele - nikde neotvárajú
   panel. Klient výslovne nechcel podnikateľom tlačiť produkty; ich vstupom je
   systém péče na vlastnej stránke, nie zoznam pojištění.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './SiteHeader.css'
import { asset } from '../asset.js'
import { MENU, CATS, SEGMENTS } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import ProductIcon from './ProductIcon.jsx'
import MegaMenu from './MegaMenu.jsx'
import { useDebugOption } from './DebugPanel.jsx'
import { HDR_DEFAULT, HDR_ONE_ITEM, hdrVariant } from '../headerVariants.js'
import { useSegment, SEG_DEFAULT } from '../segment.js'
import {
  IconAlertTriangle, IconSearch, IconChevronDown, IconUser, IconChevronRight,
  IconArrowUpRight, IconUsers, IconBriefcase, IconBuildingCommunity,
} from '@tabler/icons-react'

// Ikona publika (kľúč drží data/menu.js). Prepínač ňou dáva výber najavo aj
// bez čítania - v lište je to jediný prvok, ktorý sa mení podľa stavu webu.
const SEG_ICONS = { users: IconUsers, briefcase: IconBriefcase, city: IconBuildingCommunity }

// Blog je pod „Společnost" (2026-08-10). Ako samostatná položka lišty bral
// ~79px a to je presne to, čo verzii „polozky" chýbalo, keď publiká idú plnými
// názvami. Ustúpil obsahový vstup, nie navigácia.
// Položky s cestou od lomítka majú v prototype vlastnú stránku a idú routerom;
// zvyšok je zatiaľ mŕtvy odkaz (#) - preto tá dvojica renderov nižšie.
const COMPANY = [['O nás', '#'], ['Kariéra', '#'], ['Blog', '/blog']]
const CompanyLink = ({ label, to, onClick }) => (
  to.startsWith('/')
    ? <Link to={to} onClick={onClick}>{label}</Link>
    : <a href={to} onClick={onClick}>{label}</a>
)
const POPULAR = ['Vozidla', 'Cestovní', 'Nemovitost', 'Investice', 'Život a úraz']

// „Společnost" žije v lište, ale vo verzii `pas` v hornom páse - je to tá istá
// rozbaľovačka na dvoch miestach, takže má vlastný komponent.
function CompanyMenu({ open, onToggle, onNavigate }) {
  return (
    <div className="hdr-dd-wrap">
      <button className={open ? 'on' : ''} aria-expanded={open} onClick={onToggle}>
        Společnost <IconChevronDown size={17} stroke={2.2} />
      </button>
      {open && (
        <div className="hdr-dd">
          {COMPANY.map(([l, to]) => <CompanyLink key={l} label={l} to={to} onClick={onNavigate} />)}
        </div>
      )}
    </div>
  )
}

// Vo verziách s jednou položkou nie je otvorený segment, ale jeden panel -
// `openSeg` preto drží túto značku namiesto kľúča publika. Jeden stav zvládne
// všetky verzie a nemusí sa duplikovať zatváranie, Escape ani klik mimo.
const PRODUKTY = '_produkty'

// Podnikatelé nikde neotvárajú katalóg; majú vlastnú stránku.
const BIZ_KEY = 'podnikatele'
const BIZ = '/podnikatele'

export default function SiteHeader() {
  // Zmazaná verzia môže zostať v localStorage z minulej návštevy - `hdrVariant`
  // ju stiahne späť na predvolenú, nech lišta nikdy nekreslí kostru bez CSS.
  const [hdrRaw] = useDebugOption('header', HDR_DEFAULT)
  const hdrStyle = hdrVariant(hdrRaw)
  // lišta nesie jednu položku „Produkty" a publikum sa vyberá inde
  const oneItem = HDR_ONE_ITEM.includes(hdrStyle)
  const util = hdrStyle === 'pas'      // utility odchádza do pásu nad lištou
  const ctx = hdrStyle === 'kontext'   // publikum je prepínač pri logu
  const cards = hdrStyle === 'karty'   // publiká sú karty hore v paneli

  const [openSeg, setOpenSeg] = useState(null)   // otvorený panel: kľúč publika alebo PRODUKTY
  // DVA výbery publika, zámerne:
  //   siteSeg  - stav celého webu (src/segment.js). Píše ho LEN prepínač vo
  //              verzii „kontext" - tam je publikum nastavenie, po ktorom sa
  //              mení aj úvodná stránka.
  //   panelSeg - výber vnútri menu (bočný stĺpec „prepinac", karty „karty").
  //              Ten landing page prepínať NEMÁ (user, 2026-08-11): otvoriť
  //              menu a prezrieť si inú ponuku nie je to isté ako povedať webu,
  //              kto som. Preto ani nezačína od stavu webu - menu sa otvorí vždy
  //              na Jednotlivcoch a rodinách (user), teda na publiku, ktoré má
  //              najširší katalóg a týka sa najviac ľudí.
  const [siteSeg, setSiteSeg] = useSegment()
  const [panelSeg, setPanelSeg] = useState(SEG_DEFAULT)
  const seg = ctx ? siteSeg : panelSeg
  const setSeg = ctx ? setSiteSeg : setPanelSeg
  const [compOpen, setCompOpen] = useState(false)
  const [ctxOpen, setCtxOpen] = useState(false)  // rozbalený prepínač publika (verzia „kontext")
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  // Otvorené publikum v mobilnom drawri. Na začiatku žiadne: prvá úroveň sú
  // tri publiká a tie majú byť po otvorení menu vidieť všetky tri naraz.
  const [mseg, setMseg] = useState(null)
  // Žiadna kategória nie je otvorená vopred: rozbalené Pojištění zatlačí
  // zvyšné dve publiká hlboko pod okraj obrazovky a drawer sa otvorí tak,
  // že prvá úroveň navigácie nie je vidieť.
  const [acc, setAcc] = useState(null)

  const headerRef = useRef(null)
  const segObj = SEGMENTS.find((s) => s.key === seg) || SEGMENTS[0]
  const SegIcon = SEG_ICONS[segObj.icon] || IconUsers

  const closeAll = () => {
    setOpenSeg(null); setCompOpen(false); setCtxOpen(false); setSearchOpen(false); setDrawer(false)
  }
  const closeDrawer = () => setDrawer(false)
  const anyOpen = openSeg || compOpen || ctxOpen || searchOpen

  // klik mimo headera zavrie otvorené menu (panel / Společnost / publikum / hľadanie)
  useEffect(() => {
    if (!anyOpen) return
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenSeg(null); setCompOpen(false); setCtxOpen(false); setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [anyOpen])

  // Escape zavrie menu a vráti fokus do lišty
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || !anyOpen) return
      setOpenSeg(null); setCompOpen(false); setCtxOpen(false); setSearchOpen(false)
      headerRef.current?.querySelector('.hdr-nav button')?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [anyOpen])

  // Prepnutie verzie lišty musí zavrieť, čo je otvorené: „Produkty" vo verzii
  // s položkami neexistujú a naopak, takže by ostal visieť panel bez tlačidla.
  useEffect(() => { setOpenSeg(null); setCtxOpen(false) }, [hdrStyle])

  // Verzia je aj na <html>, nie len na hlavičke: `pas` je o pás vyššia a výšku
  // hlavičky berú z tokenu --hdr-h aj foto-hero (podliezajú lištu) a kotvy.
  // Bez toho by sa hero rozišlo s hlavičkou práve v tej verzii, ktorá ju mení.
  useEffect(() => {
    document.documentElement.dataset.hdr = hdrStyle
    return () => { delete document.documentElement.dataset.hdr }
  }, [hdrStyle])

  // Hľadanie ide naprieč všetkými segmentmi - používateľ, ktorý píše do lupy,
  // žiadne publikum nezvolil.
  const searchIndex = useMemo(() => {
    const out = []; const seen = new Set()
    for (const s of SEGMENTS) {
      for (const c of CATS) {
        for (const item of (MENU[s.key]?.[c.key] || [])) {
          if (seen.has(item.label)) continue
          seen.add(item.label)
          out.push({ ...item, cat: c.label })
        }
      }
    }
    return out
  }, [])

  const q = query.trim().toLowerCase()
  const results = q ? searchIndex.filter((i) => i.label.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q)) : []

  const openSearch = () => { setSearchOpen((o) => !o); setOpenSeg(null); setCompOpen(false); setCtxOpen(false) }
  const closeSearch = () => { setSearchOpen(false); setQuery('') }
  const togglePanel = (key) => {
    setOpenSeg((cur) => (cur === key ? null : key))
    setCompOpen(false); setCtxOpen(false); setSearchOpen(false)
  }
  const toggleCompany = () => { setCompOpen((p) => !p); setOpenSeg(null); setCtxOpen(false); setSearchOpen(false) }

  // Vstup do katalógu vo verziách s jednou položkou. Keď je zvolené publikum
  // Podnikatelé, žiadny katalóg neexistuje - položka sa mení na odkaz na ich
  // stránku, aby prepínač publika neponúkal panel, ktorý nikdy nemal existovať.
  const produktyItem = ctx && seg === BIZ_KEY ? (
    <NavLink to={BIZ} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>
      Produkty <IconArrowUpRight size={16} stroke={2.2} />
    </NavLink>
  ) : (
    <button className={openSeg === PRODUKTY ? 'on' : ''} aria-expanded={openSeg === PRODUKTY} onClick={() => togglePanel(PRODUKTY)}>
      Produkty <IconChevronDown size={17} stroke={2.2} />
    </button>
  )

  return (
    <>
      {/* verzia lišty je aj na elemente - rozdiel medzi nimi nie je len v tom,
          čo sa vykreslí, ale aj koľko miesta to zaberie (viď SiteHeader.css) */}
      <header className={`hdr hdr--${hdrStyle}${drawer ? ' hdr--solid' : ''}`} ref={headerRef}>
        {/* ---- utility pás (len verzia „pas") ----
            Všetko, čo nevedie do katalógu, ide o riadok vyššie. Hlavnej lište
            tým zostane presne toľko miesta, koľko si tri publiká plnými názvami
            pýtajú, takže sa nemusí rozťahovať ani nič obetovať. */}
        {util && (
          <div className="hdr-util">
            <div className="hdr-util-in">
              <CompanyMenu open={compOpen} onToggle={toggleCompany} onNavigate={closeAll} />
              <NavLink to="/kontakt" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Kontakt</NavLink>
              {/* hľadanie zostáva v spodnej lište ako v ostatných verziách -
                  je to akcia, nie odkaz, a patrí k tlačidlám vpravo dole */}
              <button className="hdr-util-mua"><IconUser size={17} stroke={2} /> Můj Allrisk</button>
            </div>
          </div>
        )}

        <div className="hdr-bar">
          <Link className="hdr-logo" to="/" onClick={closeAll} aria-label="Allrisk - domů">
            <img src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
          </Link>

          <span className="hdr-spacer" />
          <nav className="hdr-nav">
            {/* ---- prepínač publika (len verzia „kontext") ----
                Stojí hneď pri „Produkty" (user, 2026-08-11), lebo mení práve
                to, čo je pod nimi - pri logu vyzeral ako druhá značka. Ide
                pred ne, nie za: najprv pre koho, potom čo.
                Ikona sa mení s výberom, takže je zvolené publikum vidieť aj
                bez čítania. Nadpis „Nabídka" nad názvom zmizol - v jednom
                riadku na 48px si tlačidlo vystačí s ikonou a názvom. */}
            {ctx && (
              <div className="hdr-ctx">
                <button className={ctxOpen ? 'on' : ''} aria-expanded={ctxOpen} onClick={() => { setCtxOpen((p) => !p); setOpenSeg(null); setCompOpen(false); setSearchOpen(false) }}>
                  <SegIcon size={20} stroke={2} />
                  {/* Názov publika, nie „Pro …": predložku povie ikona a rozbaľovačka
                      a v lište stojí 28px, ktoré tam nie sú. Celé „Pro jednotlivce
                      a rodiny" nesie hlavička panelu.
                      Dva zápisy: pod 1100px sa nezmestí ani názov a skratka je
                      jediné miesto, kde sa dá ubrať bez toho, aby zmizol odkaz
                      alebo akcia. */}
                  <b>
                    <span className="hdr-ctx-full">{segObj.label}</span>
                    <span className="hdr-ctx-short">{segObj.short}</span>
                  </b>
                  <IconChevronDown size={17} stroke={2.2} />
                </button>
                {ctxOpen && (
                  <div className="hdr-dd hdr-ctx-dd">
                    {SEGMENTS.map((s) => {
                      const I = SEG_ICONS[s.icon] || IconUsers
                      return (
                        <button
                          key={s.key} className={s.key === seg ? 'on' : ''}
                          onClick={() => { setSeg(s.key); setCtxOpen(false); setOpenSeg(null) }}
                        >
                          <I size={20} stroke={2} />
                          <span>
                            <b>{s.label}</b>
                            <small>{s.desc}</small>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
            {oneItem ? produktyItem : (
              /* Podnikatelé sú odkaz, nie rozbaľovačka - nejde tam o výber
                 produktu, ale o spôsob spolupráce, a ušetrený chevron je
                 presne to miesto, ktoré potrebuje „Jednotlivci a rodiny". */
              SEGMENTS.map((s) => (s.key === BIZ_KEY ? (
                <NavLink key={s.key} to={BIZ} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>
                  {s.label}
                </NavLink>
              ) : (
                <button
                  key={s.key}
                  className={openSeg === s.key ? 'on' : ''}
                  aria-expanded={openSeg === s.key}
                  onClick={() => togglePanel(s.key)}
                >
                  {s.label} <IconChevronDown size={17} stroke={2.2} />
                </button>
              )))
            )}
            {/* vo verzii „pas" je toto oboje o riadok vyššie */}
            {!util && (
              <>
                <CompanyMenu open={compOpen} onToggle={toggleCompany} onNavigate={closeAll} />
                <NavLink to="/kontakt" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Kontakt</NavLink>
              </>
            )}
          </nav>
          <span className="hdr-divider" />
          <div className="hdr-actions">
            <button className={`hdr-iconbtn ${searchOpen ? 'on' : ''}`} aria-label="Hledat" aria-expanded={searchOpen} onClick={openSearch}><IconSearch size={22} stroke={2} /></button>
            <button className="hdr-mua" aria-label="Můj Allrisk"><IconUser size={20} stroke={2} /><span>Můj Allrisk</span></button>
            <Link to="/vozidla" className="hdr-claim" aria-label="Nahlásit škodu" onClick={closeAll}><IconAlertTriangle size={20} stroke={2} /><span>Nahlásit škodu</span></Link>
          </div>
          <button className={`hdr-burger ${drawer ? 'on' : ''}`} onClick={() => setDrawer((d) => !d)} aria-label="Menu" aria-expanded={drawer}><i /><i /><i /></button>
        </div>

        {/* ---- panel ----
            `setSeg` sa posiela len tam, kde si publikum vyberá panel sám:
            `prepinac` má bočný stĺpec, `karty` riadok kariet. Verzia `kontext`
            ho nedostane - publikum už zvolil prepínač pri logu, takže panel
            len pomenuje, čie to je. */}
        {openSeg && (
          <div className="hdr-mega-wrap">
            <MegaMenu
              seg={openSeg === PRODUKTY ? seg : openSeg}
              setSeg={openSeg === PRODUKTY && !ctx ? setSeg : undefined}
              cards={cards}
              onNavigate={closeAll}
            />
          </div>
        )}

        {searchOpen && (
          <div className="hdr-mega-wrap">
            <div className="hdr-mega hdr-search">
              <div className="hdr-search-bar">
                <IconSearch size={20} stroke={2} />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hledat produkt nebo službu…" />
                {query && <button className="hdr-search-clear" onClick={() => setQuery('')} aria-label="Vymazat">✕</button>}
              </div>
              <div className="hdr-search-body">
                {q ? (
                  results.length ? (
                    <>
                      <div className="hdr-search-lbl">Výsledky · {results.length}</div>
                      <div className="hdr-mega-grid">
                        {results.map((item) => (
                          <Link className="hdr-item" key={item.label} to={routeFor(item.label)} onClick={closeSearch}>
                            <ProductIcon name={item.icon} />
                            <span><b>{item.label}</b><small>{item.cat}</small></span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="hdr-search-empty">Pro „{query}“ jsme nic nenašli. Zkuste jiný výraz.</div>
                  )
                ) : (
                  <>
                    <div className="hdr-search-lbl">Oblíbená hledání</div>
                    <div className="hdr-search-chips">
                      {POPULAR.map((p) => <button key={p} onClick={() => setQuery(p)}>{p}</button>)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ---- mobilný drawer ----
          JEDEN pre všetky verzie lišty (user, 2026-08-11): dvojúrovňový akordeón,
          kde prvá úroveň sú publiká - Jednotlivci a rodiny rozbaliť, Podnikatelé
          odkaz na ich stránku, Města a obce rozbaliť. Varianty hlavičky riešia
          šírku desktopovej lišty; na mobile žiadna šírka nie je, takže nemali čo
          porovnávať - len robili z jednej navigácie dve.
          Riadok je celý, preto plné názvy. */}
      <div className={`hdr-drawer ${drawer ? 'open' : ''}`}>
        <div className="hdr-drawer-in">
          <button className="hdr-mfield" onClick={() => { setDrawer(false); setSearchOpen(true) }}><IconSearch size={22} stroke={2} /> Hledat…</button>

          <div className="hdr-acc">
            {SEGMENTS.map((s) => {
              // Podnikatelé nie sú akordeón - vedú na stránku, presne ako
              // v lište a v bočnom paneli na desktope.
              if (s.key === BIZ_KEY) {
                return (
                  <Link key={s.key} className="hdr-acc-row hdr-acc-seg hdr-acc-link" to={BIZ} onClick={closeDrawer}>
                    {s.label}
                    <IconChevronRight className="hdr-acc-ch" size={20} stroke={2} />
                  </Link>
                )
              }
              const open = mseg === s.key
              const body = (
                <div className="hdr-acc-sub2">
                  {CATS.map((c) => (
                    <div key={c.key}>
                      <button
                        className={`hdr-acc-row ${acc === c.key ? 'open' : ''}`}
                        aria-expanded={acc === c.key}
                        onClick={() => setAcc(acc === c.key ? null : c.key)}
                      >
                        {c.label}
                        <IconChevronDown className="hdr-acc-ch" size={20} stroke={2} />
                      </button>
                      {acc === c.key && (
                        <div className="hdr-acc-sub">
                          {/* zoznam, nie mriežka - produkty idú pod sebou na plnú šírku */}
                          {MENU[s.key][c.key].map((item) => (
                            <Link className="hdr-item" key={item.label} to={routeFor(item.label)} onClick={closeDrawer}>
                              <ProductIcon name={item.icon} />
                              <span><b>{item.label}</b></span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )

              return (
                <div key={s.key}>
                  <button
                    className={`hdr-acc-row hdr-acc-seg ${open ? 'open' : ''}`}
                    aria-expanded={open}
                    onClick={() => { setMseg(open ? null : s.key); setAcc(null) }}
                  >
                    {s.label}
                    <IconChevronDown className="hdr-acc-ch" size={20} stroke={2} />
                  </button>
                  {open && body}
                </div>
              )
            })}
          </div>

          <div className="hdr-mlinks">
            {COMPANY.map(([l, to]) => <CompanyLink key={l} label={l} to={to} onClick={closeDrawer} />)}
            <Link to="/kontakt" onClick={closeDrawer}>Kontakt</Link>
          </div>
          <div className="hdr-mfoot">
            <Link to="/vozidla" className="hdr-claim" onClick={closeDrawer}><IconAlertTriangle size={20} stroke={2} /><span>Nahlásit škodu</span></Link>
            <button className="hdr-mua" aria-label="Můj Allrisk"><IconUser size={20} stroke={2} /><span>Můj Allrisk</span></button>
          </div>
        </div>
      </div>
    </>
  )
}
