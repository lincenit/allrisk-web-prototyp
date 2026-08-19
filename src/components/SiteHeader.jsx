/* ============================================================
   SiteHeader - JEDEN header pre celý prototyp, JEDEN rozvrh.

   Podoba je z Figmy (súbor `Consolidation`, node 1966:473): úzky BIELY pás publík
   nad modrou lištou.
     hore  tri záložky publika, zarovnané k logu. Zvolená je plocha lišty, čiže
           splýva s pásom pod sebou.
     dole  značka vľavo; vpravo Produkty (panel so VŠETKÝMI obchodnými líniami),
           Společnost (O nás, Kariéra, Blog, Reference), Kontakt, hľadanie,
           Můj Allrisk a „Nahlásit škodu" (→ kontakt s témou).

   Do 2026-08-12 tu žili TRI verzie hlavičky (`jeden`, `dva`, `figma`) a ŠTYRI
   varianty lepivosti, do 2026-08-19 tri rozvrhy záložiek (`bila`, `modra`,
   `pruh`). User vždy vybral jednu podobu a zvyšok dal zmazať - naposledy
   2026-08-19 („čo sa týka hlavičky sprav len Bílá"). Všetko je v gite.

   LEPIVOSŤ: hlavička je `position:sticky` a pri scrolle DOLE sa pás publík
   zasunie za horný okraj okna; scroll HORE ho vráti. Hore tak pri čítaní zostane
   lišta so značkou a akciou. KLIK DO HLAVIČKY pás NEVRACIA (user, 2026-08-19) -
   vrátenie by posunulo celú hlavičku o 48px dole a položka by ušla spod kurzora.
   Kým je niečo otvorené, stav je zamrazený.

   PREPÍNAČ PUBLIKA SÚ ZÁLOŽKY, NIE TLAČIDLO (user, 2026-08-18): „header musí
   na prvú dobrú ukazovať tie ako keby taby, čo prepínajú celý web - rodiny,
   podnikatelé a města; nesmie to byť taký button". Do vtedy to bolo jedno
   tlačidlo s rozbaľovačkou, teda ovládanie, ktoré svoje tri možnosti ukázalo
   až po kliknutí - z hlavičky sa nedalo prečítať, že web má tri verzie.
   Publiká sú odteraz v lište vidieť naraz, klik prepína rovno a VŽDY vedie na
   úvod - tam má každé publikum svoju verziu webu.
   Publikum je nastavenie, ktoré mení celý web (src/segment.js), nie odkaz v rade.

   KATALÓG JE POD JEDNOU POLOŽKOU „Produkty" (user, 2026-08-18: „produkty môžeme
   dať pod jedno Produkty, tak ako to bolo"). Päť obchodných línií vedľa seba
   zaberalo celý spodný pás a záložky publika sa medzi nimi stratili; panel
   „Produkty" ukáže tie isté línie naraz ako stĺpce - VŠETKY, vrátane Klientského
   servisu a EFFECTIVE (user: „produkty musia byť všetky tie kategórie vnútri").
   „Produkty" stoja na ROVNAKEJ ÚROVNI ako záložky publika, nikdy nad nimi -
   publikum je prvá úroveň navigácie, katalóg je to, čo si pod ním vyberáš.

   OTVORENÁ OS je jedna: čím sa zvolená záložka drží nad foto-hero, kde je
   hlavička priehľadná (`okno` / `obrys`, src/headerVariants.js, prepínač
   „Hlavička hore" v ladiacom paneli).
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './SiteHeader.css'
import { asset } from '../asset.js'
import { MENU, CATS, SEGMENTS, itemsFor } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import ProductIcon from './ProductIcon.jsx'
import MegaMenu from './MegaMenu.jsx'
import { useSegment } from '../segment.js'
import { useTabBar } from '../useTabBar.js'
import { useDebugOption } from './DebugPanel.jsx'
import { HDR_TOP_DEFAULT, hdrTop } from '../headerVariants.js'
import {
  IconAlertTriangle, IconSearch, IconChevronDown, IconUser,
  IconUsers, IconBriefcase, IconBuildingCommunity,
} from '@tabler/icons-react'

// Ikona publika (kľúč drží data/menu.js). Nesie ju každá záložka - publikum tak
// ide prečítať aj bez čítania názvu.
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

export default function SiteHeader() {
  // Publikum je stav webu, nie hlavičky - hlavička ho len prepína a číta.
  const [seg, setSeg] = useSegment()
  const navigate = useNavigate()
  // Jediná otvorená os: čím sa zvolená záložka drží nad foto-hero. Značka je na
  // <html>, nie trieda na `.hdr` - stavy nad hero (`.hero-hdr`) tam už žijú
  // a pravidlá sa musia dať spojiť do jedného selektora bez medzery.
  const [topRaw] = useDebugOption('hdrtop', HDR_TOP_DEFAULT)
  const topMode = hdrTop(topRaw)
  useEffect(() => {
    document.documentElement.dataset.hdrtop = topMode
  }, [topMode])

  // Kde presne je zvolená záložka. Značku výberu (`.hdr-mark`) aj dieru vo variante
  // `okno` kreslí CSS z --hdr-hole-l/-r a tie sa v CSS nedajú vypočítať: šírka
  // záložky závisí od textu („Rodiny a jednotlivci" je dvakrát dlhšie než
  // „Podnikatelé"), od sadzby a na telefóne aj od toho, kam je rad odscrollovaný.
  //
  // Meria sa preto tu, voči PÁSU (nie voči oknu), takže hodnoty platia aj keď sa
  // hlavička posunie transformom. Okrem prvého merania sleduje:
  //   ResizeObserver  - zmena šírky okna
  //   fonts.ready     - písmo sa doťahuje asynchrónne a záložka po ňom zmení šírku
  //   scroll radu     - na telefóne sa rad posúva vodorovne a značka musí ísť s ním
  //
  // `data-slide` zapína prechod (SiteHeader.css) a drží sa len chvíľu po PREPNUTÍ
  // publika. Zmena okna ani vodorovný posun sa animovať nesmú - značka by za
  // ťahom prsta lenivo dobiehala.
  useEffect(() => {
    const band = bandRef.current
    if (!band) return undefined
    const measure = () => {
      const on = band.querySelector('.hdr-tab.on')
      const row = band.querySelector('.hdr-tabs-in')
      if (!on || !row) return
      const b = band.getBoundingClientRect()
      const t = on.getBoundingClientRect()
      // Orezané o viditeľný výsek radu: na telefóne sa rad posúva vodorovne
      // a zvolená záložka môže byť spola za jeho hranou. Značka aj diera visia
      // na PÁSE, ktorý sa neposúva a nič neoreže, takže by inak trčali von.
      const view = row.getBoundingClientRect()
      const l = Math.max(t.left, view.left)
      const r = Math.max(Math.min(t.right, view.right), l)
      band.style.setProperty('--hdr-hole-l', `${Math.round(l - b.left)}px`)
      band.style.setProperty('--hdr-hole-r', `${Math.round(r - b.left)}px`)
    }
    // Prvé meranie po načítaní nesmie byť prechod - značka by sa priplazila
    // z ľavého okraja okna.
    if (firstMeasure.current) firstMeasure.current = false
    else band.dataset.slide = '1'
    measure()
    const end = setTimeout(() => { delete band.dataset.slide }, 400)
    document.fonts?.ready.then(measure).catch(() => {})
    const ro = new ResizeObserver(measure)
    ro.observe(band)
    // Posun radu sa NEANIMUJE: značka by za scrollom lenivo dobiehala. Prvá udalosť
    // posunu preto prechod zhasne - vtedy sa aj tak hýbe celý rad, nie len značka.
    const onRowScroll = () => { delete band.dataset.slide; measure() }
    const row = band.querySelector('.hdr-tabs-in')
    row?.addEventListener('scroll', onRowScroll, { passive: true })
    return () => {
      clearTimeout(end)
      ro.disconnect()
      row?.removeEventListener('scroll', onRowScroll)
    }
  }, [seg])

  // V paneli „Produkty" sú VŠETKY obchodné línie, vo všetkých rozvrhoch (user,
  // 2026-08-18: „produkty musia byť všetky tie kategórie vnútri produktov").
  // Medzikrok, v ktorom Klientský servis a EFFECTIVE zostali v lište zvlášť, padol -
  // jedna položka katalógu znamená jeden katalóg, inak sa človek pýta, prečo dve
  // línie „produkt" nie sú.
  const prodCats = CATS

  const [openCat, setOpenCat] = useState(null)   // otvorený panel: kľúč obchodnej línie
  const [compOpen, setCompOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  // Otvorená kategória v mobilnom drawri. Na začiatku žiadna: prvá úroveň je
  // päť línií a tie majú byť po otvorení menu vidieť všetky naraz.
  const [acc, setAcc] = useState(null)

  const headerRef = useRef(null)
  // Pás publík je vodorovný rad záložiek ako ktorýkoľvek iný na webe: na telefóne sa
  // doň tri plné názvy nezmestia, takže sa posúva a zvolená záložka sa musí sama
  // dostať do výrezu („Města a obce" je tretia a bez toho ju nevidno). Robí to ten
  // istý hook ako záložky v obsahu a dlaždice profilov - aj s ťahaním myšou.
  const bandRef = useTabBar(seg)
  const firstMeasure = useRef(true)
  // Drawer je SÚRODENEC hlavičky (fixed panel pod ňou), nie jej potomok - do
  // „kliku mimo" preto musí ísť zvlášť. Bez neho platil prepínač publika v drawri
  // za klik mimo: `mousedown` zhodil rozbaľovačku ešte pred `click`, riadok sa
  // odmontoval a výber publika sa na telefóne nedal potvrdiť vôbec.
  const drawerRef = useRef(null)

  const closeAll = () => {
    setOpenCat(null); setCompOpen(false); setSearchOpen(false); setDrawer(false)
  }
  const closeDrawer = () => setDrawer(false)
  const anyOpen = openCat || compOpen || searchOpen
  // Čokoľvek rozbalené, vrátane mobilného drawra - to je stav, v ktorom sa
  // hlavička nesmie zasunúť pri scrolle.
  const menuOpen = anyOpen || drawer

  // klik mimo headera (a mimo drawra) zavrie, čo je otvorené
  useEffect(() => {
    if (!anyOpen) return undefined
    const onDown = (e) => {
      const inside = headerRef.current?.contains(e.target) || drawerRef.current?.contains(e.target)
      if (!inside) {
        setOpenCat(null); setCompOpen(false); setSearchOpen(false)
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
      setOpenCat(null); setCompOpen(false); setSearchOpen(false)
      // Fokus späť na prvú záložku publika - je to prvé ovládanie hlavičky
      // v poradí a existuje v každom variante.
      headerRef.current?.querySelector('.hdr-tab')?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [anyOpen])

  // Stav scrollu. `data-hdrhide` na <html> = scrolluje sa dole a spodný pás sa má
  // zasunúť. Značka na dokumente, nie stav v komponente: schovanie mení `--hdr-stick`,
  // teda výšku, ktorá pri scrolle naozaj zostane na obrazovke, a tú si berú sticky
  // prvky a kotvy na stránkach - tie o hlavičke nevedia, ale o <html> áno.
  // Otvorená ponuka stav ZAMRAZÍ - neposunie ním (user, 2026-08-19: „klik do
  // headru by nemal vyrolovať tú hornú lištu, lebo to posunie užívateľovi myšku,
  // to je blbosť"). Do vtedy sa pri otvorení čohokoľvek pás vrátil, celá hlavička
  // sa posunula o jeho výšku dole a položka, na ktorú človek práve klikol, ušla
  // spod kurzora. Kým je niečo otvorené, scroll sa preto len prestane počúvať:
  // pás zostane tam, kde bol, a panel visí z hlavičky, takže ide s ňou.
  useEffect(() => {
    const el = document.documentElement
    if (menuOpen) return undefined
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
    // Upratuje sa LEN poslucháč, značka nie. Efekt sa prepúšťa pri každom otvorení
    // ponuky a keby ju upratoval, zmazal by ju práve vtedy - teda presne to
    // vyrolovanie pásu, ktorému sa vyhýbame. Značku ruší až odmontovanie nižšie.
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  // Hlavička odchádza (odmontovanie) - značka na <html> nesmie prežiť, čítajú ju
  // stránkové CSS aj kotvy.
  useEffect(() => () => { delete document.documentElement.dataset.hdrhide }, [])

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

  const openSearch = () => { setSearchOpen((o) => !o); setOpenCat(null); setCompOpen(false) }
  const closeSearch = () => { setSearchOpen(false); setQuery('') }
  const togglePanel = (key) => {
    setOpenCat((cur) => (cur === key ? null : key))
    setCompOpen(false); setSearchOpen(false)
  }
  const toggleCompany = () => { setCompOpen((p) => !p); setOpenCat(null); setSearchOpen(false) }

  // Prepnutie publika musí zavrieť panel aj zbaliť akordeón: pod novým publikom
  // je v tej istej línii iný zoznam a otvorený panel by sa prekreslil pod rukou.
  // Od 2026-08-16 zatvára aj drawer: prepínač stojí v lište NAD ním, takže by
  // pod otvoreným menu ticho prepísal celý jeho katalóg.
  // Prepnutie publika VŽDY vedie na úvod (user, 2026-08-18). Publikum mení celý
  // web a jeho vstupná stránka je `/` - všetky tri majú svoj úvod tam (zrušená
  // `/podnikatele` sa naň presmerúva). Zostať pri tom na podstránke znamená
  // prepnúť web a vidieť len iný katalóg v lište; kto mení publikum, mení to,
  // čo hľadá, a chce začať odznova.
  // Scroll hore patrí sem, nie do ScrollTop: ten reaguje na ZMENU cesty a kto
  // prepína publikum priamo na úvode, žiadnu nemení - zostal by teda stáť v
  // polovici stránky, ktorá sa mu pod rukou celá prekreslila (user, 2026-08-19).
  // `instant`, nie plynulo: obsah pod prstom sa vymenil, tak nie je čo doscrollovať.
  const pickSeg = (key) => {
    setSeg(key)
    setOpenCat(null); setCompOpen(false); setSearchOpen(false); setAcc(null)
    setDrawer(false)
    navigate('/')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  /* ---------- kusy hlavičky ---------- */

  const logo = (
    <Link className="hdr-logo" to="/" onClick={closeAll} aria-label="Allrisk - domů">
      <img src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
    </Link>
  )

  /* Publikum ako RAD ZÁLOŽIEK. Jeden markup pre všetky tri podoby - líšia sa
     miestom v hlavičke a štýlom, nie obsahom; keby mala každá vlastný JSX,
     rozišli by sa popisky aj poradie a varianty by sa nedali porovnať.

     `role=tablist`, nie `radiogroup`: je to prepínač obsahu pod sebou, presne
     to, čo záložky sú. Zvolená nesie `aria-current="page"` navyše - stránka sa
     pri prepnutí naozaj prekreslí a čítačka to má povedať aj bez tabpanelu
     (ten tu neexistuje, „panel" je celý web).

     Názvy sú v PLNOM ZNENÍ a v každej šírke okna rovnaké (user, 2026-08-18:
     „rodiny musia byť všade v plnom znení - Rodiny a jednotlivci"). Skratka
     „Rodiny" zamlčovala jednotlivcov, čo je pri publiku, ktoré prepína celý web,
     nepresné meno. Pole `short` je preto z `data/menu.js` zrušené a šírku si
     berie hlavička inde - viď rozpočet šírky v SiteHeader.css.

     Ikona je v markupe vždy; ktorý variant ju ukáže, rozhoduje CSS (segmentovaný
     prepínač v hornom páse na ňu nemá šírku). */
  const segTabs = (
    <div className="hdr-tabs" ref={bandRef}>
      {/* Značka výberu. Je to JEDEN prvok pre celý pás, nie pozadie záložky:
          medzi záložkami sa tak dá presunúť (prechod na --hdr-hole-l/-r
          v SiteHeader.css), kdežto pozadie na dvoch rôznych tlačidlách by sa dalo
          len prestriedať. Vo variante `okno` je to plocha lišty, v `obrys` 1px
          obrys so zvodmi do strán. Kreslí sa POD obsahom pásu (z-index:-1). */}
      <span className="hdr-mark" aria-hidden="true" />
      <div className="hdr-tabs-in" role="tablist" aria-label="Pro koho je web">
        {SEGMENTS.map((sgm) => {
          const I = SEG_ICONS[sgm.icon] || IconUsers
          const on = sgm.key === seg
          return (
            <button
              key={sgm.key} type="button" role="tab"
              aria-selected={on} aria-current={on ? 'page' : undefined}
              className={`hdr-tab${on ? ' on' : ''}`}
              onClick={() => pickSeg(sgm.key)}
            >
              <I className="hdr-tab-ic" size={20} stroke={1.8} />
              <span>{sgm.label}</span>
            </button>
          )
        })}
      </div>
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
    // otvorenie menu zhasne hľadanie - jeho panel visí z lišty a stál by nad drawerom
    <button
      className={`hdr-burger ${drawer ? 'on' : ''}`}
      onClick={() => { setDrawer((d) => !d); setSearchOpen(false) }}
      aria-label="Menu" aria-expanded={drawer}
    ><i /><i /><i /></button>
  )
  const mobileSearch = (
    <button className={`hdr-iconbtn ${searchOpen ? 'on' : ''}`} aria-label="Hledat" aria-expanded={searchOpen} onClick={openSearch}><IconSearch size={22} stroke={2} /></button>
  )

  /* KATALÓG. „Produkty" je jedna položka s veľkým panelom (línie ako stĺpce).

     Panel Produktov sa NEVYKRESĽUJE tu, ale až pod oboma pásmi (nižšie v
     `<header>`): je široký ako obsah hlavičky, takže sa kotví na celú hlavičku
     a musí visieť pod ňou v každom rozvrhu. Zvnútra položky by `top:100%`
     znamenalo „pod horným pásom" a vo variante `listy` by prekryl záložky.

     Kľúč otvoreného panelu je `__all`, nie kľúč línie: menu má jeden stav pre
     „čo je otvorené" a Produkty doň musia patriť rovnako ako línie, inak by
     sa dali otvoriť dva panely naraz. */
  const catNav = (
    <nav className="hdr-nav hdr-nav--cats">
      <div className="hdr-navitem hdr-navitem--all">
        <button
          className={openCat === '__all' ? 'on' : ''}
          aria-expanded={openCat === '__all'}
          onClick={() => togglePanel('__all')}
        >
          Produkty <IconChevronDown size={16} stroke={2.2} />
        </button>
      </div>
    </nav>
  )

  return (
    <>
      <header className={`hdr${drawer ? ' hdr--solid' : ''}`} ref={headerRef}>
        {/* ---- pás publík ----
            Úzky pás NAD lištou, zarovnaný k logu. Pri scrolle dole sa zasunie -
            hlavička sa posunie o jeho výšku hore a zostane z nej lišta so
            značkou; scroll hore ho vráti. Je to to isté správanie, aké mal do
            2026-08-18 pás kategórií, len teraz nesie publikum. */}
        {segTabs}

        {/* ---- lišta ----
            Značka vľavo, na druhej strane všetko ostatné: Produkty, Společnost,
            Kontakt, hľadanie, Můj Allrisk a Nahlásit škodu. */}
        <div className="hdr-top">
          <div className="hdr-top-in">
            {logo}
            <span className="hdr-spacer" />
            {/* Katalóg je v lište - publikum má vlastný pás nad ňou. */}
            {catNav}
            {companyMenu}
            {contactLink}
            {searchBtn}
            {accountBtn}
            {claimBtn}
            {mobileSearch}
            {burger}
          </div>
        </div>

        {/* Panel „Produkty" - visí pod CELOU hlavičkou, nie pod svojím tlačidlom.
            Preto stojí až tu, ako súrodenec pásov (rovnako ako panel hľadania). */}
        {openCat === '__all' && <MegaMenu seg={seg} cats={prodCats} onNavigate={closeAll} />}

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
              v lište, aj na telefóne, a od 2026-08-18 sú to rovno tri záložky.
              Publikum mení celý web, takže sa človek nemá dozvedieť až po
              otvorení menu, v akej verzii je - a dva ovládače na tú istú vec
              by zdieľali jeden stav. */}
          {/* ZMAZANÉ 2026-08-19 (user): pole „Hledat…" na začiatku šuflíka.
              Lupa stojí na telefóne natrvalo v lište vedľa burgera (viď
              `mobileSearch`), takže to bolo to isté hľadanie druhýkrát - a to
              druhé ešte aj schované pod menu, ktoré kvôli nemu treba otvoriť.
              Rovnaký dôvod, pre ktorý zo šuflíka odišiel prepínač publika. */}
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
