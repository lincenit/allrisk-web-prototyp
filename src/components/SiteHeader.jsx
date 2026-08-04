import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './SiteHeader.css'
import { asset } from '../asset.js'
import { MENU, CATS, SEGMENTS } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import ProductIcon from './ProductIcon.jsx'
import MegaMenu, { SIDE_TITLE, SIDE_TEXT } from './MegaMenu.jsx'
import {
  IconAlertTriangle, IconSearch, IconChevronDown, IconUser,
} from '@tabler/icons-react'

const COMPANY = [['O nás', '#'], ['Kariéra', '#'], ['Magazín', '#']]
const POPULAR = ['Vozidla', 'Cestovní', 'Nemovitost', 'Investice', 'Život a úraz']

export default function SiteHeader() {
  const [prodOpen, setProdOpen] = useState(false)
  const [compOpen, setCompOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [seg, setSeg] = useState('rodiny')
  const [acc, setAcc] = useState('pojisteni')

  const headerRef = useRef(null)

  const closeAll = () => {
    setProdOpen(false); setCompOpen(false); setSearchOpen(false); setDrawer(false)
  }

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

  // Escape zavrie menu a vráti fokus do lišty
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (!prodOpen && !compOpen && !searchOpen) return
      setProdOpen(false); setCompOpen(false); setSearchOpen(false)
      headerRef.current?.querySelector('.hdr-nav button')?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
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

  const openSearch = () => { setSearchOpen((o) => !o); setProdOpen(false); setCompOpen(false) }
  const closeSearch = () => { setSearchOpen(false); setQuery('') }
  const toggleProducts = () => { setProdOpen((p) => !p); setCompOpen(false); setSearchOpen(false) }

  return (
    <>
      <header className="hdr" ref={headerRef}>
        <div className="hdr-bar">
          <Link className="hdr-logo" to="/" onClick={closeAll} aria-label="Allrisk – domů">
            <img src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
          </Link>
          <span className="hdr-spacer" />
          <nav className="hdr-nav">
            <button className={prodOpen ? 'on' : ''} aria-expanded={prodOpen} onClick={toggleProducts}>
              Produkty <IconChevronDown size={15} stroke={2.2} />
            </button>
            <div className="hdr-dd-wrap">
              <button
                className={compOpen ? 'on' : ''}
                aria-expanded={compOpen}
                onClick={() => { setCompOpen((p) => !p); setProdOpen(false); setSearchOpen(false) }}
              >
                Společnost <IconChevronDown size={15} stroke={2.2} />
              </button>
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
            <button className={`hdr-iconbtn ${searchOpen ? 'on' : ''}`} aria-label="Hledat" aria-expanded={searchOpen} onClick={openSearch}><IconSearch size={18} stroke={2} /></button>
            <button className="hdr-mua"><IconUser size={16} stroke={2} /> Můj Allrisk</button>
            <Link to="/vozidla" className="hdr-claim" onClick={closeAll}><IconAlertTriangle size={16} stroke={2} /> Nahlásit škodu</Link>
          </div>
          <button className={`hdr-burger ${drawer ? 'on' : ''}`} onClick={() => setDrawer((d) => !d)} aria-label="Menu" aria-expanded={drawer}><i /><i /><i /></button>
        </div>

        {/* ---- panel Produkty ---- */}
        {prodOpen && (
          <div className="hdr-mega-wrap">
            <MegaMenu seg={seg} setSeg={setSeg} onNavigate={closeAll} />
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

      {/* mobile drawer */}
      <div className={`hdr-drawer ${drawer ? 'open' : ''}`}>
        <div className="hdr-drawer-in">
          <button className="hdr-mfield" onClick={() => { setDrawer(false); setSearchOpen(true) }}><IconSearch size={18} stroke={2} /> Hledat…</button>

          {/* Segment stojí RAZ nad celým zoznamom, nie v každej kategórii.
              Predtým žil vnútri otvorenej kategórie, takže sa opakoval päťkrát
              a skákal podľa toho, čo mal používateľ práve rozbalené. */}
          <div className="hdr-mseg">
            {/* Titulok aj text sú tie isté reťazce ako v modrom paneli desktopového
                mega-menu — na mobile totiž nie je čo kliknúť „Produkty", takže by
                prepínač aj zoznam kategórií pod ním stáli bez toho, čoho sa týkajú. */}
            <h2 className="hdr-mseg-h">{SIDE_TITLE}</h2>
            <p className="hdr-mseg-tx">{SIDE_TEXT}</p>
            <div className="hdr-segtabs" role="tablist" aria-label="Pro koho">
              {SEGMENTS.map((s) => (
                <button
                  key={s.key} type="button" role="tab" aria-selected={s.key === seg}
                  className={s.key === seg ? 'on' : ''} onClick={() => setSeg(s.key)}
                >
                  {s.short}
                </button>
              ))}
            </div>
          </div>

          <div className="hdr-acc">
            {CATS.map((c) => (
              <div key={c.key}>
                <button className={`hdr-acc-row ${acc === c.key ? 'open' : ''}`} aria-expanded={acc === c.key} onClick={() => setAcc(acc === c.key ? null : c.key)}>
                  {c.label}
                  <IconChevronDown className="hdr-acc-ch" size={20} stroke={2} />
                </button>
                {acc === c.key && (
                  <div className="hdr-acc-sub">
                    {/* zoznam, nie mriežka — produkty idú pod sebou na plnú šírku */}
                    {MENU[seg][c.key].map((item) => (
                      <Link className="hdr-item" key={item.label} to={routeFor(item.label)} onClick={() => setDrawer(false)}>
                        <ProductIcon name={item.icon} />
                        <span><b>{item.label}</b></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hdr-mlinks">
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
