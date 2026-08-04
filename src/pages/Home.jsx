import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './wireframe.css'
import './home.css'
import './profile.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { MENU, CATS, SEGMENTS, ICONS } from '../data/menu.js'
import { JOURNEY, BRAND_ATTRS, STATS, HERO_STAT, REFS } from '../data/home.js'
import { PROFILES, countGen } from '../data/profiles.js'
import { ProfileCards } from '../components/ProfileParts.jsx'
import { SecHead } from '../components/PageParts.jsx'
import {
  IconArrowRight, IconChevronDown, IconMapPin, IconUsers, IconShieldCheck,
  IconHeartHandshake, IconBriefcase, IconCircleCheck, IconLicense,
} from '@tabler/icons-react'

// Kľúč ikony z data/home.js -> tabler komponent (dáta samotné zostávajú bez Reactu).
const ATTR_ICONS = {
  briefcase: IconBriefcase, mappin: IconMapPin, shield: IconShieldCheck,
  handshake: IconHeartHandshake, users: IconUsers,
}

// Produktové routy, ktoré už v prototype existujú (aby CTA neviedli do prázdna).
const ROUTE = { 'pojisteni-vozidel': '/vozidla' }
const ITEM_ROUTE = { Vozidla: '/vozidla' }

// Položka bez vlastnej stránky vedie na kontakt aj s témou – pristátie tak nadväzuje na klik.
const itemHref = (label) => ITEM_ROUTE[label] || `/kontakt?tema=${encodeURIComponent(label)}`

const CLAIM_I = JOURNEY.findIndex((n) => n.red)

// „Cesta života" – zvislá hladká krivka, uzol na každom kroku.
const STEPH = 240                                  // výška jedného kroku (px, = scroll dráha)
const VBW = 400                                    // šírka viewBoxu krivky
const xFrac = (i) => 0.24 + 0.12 * Math.sin(i * 0.9 + 0.4)   // ~0.12..0.36 – úzka krivka, vpravo zostáva miesto na štítok
const nodeY = (i) => (i + 0.5) * STEPH
const RAIL_H = JOURNEY.length * STEPH
function buildPath(needs) {
  const pts = [
    [xFrac(0) * VBW, 0],
    ...needs.map((n, i) => [xFrac(i) * VBW, nodeY(i)]),
    [xFrac(needs.length - 1) * VBW, RAIL_H],
  ]
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}
const JRN_PATH = buildPath(JOURNEY)

// Rozcestník: prvá kategória otvorená, zvyšok zbalený – čítač namiesto steny 27 položiek.
const DEFAULT_CAT = 'pojisteni'
const serviceCountLabel = (n) => `${n} ${n === 1 ? 'služba' : n < 5 ? 'služby' : 'služeb'}`
const areaCountLabel = (n) => (n === 1 ? '1 oblasti' : `${n} oblastech`)

function NeedIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

