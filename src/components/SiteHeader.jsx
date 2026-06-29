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
const Ic = ({ k }) => { const C = ICONMAP[k] || IconFileText; return <span className="wfh-ic"><C size={18} stroke={1.7} /></span> }

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
      <header className="wfh" ref={headerRef}>
        <div className="wfh-bar">
          <Link className="wfh-logo" to="/" onClick={closeAll} aria-label="Allrisk – domů">
            <img src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
          </Link>
          <span className="wfh-spacer" />
          <nav className="wfh-nav">
            <button className={prodOpen ? 'on' : ''} onClick={() => { setProdOpen((p) => !p); setCompOpen(false); setSearchOpen(false) }}>Produkty <IconChevronDown size={15} stroke={2.2} /></button>
            <NavLink to="/test" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Test pojištění</NavLink>
            <div className="wfh-dd-wrap">
              <button className={compOpen ? 'on' : ''} onClick={() => { setCompOpen((p) => !p); setProdOpen(false); setSearchOpen(false) }}>Společnost <IconChevronDown size={15} stroke={2.2} /></button>
              {compOpen && (
                <div className="wfh-dd">
                  {COMPANY.map(([l, to]) => <a key={l} href={to} onClick={closeAll}>{l}</a>)}
                </div>
              )}
            </div>
            <a href="#">Kontakt</a>
          </nav>
          <span className="wfh-divider" />
          <div className="wfh-actions">
            <button className={`wfh-iconbtn ${searchOpen ? 'on' : ''}`} aria-label="Hledat" onClick={openSearch}><IconSearch size={18} stroke={2} /></button>
            <button className="wfh-mua"><IconUser size={16} stroke={2} /> Můj Allrisk</button>
            <Link to="/vozidla" className="wfh-claim" onClick={closeAll}><IconAlertTriangle size={16} stroke={2} /> Nahlásit škodu</Link>
          </div>
          <button className={`wfh-burger ${drawer ? 'on' : ''}`} onClick={() => setDrawer((d) => !d)} aria-label="Menu"><i /><i /><i /></button>
        </div>

        {prodOpen && (
          <div className="wf-mega-wrap">
            <div className="wf-mega">
              <div className="wf-mega-body">
                <div className="wf-rail">
                  <div className="wf-rail-cats">
                    {CATS.map((c) => (
                      <button key={c.key} className={railCat === c.key ? 'on' : ''} onMouseEnter={() => setRailCat(c.key)} onClick={() => setRailCat(c.key)}>
                        {c.label}<span className="ch"><IconChevronRight size={16} stroke={2} /></span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="wf-panel">
                  <div className="wf-seg">
                    {SEGMENTS.map((s) => (
                      <button key={s.key} className={s.key === seg ? 'on' : ''} onClick={() => setSeg(s.key)}>{s.label}</button>
                    ))}
                  </div>
                  <div className="wf-mega-grid">
                    {MENU[seg][railCat].map((item) => (
                      <Link className="wf-item" key={item.label} to={routeFor(item.label)} onClick={closeAll}>
                        <Ic k={item.icon} />
                        <span><b>{item.label}</b></span>
                      </Link>
                    ))}
                    <Link className="wf-item wf-item--help" to="/test" onClick={closeAll}>
                      <span className="wfh-ic"><IconCompass size={22} stroke={1.7} /></span>
                      <span><b>Nevíte si rady?</b></span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {searchOpen && (
          <div className="wf-mega-wrap">
            <div className="wf-mega wf-search">
              <div className="wf-search-bar">
                <IconSearch size={20} stroke={2} />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hledat produkt nebo službu…" />
                {query && <button className="wf-search-clear" onClick={() => setQuery('')} aria-label="Vymazat">✕</button>}
              </div>
              <div className="wf-search-body">
                {q ? (
                  results.length ? (
                    <>
                      <div className="wf-search-lbl">Výsledky · {results.length}</div>
                      <div className="wf-mega-grid">
                        {results.map((item) => (
                          <Link className="wf-item" key={item.label} to={routeFor(item.label)} onClick={closeSearch}>
                            <Ic k={item.icon} />
                            <span><b>{item.label}</b><small>{item.cat}</small></span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="wf-search-empty">Pro „{query}" jsme nic nenašli. Zkuste jiný výraz.</div>
                  )
                ) : (
                  <>
                    <div className="wf-search-lbl">Oblíbená hledání</div>
                    <div className="wf-search-chips">
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
      <div className={`wf-drawer ${drawer ? 'open' : ''}`}>
        <div className="wf-drawer-in">
          <button className="wf-mfield" onClick={() => { setDrawer(false); setSearchOpen(true) }}><IconSearch size={18} stroke={2} /> Hledat…</button>
          <div className="wf-acc">
            {CATS.map((c) => (
              <div key={c.key}>
                <button className={`wf-acc-row ${acc === c.key ? 'open' : ''}`} onClick={() => setAcc(acc === c.key ? null : c.key)}>{c.label}</button>
                {acc === c.key && (
                  <div className="wf-acc-sub">
                    <div className="wf-segtabs">{SEGMENTS.map((s) => (<button key={s.key} className={s.key === seg ? 'on' : ''} onClick={() => setSeg(s.key)}>{s.short}</button>))}</div>
                    {MENU[seg][c.key].map((item) => (
                      <Link className="wf-acc-item" key={item.label} to={routeFor(item.label)} onClick={() => setDrawer(false)}><Ic k={item.icon} />{item.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="wf-mlinks">
            <Link to="/test" onClick={() => setDrawer(false)}>Test pojištění</Link>
            {COMPANY.map(([l, to]) => <a key={l} href={to}>{l}</a>)}
            <a href="#">Kontakt</a>
          </div>
          <div className="wf-mfoot">
            <Link to="/vozidla" className="wfh-claim" onClick={() => setDrawer(false)}><IconAlertTriangle size={16} stroke={2} /> Nahlásit škodu</Link>
            <button className="wfh-mua"><IconUser size={16} stroke={2} /> Můj Allrisk</button>
          </div>
        </div>
      </div>
    </>
  )
}
