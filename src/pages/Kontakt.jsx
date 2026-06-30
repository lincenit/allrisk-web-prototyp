import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './kontakt.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { BRANCHES, REGIONS, regionLabel, advisorsForBranch } from '../data/pobocky.js'
import {
  IconPhone, IconMail, IconSearch, IconMapPin, IconUsers, IconArrowRight,
} from '@tabler/icons-react'

const REGION_ORDER = ['praha', 'cechy', 'morava']
const poradci = (n) => `${n} ${n === 1 ? 'poradce' : n < 5 ? 'poradci' : 'poradců'}`

export default function Kontakt() {
  const [q, setQ] = useState('')
  useHeroHeader()

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return BRANCHES
    return BRANCHES.filter((b) => [b.city, b.cityFull, b.street, b.zip].some((s) => s.toLowerCase().includes(needle)))
  }, [q])

  const groups = REGION_ORDER
    .map((rk) => ({ rk, label: regionLabel(rk), items: filtered.filter((b) => b.region === rk) }))
    .filter((g) => g.items.length)

  return (
    <div className="site">
      {/* ===== HERO ===== */}
      <section className="chero">
        <div className="chero-bg" style={{ backgroundImage: `url(${asset('/kontakt/hero.jpg')})` }} aria-hidden="true" />
        <div className="wrap chero-in">
          <h1>Kontakt</h1>
          <p>Najdete nás po celé České republice. Vyberte si nejbližší pobočku, prohlédněte si tým – nebo nám rovnou napište.</p>
          <div className="chero-quick">
            <a href="tel:+420545110341" className="cq"><span className="ic"><IconPhone size={20} stroke={1.8} /></span><span><b>+420 545 110 341</b><small>Po–Pá 8:00–17:00</small></span></a>
            <a href="mailto:allrisk@allrisk.cz" className="cq"><span className="ic"><IconMail size={20} stroke={1.8} /></span><span><b>allrisk@allrisk.cz</b><small>Napište nám kdykoliv</small></span></a>
          </div>
        </div>
      </section>

      {/* ===== POBOČKY + MAPA ===== */}
      <section className="sec wrap">
        <div className="sec-h"><span className="ey">Naše pobočky</span><h2>Najděte poradce <b>ve svém okolí</b></h2></div>

        <div className="contact-layout">
          <div className="pob-side">
            <div className="pob-search" style={{ marginBottom: 22 }}>
              <IconSearch size={20} stroke={2} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Hledat město, ulici nebo PSČ…" />
            </div>

            {groups.length ? (
              <div className="pob-list">
                {groups.map((g) => (
                  <section className="pob-group" key={g.rk}>
                    <h3 className="pob-group-h">{g.label}</h3>
                    {g.items.map((b) => (
                      <Link className="pob-row" key={b.slug} to={`/pobocky/${b.slug}`}>
                        <img src={b.img} alt={b.name} loading="lazy" />
                        <span className="tx">
                          <span className="nm">{b.name}{b.hq && <span className="hq">Centrála</span>}</span>
                          <span className="loc"><IconMapPin size={15} stroke={1.8} />{b.street}, {b.zip} {b.cityFull}</span>
                          <span className="cnt"><IconUsers size={15} stroke={1.8} />{poradci(advisorsForBranch(b.slug).length)}</span>
                        </span>
                        <span className="go"><IconArrowRight size={18} stroke={2.2} /></span>
                      </Link>
                    ))}
                  </section>
                ))}
              </div>
            ) : (
              <div className="pob-empty">Pro zadané hledání jsme nenašli žádnou pobočku. Zkuste jiný výraz.</div>
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

      {/* ===== KONTAKTNÝ BAND (formulár) ===== */}
      <ContactBand />

      <SiteFooter />
    </div>
  )
}