// Zdieľaný detail jednej potreby (desktop panel aj mobilný accordion).
function NeedDetail({ need, compact }) {
  const route = ROUTE[need.slug]
  const red = !!need.red
  return (
    <>
      <div className="jrn-main">
        {!compact && <span className={red ? 'jrn-tag red' : 'jrn-tag'}>{need.event}</span>}
        {!compact && <h3>{need.service}</h3>}
        <p>{need.lead}</p>
        <div className="jrn-cta">
          <Link to="/kontakt" className={red ? 'btn red-cta' : 'btn fill'}>
            {red ? 'Nahlásit událost' : 'Sjednat schůzku'} <IconArrowRight size={18} stroke={2.2} />
          </Link>
          {route && (
            <Link to={route} className="btn">
              Zjistit více <IconArrowRight size={18} stroke={2.2} />
            </Link>
          )}
        </div>
      </div>
      <div>
        <div className="jrn-cov-lbl">Co to zahrnuje</div>
        <ul className={red ? 'jrn-cov red' : 'jrn-cov'}>
          {need.tabs.map((t) => (
            <li key={t.label}>
              <span className="ci"><IconCircleCheck size={16} stroke={2.2} /></span>
              <span><b>{t.label}</b><small>{t.body}</small></span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default function Home() {
  useHeroHeader(true)
  const [params, setParams] = useSearchParams()
  const [active, setActive] = useState(0)
  const [seg, setSeg] = useState(() => {
    const s = params.get('seg')
    return SEGMENTS.some((x) => x.key === s) ? s : 'rodiny'
  })
  const [openCats, setOpenCats] = useState(() => new Set([DEFAULT_CAT]))
  const cur = JOURNEY[active] || JOURNEY[0]
  const step = Math.max(0, active) + 1
  const nodeRefs = useRef([])
  const mNodeRefs = useRef([])

  // Aktívny bod = ten, ktorý pri scrolle prechádza stredom obrazovky.
  useEffect(() => {
    const els = nodeRefs.current.filter(Boolean)
    if (!els.length || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i))
        })
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Doscrolluje na uzol – na desktope na bod krivky, na mobile na položku accordionu.
  const scrollToNode = useCallback((i) => {
    const el = (window.matchMedia('(min-width:900px)').matches ? nodeRefs : mNodeRefs).current[i]
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
  }, [])

  // Hĺbkový odkaz #cesta-<key> – pozícia na ceste sa dá zdieľať a prežije refresh.
  useEffect(() => {
    const m = /^#cesta-(.+)$/.exec(window.location.hash)
    if (!m) return undefined
    const i = JOURNEY.findIndex((n) => n.key === decodeURIComponent(m[1]))
    if (i < 0) return undefined
    setActive(i)
    const t = setTimeout(() => scrollToNode(i), 0)
    return () => clearTimeout(t)
  }, [scrollToNode])

  const goTo = (i) => {
    setActive(i)
    scrollToNode(i)
    window.history.replaceState(null, '', `#cesta-${JOURNEY[i].key}`)
  }

  // Segment drží URL (?seg=), aby refresh ani zdieľaný odkaz nezhodili výber.
  const pickSeg = (key) => {
    setSeg(key)
    setOpenCats(new Set([DEFAULT_CAT]))
    const next = new URLSearchParams(params)
    next.set('seg', key)
    setParams(next, { replace: true })
  }

  const groups = CATS.filter((c) => MENU[seg][c.key]?.length)
  const total = groups.reduce((s, c) => s + MENU[seg][c.key].length, 0)
  const allOpen = groups.every((c) => openCats.has(c.key))
  const toggleCat = (key) => setOpenCats((prev) => {
    const next = new Set(prev)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  })
  const toggleAll = () => setOpenCats(allOpen ? new Set() : new Set(groups.map((c) => c.key)))

  return (
    <div className="site">
      <main>
        {/* ============ HERO ============ */}
        <section className="hero home-hero">
          <div className="wrap hero-in">
            <div className="hero-tx">
              <span className="ey">Váš partner na každý krok</span>
              <h1>V každé zatáčce <b>nejste sami.</b></h1>
              <p className="hero-lead">
                Pojištění, bydlení i finance pod jednou střechou. Neprodáváme produkty –
                poradíme a zůstaneme po vašem boku, i když jde do tuhého.
              </p>
              <div className="hero-cta">
                <Link to="/kontakt" className="btn fill">Sjednat schůzku <IconArrowRight size={18} stroke={2.2} /></Link>
                <a href="#cesta" className="btn">Projít cestu života <IconChevronDown size={18} stroke={2.2} /></a>
              </div>
              <div className="home-hero-mini">
                <div className="n">{HERO_STAT.n}</div>
                <div className="c">{HERO_STAT.c}</div>
              </div>
            </div>
            <div className="hero-media hero-media-img home-hero-visual">
              <img
                src={asset('/brand/line-hero-1.png')}
                alt="Barevná linka Allrisk spojující pojištění, bydlení a finance napříč životem"
                width="720" height="560" decoding="async"
              />
            </div>
          </div>
        </section>

        {/* ============ CESTA ŽIVOTA ============ */}
        <section id="cesta" className="jrn sec">
          <div className="wrap">
            <SecHead
              ey="Cesta života"
              title={<>Život má mnoho zatáček. <b>V každé jsme po ruce.</b></>}
              lead="Vyberte, co právě řešíte – ukážeme, jak vás Allrisk provede a co přesně zařídíme za vás."
              leadClass="jrn-intro"
            >
              {/* Dve skratky: kto už škodu má, nemusí prejsť celou cestou; kto chce produkty, preskočí ju. */}
              <div className="jrn-jump">
                <a
                  href={`#cesta-${JOURNEY[CLAIM_I].key}`}
                  className="jrn-jump-b red"
                  onClick={(e) => { e.preventDefault(); goTo(CLAIM_I) }}
                >
                  Něco se stalo? Jsme u toho <IconArrowRight size={16} stroke={2.2} />
                </a>
                <a href="#nabidka" className="jrn-jump-b">
                  Chci rovnou vidět nabídku <IconArrowRight size={16} stroke={2.2} />
                </a>
              </div>
            </SecHead>

            {/* desktop: zvislá krivka vľavo + sticky obsah vpravo */}
            <div className="jrn2-h">
              <div className="jrn2-grid">
                <div className="jrn2-rail" style={{ height: RAIL_H }}>
                  <svg className="jrn2-svg" viewBox={`0 0 ${VBW} ${RAIL_H}`} preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="jrnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0021E5" />
                        <stop offset="35%" stopColor="#01C7FF" />
                        <stop offset="70%" stopColor="#8806E4" />
                        <stop offset="100%" stopColor="#571483" />
                      </linearGradient>
                    </defs>
                    <path className="jrn2-base" d={JRN_PATH} />
                    <path className="jrn2-prog" d={JRN_PATH} pathLength="1" style={{ '--prog': 1 - step / JOURNEY.length }} />
                  </svg>
                  {JOURNEY.map((n, i) => (
                    <button
                      key={n.key}
                      ref={(el) => (nodeRefs.current[i] = el)}
                      data-i={i}
                      aria-label={`${n.event} – ${n.service}`}
                      aria-current={active === i}
                      className={`jrn2-node${active === i ? ' on' : ''}${i < active ? ' visited' : ''}${n.red ? ' red' : ''}`}
                      style={{ left: `${xFrac(i) * 100}%`, top: `${nodeY(i)}px` }}
                      onClick={() => goTo(i)}
                    >
                      <span className="jrn2-dot"><NeedIcon d={n.icon} /></span>
                      <span className="jrn2-nlab"><b>{n.event}</b><span>{n.service}</span></span>
                    </button>
                  ))}
                </div>
                <div>
                  <div className="jrn2-panel">
                    {/* Stabilný stav: koľko krokov cesta má a kde na nej stojím. */}
                    <div className="jrn2-step">
                      <span className="jrn2-step-n">Krok {step} z {JOURNEY.length}</span>
                      <span className="jrn2-step-bar"><i style={{ '--p': step / JOURNEY.length }} /></span>
                    </div>
                    <div className="jrn2-panel-in jrn-fade" key={active}>
                      <NeedDetail need={cur} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* mobil: vertikálna časová os */}
            <div className="jrn-v">
              {JOURNEY.map((n, i) => (
                <div
                  key={n.key}
                  ref={(el) => (mNodeRefs.current[i] = el)}
                  className={`jrn-item ${n.red ? 'red' : ''}${active === i ? ' on' : ''}`}
                >
                  <span className="jrn-vdot"><NeedIcon d={n.icon} /></span>
                  <button
                    className="jrn-vhead"
                    aria-expanded={active === i}
                    onClick={() => setActive(active === i ? -1 : i)}
                  >
                    <b>{n.event}</b><span>{n.service}</span>
                  </button>
                  {active === i && (
                    <div className="jrn-vbody">
                      <NeedDetail need={n} compact />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ KLIENTSKÉ PROFILY ============ */}
        {/* Vstup do profilu = vlastná stránka /profil/:slug (archetyp + čo mať vyriešené + situácie). */}
        <section className="sec wrap">
          <SecHead
            ey="Klientské profily"
            title={<>Najděte se v <b>jednom ze {countGen(PROFILES.length)} profilů.</b></>}
            lead="Každý profil ukazuje, co je v jeho situaci dobré mít vyřešeno – a co se stane, když to zrovna chybí."
          />
          <ProfileCards profiles={PROFILES} />
        </section>

        {/* ============ KOMPLETNÍ NABÍDKA (rozcestník) ============ */}
        <section id="nabidka" className="sec wrap home-cat">
          <SecHead
            ey="Kompletní nabídka"
            title={<>Vše, co u nás <b>vyřešíte.</b></>}
            lead="Od pojištění přes reality po finance – pro rodiny, podnikatele i obce. Vyberte, koho se to týká, a rozbalte, co vás zajímá."
          />
          <div className="home-seg" role="tablist" aria-label="Segment">
            {SEGMENTS.map((s) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={seg === s.key}
                className={seg === s.key ? 'on' : ''}
                onClick={() => pickSeg(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="home-catbar">
            <p className="home-catcount">{serviceCountLabel(total)} v {areaCountLabel(groups.length)}</p>
            <button className="home-catall" onClick={toggleAll} aria-expanded={allOpen}>
              {allOpen ? 'Sbalit vše' : 'Rozbalit vše'}
            </button>
          </div>
          <div className="home-catgroups">
            {groups.map((c) => {
              const items = MENU[seg][c.key]
              const open = openCats.has(c.key)
              return (
                <div className={`home-catgroup${open ? ' open' : ''}`} key={c.key}>
                  <h3>
                    <button aria-expanded={open} aria-controls={`cat-${c.key}`} onClick={() => toggleCat(c.key)}>
                      <span className="lbl">{c.label}</span>
                      <span className="cnt">{items.length}</span>
                      <IconChevronDown className="cv" size={18} stroke={2} aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="home-catgrid" id={`cat-${c.key}`} hidden={!open}>
                    {items.map((item, idx) => (
                      <Link key={`${c.key}-${idx}`} to={itemHref(item.label)} className="home-catitem">
                        <span className="ci">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={ICONS[item.icon]} />
                          </svg>
                        </span>
                        <span className="tx"><b>{item.label}</b>{item.desc && <small>{item.desc}</small>}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ============ PROČ ALLRISK ============ */}
        <section className="sec wrap">
          <div className="home-why">
            <div className="home-attr-lead">
              <h2>Partner, ne <b>prodejce smluv.</b></h2>
              <p>Klienti si nás vybírají proto, že jsme nejlepší – ne proto, že jsme nejlevnější.</p>
            </div>
            <div className="home-attrs">
              {BRAND_ATTRS.map((a) => {
                const Ic = ATTR_ICONS[a.icon]
                return (
                  <div className="home-attr" key={a.t}>
                    <span className="ai"><Ic size={24} stroke={1.7} /></span>
                    <div><h3>{a.t}</h3><p>{a.d}</p></div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============ EKOSYSTÉM ============ */}
        <section className="sec wrap">
          <div className="home-eco">
            <div className="home-eco-tx">
              <h2>Jedna střecha pro <b>celý váš svět.</b></h2>
              <p>
                Auto, byt, rodina, investice i cesty – místo pěti smluv u pěti firem máte
                jeden ekosystém a jednoho poradce, který ví, jak spolu vaše potřeby souvisí.
              </p>
              <ul className="home-eco-list">
                <li><span className="ci"><IconCircleCheck size={16} stroke={2.2} /></span> Pojištění majetku, vozidel, osob i cest</li>
                <li><span className="ci"><IconCircleCheck size={16} stroke={2.2} /></span> Reality a hypotéky pod jednou střechou</li>
                <li><span className="ci"><IconCircleCheck size={16} stroke={2.2} /></span> Investice, spoření a zajištění příjmu</li>
              </ul>
            </div>
            <div className="illus">
              <img className="illus-img" src={asset('/illus/ecosystem.svg')} alt="Ekosystém služeb Allrisk – pojištění, reality a finance propojené do jednoho celku" loading="lazy" />
            </div>
          </div>
        </section>

        {/* ============ DŮKAZ ============ */}
        <section className="sec wrap">
          <SecHead title={<>Za slovy stojí <b>čísla i lidé.</b></>} />
          <div className="home-award">
            <span className="aw-ic"><IconLicense size={24} stroke={1.7} /></span>
            <div><b>Pojišťovací makléř roku</b><small>Opakované ocenění odbornou porotou</small></div>
          </div>
          <div className="home-stats">
            {STATS.map((s) => (
              <div className="home-stat" key={s.n}><div className="n">{s.n}</div><div className="c">{s.c}</div></div>
            ))}
          </div>
          <div className="refs home-refs">
            {REFS.map((r) => (
              <div className="ref" key={r.who}>
                <p>„{r.q}&ldquo;</p>
                <div className="who">
                  <span className="av">{r.av}</span>
                  <span><b>{r.who}</b><small>{r.role}</small></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ DOSTUPNOST ============ */}
        <section className="sec wrap">
          <div className="home-avail">
            <div className="home-avail-tx">
              <h2>Vždy nablízku.</h2>
              <p>Pobočky po celé republice a poradci, kteří dorazí i za vámi. Když to nejvíc potřebujete, máte u sebe konkrétního člověka – ne infolinku.</p>
              <Link to="/pobocky" className="btn white-on-dark"><IconMapPin size={18} stroke={2} /> Najít nejbližší pobočku <IconArrowRight size={18} stroke={2.2} /></Link>
            </div>
            <div className="home-avail-nums">
              <div><div className="n">60+</div><div className="c">poboček v ČR</div></div>
              <div><div className="n">24/7</div><div className="c">asistence a hlášení škod</div></div>
            </div>
          </div>
        </section>

        {/* ============ KONTAKT ============ */}
        <ContactBand />
      </main>
      <SiteFooter />
    </div>
  )
}
