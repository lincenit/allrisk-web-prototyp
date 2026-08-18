/* ============================================================
   SiteHeader - JEDEN header pre celý prototyp, BEZ variantov.

   Podoba je z Figmy (súbor `Consolidation`, node 1937:3688): dva pásy na jednej
   plnej modrej ploche, bez gradientu, bez deliacej linky, hranaté.
     hore  značka vľavo; vpravo prepínač publika, Společnost (a pod ňou O nás,
           Kariéra, Blog, Reference), Kontakt, hľadanie, Můj Allrisk a
           „Nahlásit škodu" (→ kontakt s témou). 68px, sadzba 16px.
     dole  päť obchodných línií zarovnaných DOPRAVA, každá s vlastným panelom.
           54px, sadzba 14px.

   Do 2026-08-12 tu žili TRI verzie hlavičky (`jeden`, `dva`, `figma`) a ŠTYRI
   varianty lepivosti, oboje prepínateľné v ladiacom paneli. User vybral verziu
   podľa Figmy a lepivosť „skryť pri scrolle" a ostatné dal zmazať, takže obe osi
   aj s prepínačmi (headerVariants.js, stickyVariants.js, HeaderDebug.jsx)
   sú preč. Kto ich bude hľadať, nájde ich v gite.

   LEPIVOSŤ: hlavička je `position:sticky` a pri scrolle DOLE sa spodný pás
   zasunie pod horný; scroll HORE ho vráti. Hore tak pri čítaní zostane horný
   rad so značkou a akciou, katalóg sa vráti presne vtedy, keď ho niekto hľadá -
   pohyb hore je v prehliadaní signál „chcem naspäť", nie náhoda.

   Prepínač publika je tlačidlo v štýle „Můj Allrisk" (user, 2026-08-11)
   s ikonou publika a chevronom; po otvorení sa preklopí do plochy panelu pod
   sebou. Publikum je nastavenie, ktoré mení celý web (src/segment.js), nie
   odkaz v rade.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './SiteHeader.css'
import { asset } from '../asset.js'
import { MENU, CATS, SEGMENTS, itemsFor, segmentBy } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import ProductIcon from './ProductIcon.jsx'
import MegaMenu from './MegaMenu.jsx'
import { useSegment } from '../segment.js'
import {
  IconAlertTriangle, IconSearch, IconChevronDown, IconUser, IconCheck,
  IconUsers, IconBriefcase, IconBuildingCommunity,
} from '@tabler/icons-react'

// Ikona publika (kľúč drží data/menu.js). Nesie ju prepínač aj každý riadok
// jeho rozbaľovačky - výber tak ide prečítať aj bez čítania textu.
const SEG_ICONS = { users: IconUsers, briefcase: IconBriefcase, city: IconBuildingCommunity }

// Blog je od 2026-08-12 zase POD „Společnost" (user). Medzi 2026-08-11 a týmto
// dátumom mal vlastnú položku v lište; horný rad medzitým prevzal aj prepínač
// publika a „Kontakt", takže sa Blog vracia tam, kde tematicky patrí - je to
// obsah o firme, nie samostatná obchodná línia.
// Položky s cestou od lomítka majú v prototype vlastnú stránku a idú routerom;
// zvyšok je zatiaľ mŕtvy odkaz (#) - preto tá dvojica renderov nižšie.
// Poradie je dané (user, 2026-08-16): O nás → Kariéra → Blog → Reference.
const COMPANY = [['O nás', '/o-nas'], ['Kariéra', '#'], ['Blog', '/blog'], ['Reference', '/reference']]
const CompanyLink = ({ label, to, onClick }) => (
  to.startsWith('/')
    ? <Link to={to} onClick={onClick}>{label}</Link>
    : <a href={to} onClick={onClick}>{label}</a>
)
const POPULAR = ['Vozidla', 'Cestovní', 'Nemovitost', 'Investice', 'Život a úraz']

// „Nahlásit škodu" ide od 2026-08-12 na KONTAKT (user), nie na /vozidla - škoda
// nie je produkt a nahlásenie sa nedeje na katalógovej stránke.
// Téma v query je tá istá, akú nesie pásik škody v rozcestníku
// (data/needfinder.js → NEED_CLAIM.to). Kontakt ju prečíta a zobrazí nad
// formulárom, takže pristátie nadväzuje na klik a nie je slepé.
// Jedna konštanta preto, že tlačidlo je v hlavičke dvakrát - v lište aj v drawri.
const CLAIM_TO = '/kontakt?tema=Nahlásit škodu'

// Rozbaľovačka publika. Rovnaký tvar riadku v lište aj v mobilnom drawri - je to
// tá istá voľba, takže nemá dôvod vyzerať dvakrát inak.
function SegmentList({ seg, onPick }) {
  return SEGMENTS.map((s) => {
    const I = SEG_ICONS[s.icon] || IconUsers
    const on = s.key === seg
    return (
      <button
        key={s.key} type="button" role="menuitemradio" aria-checked={on}
        className={`hdr-segrow${on ? ' on' : ''}`}
        onClick={() => onPick(s.key)}
      >
        <span className="hdr-segrow-ic"><I size={22} stroke={1.7} /></span>
        <span className="hdr-segrow-tx">
          <b>{s.label}</b>
          <small>{s.desc}</small>
        </span>
        {/* Odfajknutie, nie len farba: zvolená položka sa nesmie dať prečítať
            iba podľa pozadia (DESIGN.md - každý farebný stav má aj znak). */}
        {on && <IconCheck className="hdr-segrow-ck" size={18} stroke={2.6} />}
      </button>
    )
  })
}

