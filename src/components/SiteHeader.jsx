import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './SiteHeader.css'
import { asset } from '../asset.js'
import { MENU, CATS, SEGMENTS } from '../data/menu.js'
import {
  IconCar, IconHome, IconArmchair, IconShield, IconScale, IconHeartHandshake, IconWorld,
  IconChartLine, IconCoin, IconBuildingBank, IconBuildingSkyscraper, IconTruck, IconBriefcase,
  IconBolt, IconKey, IconAlertTriangle, IconFileText, IconPlant2, IconFish, IconPhone,
  IconSearch, IconChevronDown, IconChevronRight, IconUser, IconCompass,
} from '@tabler/icons-react'

const ICONMAP = {
  car: IconCar, house: IconHome, box: IconArmchair, shield: IconShield, scale: IconScale,
  heart: IconHeartHandshake, globe: IconWorld, chart: IconChartLine, coin: IconCoin,
  bank: IconBuildingBank, building: IconBuildingSkyscraper, truck: IconTruck, briefcase: IconBriefcase,
  bolt: IconBolt, key: IconKey, warn: IconAlertTriangle, doc: IconFileText, leaf: IconPlant2,
  fish: IconFish, phone: IconPhone,
}
const Ic = ({ k }) => { const C = ICONMAP[k] || IconFileText; return <span className="hdr-ic"><C size={18} stroke={1.7} /></span> }

const COMPANY = [['O nás', '#'], ['Kariéra', '#'], ['Magazín', '#']]
const POPULAR = ['Vozidla', 'Cestovní', 'Nemovitost', 'Investice', 'Život a úraz']

// kde má produkt reálnu stránku v prototype
const routeFor = (label) => (label === 'Vozidla' ? '/vozidla' : '#')

