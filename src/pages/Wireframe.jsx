import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import { asset } from '../asset.js'
import { DebugPanel, DebugGroup } from '../components/DebugPanel.jsx'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import {
  IconCar, IconHome, IconArmchair, IconShield, IconScale, IconHeartHandshake, IconWorld,
  IconChartLine, IconCoin, IconBuildingBank, IconBuildingSkyscraper, IconTruck, IconBriefcase,
  IconBolt, IconKey, IconAlertTriangle, IconFileText, IconPlant2, IconFish, IconPhone,
  IconArrowRight, IconStarFilled,
  IconLicense, IconShieldCheck, IconMapPin, IconPhoto, IconLayoutNavbar,
  IconPlayerPlayFilled, IconPlayerPauseFilled, IconVolume, IconVolumeOff,
} from '@tabler/icons-react'

const ICONMAP = {
  car: IconCar, house: IconHome, box: IconArmchair, shield: IconShield, scale: IconScale,
  heart: IconHeartHandshake, globe: IconWorld, chart: IconChartLine, coin: IconCoin,
  bank: IconBuildingBank, building: IconBuildingSkyscraper, truck: IconTruck, briefcase: IconBriefcase,
  bolt: IconBolt, key: IconKey, warn: IconAlertTriangle, doc: IconFileText, leaf: IconPlant2,
  fish: IconFish, phone: IconPhone,
}
const NEEDS = [
  ['car', 'Chci pojistit auto', 'Povinné ručení i havárie', '/vozidla'], ['house', 'Chci pojistit bydlení', 'Nemovitost a domácnost', '#'],
  ['chart', 'Řeším investice', 'Portfolio na míru', '#'], ['heart', 'Chci zabezpečit rodinu', 'Život a příjem', '#'],
  ['globe', 'Chystám se cestovat', 'Léčebné výlohy, storno', '#'], ['coin', 'Zajímá mě investování / finance', 'Spoření a penze', '#'],
  ['bolt', 'Chci nabídku výhodných energií', 'Allrisk EFFECTIVE', '#'], ['phone', 'Chci nabídku výhodných tarifů', 'Telekomunikace', '#'],
  ['key', 'Chci si půjčit auto', 'Autopůjčovna', '#'], ['warn', 'Chci nahlásit škodu', 'Vlastní likvidace', '#'],
  ['doc', 'Chci zkontrolovat stávající smlouvy', 'Revize zdarma', '#'],
]
const SMALL = [
  [IconLicense, 'Vlastní produkty inkasního pojištění', 'Řešení, která jinde nedostanete.', '#'],
  [IconShieldCheck, 'Vlastní likvidace škod', 'Škodu vyřešíme interně – rychleji a férově.', '#'],
  [IconMapPin, 'Široká síť poboček', 'Poradce nablízku po celé ČR.', '#'],
]
const NUMS_MAIN = [['230 000+', 'spokojených klientů'], ['1,5 mld. Kč', 'pojistného'], ['300+', 'poradců'], ['18', 'let na trhu']]
const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const PHIL = 'Neprodáváme produkty. Jsme partner, který poradí, postará se a stojí při vás v každé životní situaci.'
const ACCENT = new Set(['partner,', 'poradí,', 'postará', 'stojí', 'vás'])

// ilustrácie poskladané z „komponent" (chips)
const chip = (icon, label, pos, lg) => ({ icon, label, pos, lg })
const FEATURES = [
  {
    ey: 'Vlastní likvidace', t: <>Škodu vyřešíme <b>za vás</b></>,
    p: 'Žádné přehazování mezi pojišťovnami. Škodu likvidujeme interně – jeden kontakt, rychleji a férově.', cta: 'Jak to funguje', alt: false,
    img: '/illus/claims.svg',
    chips: [
      chip(<IconShieldCheck size={24} stroke={1.6} />, 'Likvidace', { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }, true),
      chip(<IconAlertTriangle size={18} stroke={1.7} />, 'Nahlášeno', { left: '6%', top: '14%' }),
      chip(<IconPhone size={18} stroke={1.7} />, 'Jeden kontakt', { right: '6%', top: '22%' }),
      chip(<IconCar size={18} stroke={1.7} />, 'Vyřešeno', { left: '12%', bottom: '14%' }),
    ],
  },
  {
    ey: 'Allrisk EFFECTIVE', t: <>Ušetřete na <b>energiích i tarifech</b></>,
    p: 'Díky objemu vyjednáme lepší ceny energií, leasingu i telekomunikací, než byste dostali sami.', cta: 'Spočítat úsporu', alt: true,
    img: '/illus/savings.svg',
    chips: [
      chip(<IconCoin size={24} stroke={1.6} />, 'Úspora', { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }, true),
      chip(<IconBolt size={18} stroke={1.7} />, 'Energie', { left: '8%', top: '16%' }),
      chip(<IconPhone size={18} stroke={1.7} />, 'Tarify', { right: '8%', top: '22%' }),
      chip(<IconTruck size={18} stroke={1.7} />, 'Leasing', { left: '14%', bottom: '14%' }),
    ],
  },
]