export default function SiteHeader() {
  // Publikum je stav webu, nie hlavičky - hlavička ho len prepína a číta.
  const [seg, setSeg] = useSegment()
  const segObj = segmentBy(seg)
  const SegIcon = SEG_ICONS[segObj.icon] || IconUsers

  const [openCat, setOpenCat] = useState(null)   // otvorený panel: kľúč obchodnej línie
  const [segOpen, setSegOpen] = useState(false)  // rozbalený prepínač publika
  const [compOpen, setCompOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  // Otvorená kategória v mobilnom drawri. Na začiatku žiadna: prvá úroveň je
  // päť línií a tie majú byť po otvorení menu vidieť všetky naraz.
  const [acc, setAcc] = useState(null)

  const headerRef = useRef(null)
  // Drawer je SÚRODENEC hlavičky (fixed panel pod ňou), nie jej potomok - do
  // „kliku mimo" preto musí ísť zvlášť. Bez neho platil prepínač publika v drawri
  // za klik mimo: `mousedown` zhodil rozbaľovačku ešte pred `click`, riadok sa
  // odmontoval a výber publika sa na telefóne nedal potvrdiť vôbec.
  const drawerRef = useRef(null)

  const closeAll = () => {
    setOpenCat(null); setSegOpen(false); setCompOpen(false); setSearchOpen(false); setDrawer(false)
  }
  const closeDrawer = () => setDrawer(false)
  const anyOpen = openCat || segOpen || compOpen || searchOpen
  // Čokoľvek rozbalené, vrátane mobilného drawra - to je stav, v ktorom sa
  // hlavička nesmie zasunúť pri scrolle.
  const menuOpen = anyOpen || drawer

  // klik mimo headera (a mimo drawra) zavrie, čo je otvorené
  useEffect(() => {
    if (!anyOpen) return undefined
    const onDown = (e) => {
      const inside = headerRef.current?.contains(e.target) || drawerRef.current?.contains(e.target)
      if (!inside) {
        setOpenCat(null); setSegOpen(false); setCompOpen(false); setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [anyOpen])

  // Otvorený drawer zamkne scroll stránky. Drawer je fixed a scrolluje si sám,
  // takže bez zámku sa pod ním hýbe obsah - a na telefóne to vyzerá, akoby menu
  // odchádzalo preč.
  useEffect(() => {
    if (!drawer) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [drawer])

  // Escape zavrie menu a vráti fokus do lišty
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || !anyOpen) return
      setOpenCat(null); setSegOpen(false); setCompOpen(false); setSearchOpen(false)
      headerRef.current?.querySelector('.hdr-seg-btn')?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [anyOpen])

  // Stav scrollu. `data-hdrhide` na <html> = scrolluje sa dole a spodný pás sa má
  // zasunúť. Značka na dokumente, nie stav v komponente: schovanie mení `--hdr-stick`,
  // teda výšku, ktorá pri scrolle naozaj zostane na obrazovke, a tú si berú sticky
  // prvky a kotvy na stránkach - tie o hlavičke nevedia, ale o <html> áno.
  // Otvorená ponuka sa neskrýva: panel visí z hlavičky a odišiel by aj s ňou.
  // Na telefóne to platí dvojnásobne - drawer je zavesený pod hlavičkou a odišiel
  // by s ňou aj burger, teda jediné, čím sa dá menu zavrieť.
  useEffect(() => {
    const el = document.documentElement
    if (menuOpen) { delete el.dataset.hdrhide; return undefined }
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const topH = headerRef.current?.querySelector('.hdr-top')?.offsetHeight || 64
      // Skrýva sa až pod dvojnásobkom výšky horného pásu: tesne pod vrchom stránky
      // by zmizla skôr, než by ju stihol niekto minúť, a pôsobilo by to ako chyba.
      if (y > last && y > topH * 2) el.dataset.hdrhide = '1'
      else if (y < last || y <= 8) delete el.dataset.hdrhide
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      delete el.dataset.hdrhide
    }
  }, [menuOpen])

  // Hľadanie ide naprieč všetkými publikami - kto píše do lupy, žiadne publikum
  // nevyberal a nemá dôvod prísť o výsledok len preto, že stojí na inom.
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

  const openSearch = () => { setSearchOpen((o) => !o); setOpenCat(null); setSegOpen(false); setCompOpen(false) }
  const closeSearch = () => { setSearchOpen(false); setQuery('') }
  const togglePanel = (key) => {
    setOpenCat((cur) => (cur === key ? null : key))
    setSegOpen(false); setCompOpen(false); setSearchOpen(false)
  }
  const toggleCompany = () => { setCompOpen((p) => !p); setOpenCat(null); setSegOpen(false); setSearchOpen(false) }
  const toggleSeg = () => { setSegOpen((p) => !p); setOpenCat(null); setCompOpen(false); setSearchOpen(false) }

  // Prepnutie publika musí zavrieť panel aj zbaliť akordeón: pod novým publikom
  // je v tej istej línii iný zoznam a otvorený panel by sa prekreslil pod rukou.
  // Od 2026-08-16 zatvára aj drawer: prepínač stojí v lište NAD ním, takže by
  // pod otvoreným menu ticho prepísal celý jeho katalóg.
  const pickSeg = (key) => {
    setSeg(key)
    setOpenCat(null); setSegOpen(false); setCompOpen(false); setSearchOpen(false); setAcc(null)
    setDrawer(false)
  }

  /* ---------- kusy hlavičky ---------- */

  const logo = (
    <Link className="hdr-logo" to="/" onClick={closeAll} aria-label="Allrisk - domů">
      <img src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
    </Link>
  )

  // Prepínač publika. Tvar tlačidla „Můj Allrisk" (user): ohraničené, nie
  // vyplnené - je to voľba, nie akcia. Otvorené sa preklopí do plochy panelu.
  const segSwitch = (
    <div className="hdr-seg">
      {/* aria-label aj pri viditeľnom popisku: na telefóne je z tlačidla len ikona
          a šípka (CSS skrýva `span`) a bez neho by tam ostalo tlačidlo bez mena.
          Meno obsahuje viditeľný text, takže hlasové ovládanie funguje ďalej. */}
      <button
        className={`hdr-seg-btn${segOpen ? ' on' : ''}`}
        aria-expanded={segOpen} aria-haspopup="true"
        aria-label={`Pro koho: ${segObj.label}`}
        onClick={toggleSeg}
      >
        <SegIcon size={20} stroke={1.8} />
        {/* VŽDY plný názov („Jednotlivci a rodiny"). Do 2026-08-12 sa pod 1180px
            prepínal na skratku („Rodiny") kvôli šírke - user to zrušil ako
            nezmysel a má pravdu: publikum je nastavenie celého webu a nesmie sa
            volať v každej šírke okna inak. Miesto na to je odvtedy, čo horný rad
            pustil Blog pod „Společnost". */}
        <span>{segObj.label}</span>
        <IconChevronDown className="hdr-seg-cv" size={17} stroke={2.4} />
      </button>
      {segOpen && (
        <div className="hdr-segdd hdr-dd--anim" role="menu" aria-label="Pro koho">
          <SegmentList seg={seg} onPick={pickSeg} />
        </div>
      )}
    </div>
  )

  const companyMenu = (
    <div className="hdr-dd-wrap">
      <button className={compOpen ? 'on' : ''} aria-expanded={compOpen} onClick={toggleCompany}>
        Společnost <IconChevronDown size={16} stroke={2.2} />
      </button>
      {compOpen && (
        <div className="hdr-dd hdr-dd--anim">
          {COMPANY.map(([l, to]) => <CompanyLink key={l} label={l} to={to} onClick={closeAll} />)}
        </div>
      )}
    </div>
  )

  const contactLink = <NavLink to="/kontakt" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Kontakt</NavLink>
  const searchBtn = (
    <button className={`hdr-searchbtn ${searchOpen ? 'on' : ''}`} aria-label="Hledat" aria-expanded={searchOpen} onClick={openSearch}>
      <IconSearch size={19} stroke={2} /> <span>Hledat</span>
    </button>
  )
  // aria-label aj pri viditeľnom popisku: v lište je z tlačidla len ikona
  // (CSS skryje `span`) a bez neho by tam ostalo tlačidlo bez mena. Ten istý
  // markup nesie aj mobilný drawer, kde popisok vidno.
  const accountBtn = <button className="hdr-mua" aria-label="Můj Allrisk"><IconUser size={19} stroke={2} /><span>Můj Allrisk</span></button>
  const claimBtn = (
    <Link to={CLAIM_TO} className="hdr-claim" aria-label="Nahlásit škodu" onClick={closeAll}>
      <IconAlertTriangle size={20} stroke={2} /><span>Nahlásit škodu</span>
    </Link>
  )
  const burger = (
    // otvorenie menu zhasne rozbaľovačku publika vedľa neho - inak by visela nad drawerom
    <button
      className={`hdr-burger ${drawer ? 'on' : ''}`}
      onClick={() => { setDrawer((d) => !d); setSegOpen(false); setSearchOpen(false) }}
      aria-label="Menu" aria-expanded={drawer}
    ><i /><i /><i /></button>
  )
  const mobileSearch = (
    <button className={`hdr-iconbtn ${searchOpen ? 'on' : ''}`} aria-label="Hledat" aria-expanded={searchOpen} onClick={openSearch}><IconSearch size={22} stroke={2} /></button>
  )

  // Päť obchodných línií, každá s vlastným panelom - obsah spodného pásu.
  const catNav = (
    <nav className="hdr-nav hdr-nav--cats">
      {CATS.map((c) => (
        <div className="hdr-navitem" key={c.key}>
          <button
            className={openCat === c.key ? 'on' : ''}
            aria-expanded={openCat === c.key}
            onClick={() => togglePanel(c.key)}
          >
            {c.label} <IconChevronDown size={16} stroke={2.2} />
          </button>
          {openCat === c.key && <MegaMenu seg={seg} cat={c.key} onNavigate={closeAll} />}
        </div>
      ))}
    </nav>
  )

  return (
    <>
      <header className={`hdr${drawer ? ' hdr--solid' : ''}`} ref={headerRef}>
        {/* ---- horný pás ----
            Značka a všetko, čo nevedie do katalógu: prepínač publika, odkazy,
            hľadanie, účet a akcia. Katalóg je o riadok nižšie. */}
        <div className="hdr-top">
          <div className="hdr-top-in">
            {logo}
            <span className="hdr-spacer" />
            {/* Prepínač publika stojí hneď PRED „Společnost" (user, 2026-08-12).
                V návrhu bol dole vľavo; hore je preto, aby spodný pás zostal
                čistý katalóg piatich obchodných línií. */}
            {segSwitch}
            {companyMenu}
            {contactLink}
            {searchBtn}
            {accountBtn}
            {claimBtn}
            {mobileSearch}
            {burger}
          </div>
        </div>

        {/* ---- spodný pás ----
            Päť obchodných línií zarovnaných doprava (user, 2026-08-12), rovnako
            ako v návrhu. Panel línie sedí flush pod pásom, takže vyzerá ako
            vysunutý z hlavičky, nie ako druhá vrstva nad ňou - to drží obidva
            pásy pohromade ako jeden objekt. */}
        <div className="hdr-bar">
          <div className="hdr-bar-in">
            <span className="hdr-spacer" />
            {catNav}
          </div>
        </div>

        {searchOpen && (
          <div className="hdr-searchwrap">
            <div className="hdr-search hdr-dd--anim">
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
                      <div className="hdr-search-grid">
                        {results.map((item) => (
                          <Link className="hdr-item" key={item.label} to={routeFor(item.label)} onClick={closeSearch}>
                            <ProductIcon name={item.icon} size={22} />
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
          Najprv pre koho, potom čo - rovnaké poradie ako na desktope. */}
      <div className={`hdr-drawer ${drawer ? 'open' : ''}`} ref={drawerRef}>
        <div className="hdr-drawer-in">
          {/* Prepínač publika tu UŽ NIE JE (user, 2026-08-16): stojí natrvalo
              v hornom páse, aj na telefóne. Publikum mení celý web, takže sa
              človek nemá dozvedieť až po otvorení menu, v akej verzii je -
              a dva ovládače na tú istú vec by zdieľali jeden stav. */}
          <button className="hdr-mfield" onClick={() => { setDrawer(false); setSearchOpen(true) }}><IconSearch size={22} stroke={2} /> Hledat…</button>

          <div className="hdr-acc">
            {CATS.map((c) => {
              const items = itemsFor(seg, c.key)
              if (!items.length) return null
              const open = acc === c.key
              return (
                <div key={c.key}>
                  <button
                    className={`hdr-acc-row hdr-acc-seg ${open ? 'open' : ''}`}
                    aria-expanded={open}
                    onClick={() => setAcc(open ? null : c.key)}
                  >
                    {c.label}
                    <IconChevronDown className="hdr-acc-ch" size={20} stroke={2} />
                  </button>
                  {open && (
                    <div className="hdr-acc-sub">
                      {/* zoznam, nie mriežka - produkty idú pod sebou na plnú šírku */}
                      {items.map((item) => (
                        <Link className="hdr-item" key={item.label} to={routeFor(item.label)} onClick={closeDrawer}>
                          <ProductIcon name={item.icon} size={22} />
                          <span><b>{item.label}</b></span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="hdr-mlinks">
            {COMPANY.map(([l, to]) => <CompanyLink key={l} label={l} to={to} onClick={closeDrawer} />)}
            <Link to="/kontakt" onClick={closeDrawer}>Kontakt</Link>
          </div>
          <div className="hdr-mfoot">
            <Link to={CLAIM_TO} className="hdr-claim" onClick={closeDrawer}><IconAlertTriangle size={20} stroke={2} /><span>Nahlásit škodu</span></Link>
            <button className="hdr-mua"><IconUser size={20} stroke={2} /><span>Můj Allrisk</span></button>
          </div>
        </div>
      </div>
    </>
  )
}