export default function SiteHeader() {
  const [prodOpen, setProdOpen] = useState(false)
  const [compOpen, setCompOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [seg, setSeg] = useState('rodiny')
  const [railCat, setRailCat] = useState('pojisteni')
  const [acc, setAcc] = useState('pojisteni')

  const headerRef = useRef(null)

  // aplikuj uloženú variantu headera (svetlá/modrá) pri načítaní – platí naprieč routami
  useEffect(() => {
    document.documentElement.classList.toggle('header-light', localStorage.getItem('wfHeader') === 'light')
  }, [])

  // klik mimo headera zavrie otvorené menu (Produkty / Společnost / hľadanie)
  useEffect(() => {
    if (!prodOpen && !compOpen && !searchOpen) return
    const onDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setProdOpen(false); setCompOpen(false); setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [prodOpen, compOpen, searchOpen])

  const searchIndex = useMemo(() => {
    const out = []; const seen = new Set()
    for (const c of CATS) {
      for (const item of (MENU[seg]?.[c.key] || [])) {
        if (seen.has(item.label)) continue
        seen.add(item.label)
        out.push({ ...item, cat: c.label })
      }
    }
    return out
  }, [seg])

  const q = query.trim().toLowerCase()
  const results = q ? searchIndex.filter((i) => i.label.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q)) : []

  const closeAll = () => { setProdOpen(false); setCompOpen(false); setSearchOpen(false); setDrawer(false) }
  const openSearch = () => { setSearchOpen((o) => !o); setProdOpen(false); setCompOpen(false) }
  const closeSearch = () => { setSearchOpen(false); setQuery('') }

  return (
    <>
      <header className="hdr" ref={headerRef}>
        <div className="hdr-bar">
          <Link className="hdr-logo" to="/" onClick={closeAll} aria-label="Allrisk – domů">
            <img src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
          </Link>
          <span className="hdr-spacer" />
          <nav className="hdr-nav">
            <button className={prodOpen ? 'on' : ''} onClick={() => { setProdOpen((p) => !p); setCompOpen(false); setSearchOpen(false) }}>Produkty <IconChevronDown size={15} stroke={2.2} /></button>
            <NavLink to="/test" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Test pojištění</NavLink>
            <div className="hdr-dd-wrap">
              <button className={compOpen ? 'on' : ''} onClick={() => { setCompOpen((p) => !p); setProdOpen(false); setSearchOpen(false) }}>Společnost <IconChevronDown size={15} stroke={2.2} /></button>
              {compOpen && (
                <div className="hdr-dd">
                  {COMPANY.map(([l, to]) => <a key={l} href={to} onClick={closeAll}>{l}</a>)}
                </div>
              )}
            </div>
            <NavLink to="/kontakt" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Kontakt</NavLink>
          </nav>
          <span className="hdr-divider" />
          <div className="hdr-actions">
            <button className={`hdr-iconbtn ${searchOpen ? 'on' : ''}`} aria-label="Hledat" onClick={openSearch}><IconSearch size={18} stroke={2} /></button>
            <button className="hdr-mua"><IconUser size={16} stroke={2} /> Můj Allrisk</button>
            <Link to="/vozidla" className="hdr-claim" onClick={closeAll}><IconAlertTriangle size={16} stroke={2} /> Nahlásit škodu</Link>
          </div>
          <button className={`hdr-burger ${drawer ? 'on' : ''}`} onClick={() => setDrawer((d) => !d)} aria-label="Menu"><i /><i /><i /></button>
        </div>

        {prodOpen && (
          <div className="hdr-mega-wrap">
            <div className="hdr-mega">
              <div className="hdr-mega-body">
                <div className="hdr-rail">
                  <div className="hdr-rail-cats">
                    {CATS.map((c) => (
                      <button key={c.key} className={railCat === c.key ? 'on' : ''} onMouseEnter={() => setRailCat(c.key)} onClick={() => setRailCat(c.key)}>
                        {c.label}<span className="ch"><IconChevronRight size={16} stroke={2} /></span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="hdr-panel">
                  <div className="hdr-seg">
                    {SEGMENTS.map((s) => (
                      <button key={s.key} className={s.key === seg ? 'on' : ''} onClick={() => setSeg(s.key)}>{s.label}</button>
                    ))}
                  </div>
                  <div className="hdr-mega-grid">
                    {MENU[seg][railCat].map((item) => (
                      <Link className="hdr-item" key={item.label} to={routeFor(item.label)} onClick={closeAll}>
                        <Ic k={item.icon} />
                        <span><b>{item.label}</b></span>
                      </Link>
                    ))}
                    <Link className="hdr-item hdr-item--help" to="/test" onClick={closeAll}>
                      <span className="hdr-ic"><IconCompass size={22} stroke={1.7} /></span>
                      <span><b>Nevíte si rady?</b></span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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
                            <Ic k={item.icon} />
                            <span><b>{item.label}</b><small>{item.cat}</small></span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="hdr-search-empty">Pro „{query}" jsme nic nenašli. Zkuste jiný výraz.</div>
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

      {/* mobile drawer */}
      <div className={`hdr-drawer ${drawer ? 'open' : ''}`}>
        <div className="hdr-drawer-in">
          <button className="hdr-mfield" onClick={() => { setDrawer(false); setSearchOpen(true) }}><IconSearch size={18} stroke={2} /> Hledat…</button>
          <div className="hdr-acc">
            {CATS.map((c) => (
              <div key={c.key}>
                <button className={`hdr-acc-row ${acc === c.key ? 'open' : ''}`} onClick={() => setAcc(acc === c.key ? null : c.key)}>{c.label}</button>
                {acc === c.key && (
                  <div className="hdr-acc-sub">
                    <div className="hdr-segtabs">{SEGMENTS.map((s) => (<button key={s.key} className={s.key === seg ? 'on' : ''} onClick={() => setSeg(s.key)}>{s.short}</button>))}</div>
                    <div className="hdr-mega-grid">
                      {MENU[seg][c.key].map((item) => (
                        <Link className="hdr-item" key={item.label} to={routeFor(item.label)} onClick={() => setDrawer(false)}>
                          <Ic k={item.icon} />
                          <span><b>{item.label}</b></span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hdr-mlinks">
            <Link to="/test" onClick={() => setDrawer(false)}>Test pojištění</Link>
            {COMPANY.map(([l, to]) => <a key={l} href={to}>{l}</a>)}
            <Link to="/kontakt" onClick={() => setDrawer(false)}>Kontakt</Link>
          </div>
          <div className="hdr-mfoot">
            <Link to="/vozidla" className="hdr-claim" onClick={() => setDrawer(false)}><IconAlertTriangle size={16} stroke={2} /> Nahlásit škodu</Link>
            <button className="hdr-mua"><IconUser size={16} stroke={2} /> Můj Allrisk</button>
          </div>
        </div>
      </div>
    </>
  )
}