function Illus({ chips, dark }) {
  return (
    <div className={`ill ${dark ? 'dark' : ''}`}>
      {chips.map((c, i) => (
        <div key={i} className={`chip ${c.lg ? 'lg' : ''}`} style={c.pos}>
          <span className="i">{c.icon}</span>{c.label && <span>{c.label}</span>}
        </div>
      ))}
    </div>
  )
}

export default function Wireframe() {
  const [heroStyle, setHeroStyle] = useState('blue')
  const [headerStyle, setHeaderStyle] = useState(() => localStorage.getItem('wfHeader') || 'blue')

  // prepínač headera (svetlá/modrá) – cez triedu na <html>, lebo header žije mimo Wireframe
  useEffect(() => {
    document.documentElement.classList.toggle('header-light', headerStyle === 'light')
    localStorage.setItem('wfHeader', headerStyle)
  }, [headerStyle])

  // video hero – default je gradient + linka + tlačidlo; klik prehrá video cez celý hero, pauza ho zavrie
  const videoRef = useRef(null)
  const [videoActive, setVideoActive] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)
  const openVideo = () => setVideoActive(true)
  const closeVideo = () => setVideoActive(false)
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setVideoMuted(v.muted)
  }
  // prehraj/zastav až po re-renderi (keď je kontajner reálne viditeľný – inak Chrome video hneď pozastaví)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (videoActive) { v.currentTime = 0; v.play().catch(() => {}) }
    else v.pause()
  }, [videoActive])
  // pri prepnutí mimo video varianty zavri prípadne bežiace video
  useEffect(() => {
    if (heroStyle !== 'video') setVideoActive(false)
  }, [heroStyle])

  const philRef = useRef(null)
  useEffect(() => {
    const el = philRef.current
    if (!el) return
    const words = el.querySelectorAll('.w')
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const prog = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.55)))
      const lit = Math.round(prog * words.length)
      words.forEach((w, i) => w.classList.toggle('lit', i < lit))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="wf">
      {/* ============ HERO ============ */}
      <section className={`hero ${heroStyle === 'light' ? 'light' : ''} ${heroStyle === 'video' ? 'video' : ''} ${videoActive ? 'video-on' : ''}`}>
        {heroStyle === 'video' && (
          <div className="hero-video">
            <video ref={videoRef} className="hero-video-el" muted loop playsInline>
              <source src={asset('/hero.mp4')} type="video/mp4" />
            </video>
            <div className="hero-video-ctrls">
              <button onClick={closeVideo} aria-label="Zavřít video"><IconPlayerPauseFilled size={17} /></button>
              <button onClick={toggleMute} aria-label={videoMuted ? 'Zapnout zvuk' : 'Ztlumit'}>
                {videoMuted ? <IconVolumeOff size={18} /> : <IconVolume size={18} />}
              </button>
            </div>
          </div>
        )}
        <div className="wrap hero-in">
          <div className="hero-tx">
            <h1>Pomáháme lidem plnit <b>sny</b>.</h1>
            <p>Vše pod jednou střechou – s poradcem, který vás zná, a škodami, které řešíme sami.</p>
            <div className="hero-stats">
              <div className="hero-stats-grid">
                {NUMS_MAIN.map(([n, c]) => (
                  <div className="hero-stat" key={c}>
                    <div className="n">{n}</div>
                    <div className="c">{c}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-cta">
              <Link to="/test" className="btn fill">S čím potřebuji poradit <IconArrowRight size={18} stroke={2.2} /></Link>
              <Link to="/test" className="btn">Prohlédnout produkty</Link>
            </div>
          </div>
          {heroStyle === 'video' ? (
            <div className="hero-media hero-media-play">
              <button className="hero-play" onClick={openVideo} aria-label="Přehrát video">
                <span className="ic"><IconPlayerPlayFilled size={28} /></span>
                <span className="tx">Přehrát video</span>
              </button>
            </div>
          ) : (
            <div className="hero-media"><span>Video / obrázek</span></div>
          )}
        </div>
      </section>

      {/* ============ ROZCESTNÍK ============ */}
      <section className="sec wrap">
        <div className="sec-h"><span className="ey">Potřebový rozcestník</span><h2>Vstup je <b>situace</b>, ne název produktu.</h2></div>
        <div className="needs">
          {NEEDS.map(([ic, t, c, to]) => {
            const C = ICONMAP[ic] || IconFileText
            return (
              <Link className="need" key={t} to={to}>
                <span className="ni"><C size={26} stroke={1.7} /></span>
                <b>{t}</b><small>{c}</small>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ============ FILOZOFIA ============ */}
      <section className="phil">
        <div className="wrap">
          <span className="ey">Naše filozofie</span>
          <p className="phil-text" ref={philRef}>
            {PHIL.split(' ').map((w, i) => (<span key={i}><span className={`w${ACCENT.has(w) ? ' acc' : ''}`}>{w}</span>{' '}</span>))}
          </p>
        </div>
      </section>

      {/* ============ PROČ ALLRISK – bento ============ */}
      <section className="sec wrap">
        <div className="sec-h"><span className="ey">Proč Allrisk</span><h2>Partner, ne <b>prodejce smluv</b></h2></div>
        <div className="bento">
          <div className="bento-big">
            <div className="bimg"><span><IconPhoto size={26} stroke={1.5} /> Obrázek</span></div>
            <h3>Unikátní ekosystém služeb</h3>
            <p>Pojištění, reality, finance i energie pod jednou střechou – propojené tak, ať spolu dávají smysl a nikde nevznikají díry.</p>
          </div>
          <div className="bento-col">
            {SMALL.map(([C, t, d, to]) => (
              <Link className="mcard" key={t} to={to}>
                <span className="ic"><C size={22} stroke={1.7} /></span>
                <div><h3>{t}</h3><p>{d}</p></div>
                <span className="mcard-go"><IconArrowRight size={18} stroke={2} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURE sekcie ============ */}
      {FEATURES.map((f) => (
        <section className="sec wrap" style={{ paddingTop: 0 }} key={f.ey}>
          <div className={`feature ${f.alt ? 'alt' : ''}`}>
            <div className="feature-tx">
              <span className="ey">{f.ey}</span>
              <h2>{f.t}</h2>
              <p>{f.p}</p>
              <span className="btn fill" style={{ background: 'var(--blue)', borderColor: 'var(--blue)', color: '#fff' }}>{f.cta} <IconArrowRight size={18} stroke={2.2} /></span>
            </div>
            <div className="illus">{f.img ? <img className="illus-img" src={asset(f.img)} alt="" aria-hidden /> : <Illus chips={f.chips} />}</div>
          </div>
        </section>
      ))}

      {/* ============ VALIDATOR BANNER ============ */}
      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="banner">
          <div className="banner-tx">
            <h2>Zjistěte, jak <b>dobře jste pojištěni</b></h2>
            <p>Odpovězte na pár otázek a uvidíte skóre pokrytí i slabá místa – co je a co není kryté.</p>
            <Link to="/test" className="btn">Spustit test <IconArrowRight size={18} stroke={2.2} /></Link>
          </div>
          <div className="banner-side">
            <div className="ring">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="11" />
                <circle cx="75" cy="75" r="64" fill="none" stroke="#5CC8FF" strokeWidth="11" strokeLinecap="round" strokeDasharray={2 * Math.PI * 64} strokeDashoffset={2 * Math.PI * 64 * 0.38} transform="rotate(-90 75 75)" />
              </svg>
              <span className="pc">?%</span>
            </div>
          </div>
        </div>
      </section>


      {/* ============ REFERENCE ============ */}
      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="sec-h"><span className="ey">Reference</span><h2>Co říkají <b>klienti</b></h2></div>
        <div className="refs">
          {[['JN', 'Jan N.', 'klient od 2019'], ['EM', 'Eva M.', 'klientka od 2021'], ['PK', 'Petr K.', 'klient od 2017']].map(([av, nm, role]) => (
            <div className="ref" key={nm}>
              <div className="stars">{[0, 1, 2, 3, 4].map((i) => <IconStarFilled key={i} size={16} />)}</div>
              <p>„{LOREM}“</p>
              <div className="who"><span className="av">{av}</span><div><b>{nm}</b><small>{role}</small></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ KONTAKT (spoločný banner) ============ */}
      <ContactBand />

      {/* ============ FOOTER (spoločný) ============ */}
      <SiteFooter />

      <DebugPanel>
        <DebugGroup
          icon={IconLayoutNavbar} label="Header" value={headerStyle} onChange={setHeaderStyle}
          options={[{ value: 'blue', label: 'Modrá' }, { value: 'light', label: 'Bílá' }]}
        />
        <DebugGroup
          icon={IconPhoto} label="Hero sekce" value={heroStyle} onChange={setHeroStyle}
          options={[{ value: 'blue', label: 'Modrá' }, { value: 'light', label: 'Bílá' }, { value: 'video', label: 'Video' }]}
        />
      </DebugPanel>
    </div>
  )
}
