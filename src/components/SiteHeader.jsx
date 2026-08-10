/* ============================================================
   SiteHeader - JEDEN spoločný header pre celý prototyp.

   Lišta má DVE verzie (headerVariants.js, prepínač je v ladiacom paneli):

   `prepinac` - jedna položka „Produkty", publikum sa vyberá až v paneli.
                Lišta zostáva krátka, publikum je o klik ďalej.
   `polozky`  - každé publikum vlastná položka. „Jednotlivci a rodiny" ide
                celým názvom, takže je to najdlhší riadok, aký sa do lišty
                zmestí; Podnikatelé preto nie sú rozbaľovacie, ale rovno
                preklik na /podnikatele.

   V oboch verziách vedú Podnikatelé rovno na /podnikatele - ani v jednej
   neotvárajú panel. Klient výslovne nechcel podnikateľom tlačiť produkty;
   ich vstupom je systém péče na vlastnej stránke, nie zoznam pojištění.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './SiteHeader.css'
import { asset } from '../asset.js'
import { MENU, CATS, SEGMENTS } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import ProductIcon from './ProductIcon.jsx'
import MegaMenu, { SIDE_TITLE, SIDE_TEXT } from './MegaMenu.jsx'
import { useDebugOption } from './DebugPanel.jsx'
import { HDR_DEFAULT } from '../headerVariants.js'
import {
  IconAlertTriangle, IconSearch, IconChevronDown, IconUser, IconChevronRight, IconArrowUpRight,
} from '@tabler/icons-react'

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

// Vo verzii „prepinac" nie je otvorený segment, ale jeden panel - `openSeg`
// preto drží túto značku namiesto kľúča publika. Jeden stav zvládne obe
// verzie a nemusí sa duplikovať zatváranie, Escape ani klik mimo.
const PRODUKTY = '_produkty'

// Podnikatelé nikde neotvárajú katalóg; vo verzii „polozky" nemajú ani panel.
const BIZ = '/podnikatele'

export default function SiteHeader() {
  const [hdrStyle] = useDebugOption('header', HDR_DEFAULT)
  const rail = hdrStyle === 'prepinac'

  const [openSeg, setOpenSeg] = useState(null)   // otvorený panel: kľúč publika alebo PRODUKTY
  const [seg, setSeg] = useState('rodiny')       // výber vnútri panelu (len verzia „prepinac")
  const [compOpen, setCompOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [mseg, setMseg] = useState('rodiny')     // otvorené publikum v mobilnom drawri
  // Žiadna kategória nie je otvorená vopred: rozbalené Pojištění zatlačí
  // zvyšné dve publiká hlboko pod okraj obrazovky a drawer sa otvorí tak,
  // že prvá úroveň navigácie nie je vidieť.
  const [acc, setAcc] = useState(null)

  const headerRef = useRef(null)

  const closeAll = () => {
    setOpenSeg(null); setCompOpen(false); setSearchOpen(false); setDrawer(false)
  }
  const closeDrawer = () => setDrawer(false)

  // klik mimo headera zavrie otvorené menu (panel / Společnost / hľadanie)
  useEffect(() => {
    if (!openSeg && !compOpen && !searchOpen) return
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenSeg(null); setCompOpen(false); setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [openSeg, compOpen, searchOpen])

  // Escape zavrie menu a vráti fokus do lišty
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (!openSeg && !compOpen && !searchOpen) return
      setOpenSeg(null); setCompOpen(false); setSearchOpen(false)
      headerRef.current?.querySelector('.hdr-nav button')?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openSeg, compOpen, searchOpen])

  // Prepnutie verzie lišty musí zavrieť, čo je otvorené: „Produkty" vo verzii
  // s položkami neexistujú a naopak, takže by ostal visieť panel bez tlačidla.
  useEffect(() => { setOpenSeg(null) }, [hdrStyle])

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

  const openSearch = () => { setSearchOpen((o) => !o); setOpenSeg(null); setCompOpen(false) }
  const closeSearch = () => { setSearchOpen(false); setQuery('') }
  const togglePanel = (key) => {
    setOpenSeg((cur) => (cur === key ? null : key))
    setCompOpen(false); setSearchOpen(false)
  }

  return (
    <>
      {/* verzia lišty je aj na elemente - rozdiel medzi ňou nie je len v tom,
          čo sa vykreslí, ale aj koľko miesta to zaberie (viď SiteHeader.css) */}
      <header className={`hdr hdr--${hdrStyle}${drawer ? ' hdr--solid' : ''}`} ref={headerRef}>
        <div className="hdr-bar">
          <Link className="hdr-logo" to="/" onClick={closeAll} aria-label="Allrisk - domů">
            <img src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
          </Link>
          <span className="hdr-spacer" />
          <nav className="hdr-nav">
            {rail ? (
              <button className={openSeg === PRODUKTY ? 'on' : ''} aria-expanded={openSeg === PRODUKTY} onClick={() => togglePanel(PRODUKTY)}>
                Produkty <IconChevronDown size={17} stroke={2.2} />
              </button>
            ) : (
              /* Podnikatelé sú odkaz, nie rozbaľovačka - nejde tam o výber
                 produktu, ale o spôsob spolupráce, a ušetrený chevron je
                 presne to miesto, ktoré potrebuje „Jednotlivci a rodiny". */
              SEGMENTS.map((s) => (s.key === 'podnikatele' ? (
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
            <div className="hdr-dd-wrap">
              <button
                className={compOpen ? 'on' : ''}
                aria-expanded={compOpen}
                onClick={() => { setCompOpen((p) => !p); setOpenSeg(null); setSearchOpen(false) }}
              >
                Společnost <IconChevronDown size={17} stroke={2.2} />
              </button>
              {compOpen && (
                <div className="hdr-dd">
                  {COMPANY.map(([l, to]) => <CompanyLink key={l} label={l} to={to} onClick={closeAll} />)}
                </div>
              )}
            </div>
            <NavLink to="/kontakt" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Kontakt</NavLink>
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
            `setSeg` sa posiela len vo verzii s prepínačom; podľa toho MegaMenu
            nakreslí buď bočný výber publika, alebo hlavičku s jeho názvom. */}
        {openSeg && (
          <div className="hdr-mega-wrap">
            <MegaMenu
              seg={openSeg === PRODUKTY ? seg : openSeg}
              setSeg={openSeg === PRODUKTY ? setSeg : undefined}
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
          Kopíruje verziu lišty, aby sa varianty dali porovnať aj na mobile:
          `prepinac` = prepínač publika nad jedným zoznamom kategórií,
          `polozky`  = dvojúrovňový akordeón, Podnikatelé rovno odkaz.
          Šírku tu nikto nerieši, riadok je celý - preto plné názvy. */}
      <div className={`hdr-drawer ${drawer ? 'open' : ''}`}>
        <div className="hdr-drawer-in">
          <button className="hdr-mfield" onClick={() => { setDrawer(false); setSearchOpen(true) }}><IconSearch size={22} stroke={2} /> Hledat…</button>

          {rail && (
            <div className="hdr-mseg">
              {/* Titulok aj text sú tie isté reťazce ako v modrom paneli
                  desktopového menu - na mobile totiž nie je čo kliknúť
                  „Produkty", takže by prepínač stál bez toho, čoho sa týka. */}
              <h2 className="hdr-mseg-h">{SIDE_TITLE}</h2>
              <p className="hdr-mseg-tx">{SIDE_TEXT}</p>
              {/* Všetky tri publiká v jednom rade, ako predtým. Podnikatelé
                  sú ale odkaz so šípkou, nie záložka: nevyberajú obsah pod
                  prepínačom, vedú na vlastnú stránku - rovnako ako v bočnom
                  paneli na desktope. */}
              {/* Plné názvy, teda jeden pod druhým: „Jednotlivci a rodiny"
                  sa do polovice 390px displeja nevojde bez lámania.
                  Záložky najprv, odkaz na Podnikatele za nimi. */}
              <div className="hdr-segtabs" role="tablist" aria-label="Pro koho">
                {SEGMENTS.filter((x) => x.key !== 'podnikatele').map((s) => (
                  <button
                    key={s.key} type="button" role="tab" aria-selected={s.key === mseg}
                    className={s.key === mseg ? 'on' : ''}
                    onClick={() => { setMseg(s.key); setAcc(null) }}
                  >
                    {s.label}
                  </button>
                ))}
                <Link className="hdr-seg-link" to={BIZ} onClick={closeDrawer}>
                  Podnikatelé <IconArrowUpRight size={16} stroke={2.2} />
                </Link>
              </div>
            </div>
          )}

          <div className="hdr-acc">
            {SEGMENTS.map((s) => {
              // Podnikatelé nie sú akordeón ani v jednej verzii - vedú na
              // stránku, presne ako v lište a v bočnom paneli na desktope.
              // vo verzii „prepinac" sú Podnikatelé už v prepínači vyššie
              if (s.key === 'podnikatele') {
                if (rail) return null
                return (
                  <Link key={s.key} className="hdr-acc-row hdr-acc-seg hdr-acc-link" to={BIZ} onClick={closeDrawer}>
                    {s.label}
                    <IconChevronRight className="hdr-acc-ch" size={20} stroke={2} />
                  </Link>
                )
              }
              // vo verzii s prepínačom kreslíme len zvolené publikum a bez
              // vlastného riadku - ten je hore v prepínači
              if (rail && s.key !== mseg) return null
              const open = mseg === s.key
              const body = (
                <div className={rail ? '' : 'hdr-acc-sub2'}>
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

              if (rail) return <div key={s.key}>{body}</div>
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
