import { useState, useEffect, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import './profile.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import { ProfileCards } from '../components/ProfileParts.jsx'
import { PROFILES, countGen } from '../data/profiles.js'
import { NEED_INTENTS, NEED_CLAIM } from '../data/needfinder.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { ReferenceCarousel } from '../components/References.jsx'
import { REFERENCES_HOME } from '../data/references.js'
import { SecHead } from '../components/PageParts.jsx'
import {
  IconCar, IconHome, IconShield, IconWorld, IconBox, IconScale, IconHeart, IconFish,
  IconChartLine, IconCoin, IconBuildingBank, IconBuildingSkyscraper, IconBolt, IconKey, IconAlertTriangle, IconFileText, IconPhone,
  IconArrowRight, IconArrowLeft, IconChevronDown,
  IconTruck, IconPigMoney, IconCreditCard, IconDeviceMobile, IconGavel, IconMessageCircle,
  IconHomeDollar, IconHomeSearch, IconHomeCheck,
  IconLicense, IconShieldCheck,
  IconPlayerPlayFilled, IconPlayerPauseFilled, IconVolume, IconVolumeOff,
  IconMaximize, IconMinimize,
} from '@tabler/icons-react'

// Ikony rozcestníka: kľúč z data/needfinder.js -> tabler komponent (dáta zostávajú bez Reactu).
const RZ_ICONS = {
  car: IconCar, house: IconHome, box: IconBox, shield: IconShield, shieldCheck: IconShieldCheck,
  scale: IconScale, heart: IconHeart, globe: IconWorld, fish: IconFish, bank: IconBuildingBank,
  coin: IconCoin, piggy: IconPigMoney, card: IconCreditCard, truck: IconTruck, chart: IconChartLine,
  building: IconBuildingSkyscraper, key: IconKey, gavel: IconGavel, bolt: IconBolt,
  mobile: IconDeviceMobile, houseSell: IconHomeDollar, houseSearch: IconHomeSearch,
  houseCheck: IconHomeCheck, chat: IconMessageCircle,
}
// Produktové stránky zatiaľ neexistujú – bez vlastnej routy ide položka na kontakt s témou.
const temaHref = (label) => `/kontakt?tema=${encodeURIComponent(label)}`
const productHref = (p) => p.to || temaHref(p.label)
// väzba „vybrat z…" žiada genitív, tam je tvar rovnaký pre všetky počty
const productPickLabel = (n) => `Vybrat z ${n} produktů`
const FAQ = [
  ['Kolik mě poradenství stojí?', 'Nic. Poradce vám sjedná pojištění i finance zdarma – naši práci platí pojišťovny a partneři, ne vy. Vy platíte jen samotnou smlouvu, kterou si vyberete.'],
  ['Jsem vázaný na jednu pojišťovnu?', 'Ne. Spolupracujeme s desítkami pojišťoven a partnerů, takže porovnáme nabídky napříč trhem a vybereme tu, která vám sedne nejlépe – cenou i krytím.'],
  ['Jak probíhá řešení škody?', 'Škodu likvidujeme interně, vlastním týmem. Stačí jeden kontakt – nepřehazujeme vás mezi pojišťovnami a celý proces hlídáme za vás, rychleji a férově.'],
  ['Můžu mít poradce nablízku?', 'Ano. Máme širokou síť poboček po celé ČR, takže vždy najdete poradce ve svém okolí. Schůzku zvládneme osobně i online – jak vám to vyhovuje.'],
  ['Co když už pojištění mám?', 'Rádi vám ho zdarma zrevidujeme. Projdeme stávající smlouvy, ukážeme, kde platíte zbytečně moc nebo kde máte díry v krytí, a navrhneme řešení – bez závazku.'],
]
const PHIL = 'Neprodáváme produkty. Jsme partner, který poradí, postará se a stojí při vás v každé životní situaci.'

// Video na pozadí hera. Má to byť tichá značková slučka bez titulkov a bez
// tvárí — inak text v hero konkuruje deju vo videu.
// hero.mp4 = webový export z 16x9_Allrisk_smycka.mp4 (koreň workspace, 332 MB):
//   1920×1080, H.264 high, CRF 25 / max 3,2 Mb/s, +faststart → ~20 MB.
//   Predchádzajúci export mal 1280×720 pri 444 kb/s a na celej obrazovke sa rozpadal.
// TODO(asset): obsahovo je to stále provizórium — má hovorené slovo aj titulky.
const HERO_VIDEO = '/hero.mp4'

// Banner „revize smluv" – nahrádza zrušený test pojištění.
// Nadpis je len háčik („Věděli jste, že…?"), celé tvrdenie aj vysvetlenie ide do textu,
// pod tým tlačidlo. Vpravo značková linka (rovnaká ako v hero) – zámerne
// väčšia než banner, presah oreže overflow:hidden na .banner.
// TODO(obchod): doplniť reálnu priemernú úsporu z dát Allrisku (zatiaľ placeholder).
const AVG_SAVING = 'XY 000'
const REVIEW_TEXT = 'Projdeme je s vámi a ukážeme, kde platíte zbytečně a kde chybí krytí. Zdarma a bez závazku.'
// Use case k revízii zatiaľ nemá vlastnú stránku – dočasne mieri na kontakt s predvyplnenou témou.
const REVIEW_CASE = '/kontakt?tema=Revize smluv'
// ilustrácie poskladané z „komponent" (chips) – fallback, keď blok nemá vlastnú ilustráciu.
// Musí stáť nad WHY — volá ho už pri vyhodnotení modulu.
const chip = (icon, label, pos, lg) => ({ icon, label, pos, lg })
const ACCENT = new Set(['partner,', 'poradí,', 'postará', 'stojí', 'vás'])

// „Proč Allrisk" – varianta v štýle feature sekcií (text + ilustrácia, striedavo)
const WHY = [
  {
    ey: 'Vše pod jednou střechou', t: <>Unikátní <b>ekosystém služeb</b></>,
    p: 'Pojištění, reality, finance i energie pod jednou střechou – propojené tak, ať spolu dávají smysl a nikde nevznikají díry.',
    cta: 'Prozkoumat ekosystém', alt: false,
    img: '/illus/tabler/ecosystem.png',
    chips: [
      chip(<IconWorld size={24} stroke={1.6} />, 'Pod jednou střechou', { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }, true),
      chip(<IconShield size={18} stroke={1.7} />, 'Pojištění', { left: '6%', top: '16%' }),
      chip(<IconBuildingSkyscraper size={18} stroke={1.7} />, 'Reality', { right: '6%', top: '20%' }),
      chip(<IconChartLine size={18} stroke={1.7} />, 'Finance', { left: '10%', bottom: '16%' }),
      chip(<IconBolt size={18} stroke={1.7} />, 'Energie', { right: '8%', bottom: '14%' }),
    ],
  },
  {
    ey: 'Vlastní produkty', t: <>Inkasní pojištění, které <b>jinde nedostanete</b></>,
    p: 'Vyvíjíme vlastní pojistné produkty – řešení šitá na míru situacím, na které běžné pojišťovny nemyslí.',
    cta: 'Naše produkty', alt: true,
    img: '/illus/tabler/products.png',
    chips: [
      chip(<IconLicense size={24} stroke={1.6} />, 'Vlastní produkt', { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }, true),
      chip(<IconFileText size={18} stroke={1.7} />, 'Na míru', { left: '8%', top: '18%' }),
      chip(<IconShieldCheck size={18} stroke={1.7} />, 'Kryje víc', { right: '7%', top: '24%' }),
      chip(<IconCoin size={18} stroke={1.7} />, 'Férová cena', { left: '14%', bottom: '15%' }),
    ],
  },
  {
    ey: 'Vlastní likvidace', t: <>Škodu <b>vyřešíme za vás</b></>,
    p: 'Žádné přehazování mezi pojišťovnami. Škodu likvidujeme interně – jeden kontakt, rychleji a férově.',
    cta: 'Jak to funguje', alt: false,
    img: '/illus/tabler/claims.png',
    chips: [
      chip(<IconShieldCheck size={24} stroke={1.6} />, 'Likvidace', { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }, true),
      chip(<IconAlertTriangle size={18} stroke={1.7} />, 'Nahlášeno', { left: '6%', top: '14%' }),
      chip(<IconPhone size={18} stroke={1.7} />, 'Jeden kontakt', { right: '6%', top: '22%' }),
      chip(<IconCar size={18} stroke={1.7} />, 'Vyřešeno', { left: '12%', bottom: '14%' }),
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

// Dlaždica rozcestníka – vždy prepínač druhej úrovne, preto nesie aj náznak,
// že sa pod ňou niečo otvorí („Vybrat z N produktů").
function NeedTile({ n, open, onToggle }) {
  const C = RZ_ICONS[n.icon] || IconShield
  const inner = (
    <>
      {/* tá istá ikona ešte raz ako veľký vodoznak vpravo – tretinou vyčnieva von z dlaždice */}
      <span className="rz-bg" aria-hidden="true"><C size={200} stroke={1.1} /></span>
      <span className="ni"><C size={28} stroke={1.6} /></span>
      <b>{n.t}</b>
      <small>{n.d}</small>
    </>
  )
  return (
    <button
      type="button"
      className={`rz-tile rz-tile-btn${open ? ' on' : ''}`}
      aria-expanded={open}
      aria-controls={`rz-open-${n.key}`}
      onClick={onToggle}
    >
      {inner}
      <span className="rz-more">
        {productPickLabel(n.products.length)}
        <IconChevronDown className="cv" size={16} stroke={2.2} aria-hidden="true" />
      </span>
    </button>
  )
}

// Produktová karta – jediný obsah druhej úrovne. Žiadne popisy navyše, len ponuka.
// Šípku v rohu nemá: celá karta je odkaz a v rohu robila len šum.
function ProductCard({ pr }) {
  const C = RZ_ICONS[pr.icon] || IconShield
  return (
    <Link to={productHref(pr)} className="rz-p">
      <span className="pi"><C size={26} stroke={1.6} /></span>
      <span className="tx"><b>{pr.label}</b><small>{pr.desc}</small></span>
    </Link>
  )
}

// Nadpis kroku má modrý akcent ako každá iná hlavička sekcie. Ktorá časť sa zvýrazní,
// určujú dáta (`accent`) – česky sa to nedá odvodiť pravidlom („Chci se pojistit“ vs „Chci úvěr“).
function needTitle(n) {
  const i = n.accent ? n.t.lastIndexOf(n.accent) : -1
  if (i === -1) return n.t
  return <>{n.t.slice(0, i)}<b>{n.accent}</b>{n.t.slice(i + n.accent.length)}</>
}

// Rozcestník ako celok, v dvoch krokoch: mriežka potrieb ustúpi a druhý krok je
// samostatná obrazovka — šípka späť, názov potreby, produktové karty.
// (Varianta „roztažená karta", ktorá produkty otvárala vnútri dlaždice, je zrušená.)
function NeedFinder() {
  const [openKey, setOpenKey] = useState(null)
  const open = NEED_INTENTS.find((n) => n.key === openKey) || null

  // Druhý krok prepíše nadpis aj vetu celej sekcie, takže ju človek musí mať pred
  // očami – inak by po kliknutí na dlaždicu dolu v mriežke zmenu vôbec nevidel.
  // (Scroll-margin rieši sticky header.)
  const toggle = (key) => {
    setOpenKey((k) => (k === key ? null : key))
    document.getElementById('rozcestnik')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // V druhom kroku prevezme hlavičku sekcie zvolená potreba – nadpis aj veta pod ním.
  // Druhý nadpis vnútri kroku tak odpadá a človek má na obrazovke len jednu vec naraz.
  const step = open
  const head = (
    <SecHead
      key={step ? open.key : 'root'}
      /* v kroku 2 stojí tlačidlo späť na mieste eyebrowu – jeden stĺpec, žiadna šípka zboku.
         Eyebrow tam nechýba: názov sekcie už nesie cesta, po ktorej sa človek prekliká. */
      ey={step ? (
        <button type="button" className="btn rz-back" onClick={() => toggle(openKey)}>
          <IconArrowLeft size={18} stroke={2.2} aria-hidden="true" />
          Zpět na výběr
        </button>
      ) : 'Potřebový rozcestník'}
      title={step ? needTitle(open) : <>Co právě <b>řešíte?</b></>}
      lead={step ? open.d : 'Řekněte to svými slovy, ne názvem produktu. Ozve se vám poradce, který danou situaci zná – a zůstane u ní až do konce.'}
    />
  )

  // druhý krok: hlavičku už nesie sekcia, tu ostávajú len produktové karty
  if (step) {
    return (
      <>
        {head}
        <div className="rz-plist rz-fade">
          {open.products.map((pr) => <ProductCard key={pr.label} pr={pr} />)}
        </div>
      </>
    )
  }

  return (
    <>
      {head}
      <div className="rz-grid">
      {NEED_INTENTS.map((n) => (
        <NeedTile
          key={n.key}
          n={n}
          open={openKey === n.key}
          onToggle={() => toggle(n.key)}
        />
      ))}
      </div>

      {/* Škoda nie je nákup – vlastný pás a jediné miesto, kde na tejto sekcii žije AllRed.
          V druhom kroku odpadá: tam už ide o výber produktu, nie o rozhodovanie, čo vlastne riešim. */}
      <Link to={NEED_CLAIM.to} className="rz-claim">
        <span className="ni"><IconAlertTriangle size={28} stroke={1.8} /></span>
        <span className="tx"><b>{NEED_CLAIM.t}</b><small>{NEED_CLAIM.d}</small></span>
        <span className="rz-claim-go">Nahlásit teď <IconArrowRight size={18} stroke={2.2} aria-hidden="true" /></span>
      </Link>
    </>
  )
}

export default function Wireframe() {
  const [faqOpen, setFaqOpen] = useState(0)

  /* ---- video v hero ----
     Video kryje celú sekciu a beží samo a potichu — je to kulisa, nie obsah.
     Preto je aj bez tlačidla „přehrát": ovládanie je len pauza a zvuk pre
     toho, koho pohyb ruší. */
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  // Video beží aj pod hlavičkou (na každej šírke), takže header nesmie mať vlastnú
  // plochu — hook ho sprehľadní a plné pozadie mu vráti až scroll.
  useHeroHeader()
  const [videoPlaying, setVideoPlaying] = useState(true)
  const [videoMuted, setVideoMuted] = useState(true)
  const [videoFs, setVideoFs] = useState(false)
  // Hlasitosť je posuvník, nie len prepínač – kulisa má znieť potichu, nie naplno.
  // Autoplay ale beží stlmene (inak ho prehliadač nespustí), takže je to hodnota
  // „ako nahlas to bude, keď to odtlmíš".
  const [videoVol, setVideoVol] = useState(0.5)
  const videoBoxRef = useRef(null)
  const playVideo = () => {
    setVideoPlaying(true)
    videoRef.current?.play().catch(() => {})
  }
  const pauseVideo = () => {
    setVideoPlaying(false)
    videoRef.current?.pause()
  }
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    // odtlmiť na nulovej hlasitosti je ticho, ktoré vyzerá ako porucha – vrátime slušnú hodnotu
    if (v.muted && videoVol === 0) { v.volume = 0.5; setVideoVol(0.5) }
    v.muted = !v.muted
    setVideoMuted(v.muted)
  }
  // Ťahanie posuvníka je zároveň žiadosť o zvuk; nula naopak stlmí.
  const changeVol = (e) => {
    const val = Number(e.target.value)
    const v = videoRef.current
    setVideoVol(val)
    if (!v) return
    v.volume = val
    v.muted = val === 0
    setVideoMuted(v.muted)
  }
  // Pomer stránke nediktujeme natvrdo – berieme ho z videa samotného, nech sedí
  // aj keď klient nahrá iný export než 16:9.
  const readVideoRatio = () => {
    const v = videoRef.current
    const hero = heroRef.current
    // hlasitosť z posuvníka platí od prvej snímky (video beží stlmene, kým ju človek nepustí)
    if (v) v.volume = videoVol
    if (!hero || !v?.videoWidth || !v.videoHeight) return
    // Pomer bezrozmerne (calc() so zápisom `16 / 9` ako aspect-ratio pracovať nevie).
    // Na sekciu, nie na samotný pás – vlastné vlastnosti sa dedia nadol.
    hero.style.setProperty('--vid-arn', String(v.videoWidth / v.videoHeight))
  }
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
      return
    }
    const box = videoBoxRef.current
    const v = videoRef.current
    // Otočiť displej sa dá vyžiadať len vo fullscreene a len tam, kde to prehliadač
    // vie (Android). Na iOS si telefón otočí človek sám, preto chybu ticho ignorujeme.
    const lockLandscape = () => { screen.orientation?.lock?.('landscape').catch(() => {}) }
    if (box?.requestFullscreen) box.requestFullscreen().then(lockLandscape, () => {})
    // iOS Safari nevie fullscreen na ľubovoľnom elemente – tam ide do fullscreenu
    // samotné video cez natívny prehrávač (a ten si otočenie rieši sám).
    else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen()
  }
  useEffect(() => {
    const onFsChange = () => {
      const on = document.fullscreenElement === videoBoxRef.current
      setVideoFs(on)
      if (!on) screen.orientation?.unlock?.()
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

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
    <div className="site">
      {/* ============ HERO ============ */}
      <section className="hero wf-hero" ref={heroRef}>
        <div className="hero-bgvid" ref={videoBoxRef}>
          <video ref={videoRef} className="hero-video-el" muted loop playsInline autoPlay
                 onLoadedMetadata={readVideoRatio}>
            <source src={asset(HERO_VIDEO)} type="video/mp4" />
          </video>
          <div className="hero-video-ctrls">
            <button onClick={videoPlaying ? pauseVideo : playVideo} aria-label={videoPlaying ? 'Pozastavit video' : 'Přehrát video'}>
              {videoPlaying ? <IconPlayerPauseFilled size={17} /> : <IconPlayerPlayFilled size={17} />}
            </button>
            {/* zvuk = prepínač + rozsah; posuvník sa rozbalí pri prejdení myšou,
                aby rad tlačidiel na telefóne nezaberal pol šírky videa */}
            <div className="hero-vol">
              <button onClick={toggleMute} aria-label={videoMuted ? 'Zapnout zvuk' : 'Ztlumit'}>
                {videoMuted ? <IconVolumeOff size={18} /> : <IconVolume size={18} />}
              </button>
              <input
                type="range" className="hero-vol-range" min="0" max="1" step="0.05"
                value={videoVol} onChange={changeVol} aria-label="Hlasitost videa"
                style={{ '--vol': `${videoVol * 100}%` }}
              />
            </div>
            {/* na telefóne je hero len pás v pomere videa – celá obrazovka je tu, po otočení na šírku */}
            <button onClick={toggleFullscreen} aria-label={videoFs ? 'Ukončit celou obrazovku' : 'Přehrát přes celou obrazovku'}>
              {videoFs ? <IconMinimize size={18} /> : <IconMaximize size={18} />}
            </button>
          </div>
        </div>
      </section>

      {/* Za videom nič nenasleduje – stránka ide rovno do rozcestníka. */}

      {/* ============ ROZCESTNÍK ============ */}
      <section id="rozcestnik" className="sec wrap">
        {/* hlavička sekcie žije vnútri rozcestníka – v druhom kroku ju prepíše
            zvolená potreba, takže veta hore hovorí o tom, čo je práve na obrazovke */}
        <NeedFinder />
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

      {/* ============ PROČ ALLRISK ============ */}
      <section className="sec wrap">
        <div className="why-feats">
          {WHY.map((f) => (
            <div className={`feature ${f.alt ? 'alt' : ''}`} key={f.ey}>
              <div className="feature-tx">
                <span className="ey">{f.ey}</span>
                <h2>{f.t}</h2>
                <p>{f.p}</p>
                <span className="btn fill" style={{ background: 'var(--blue)', borderColor: 'var(--blue)', color: '#fff' }}>{f.cta} <IconArrowRight size={18} stroke={2.2} /></span>
              </div>
              <div className="illus">{f.img ? <img className="illus-img" src={asset(f.img)} alt="" aria-hidden /> : <Illus chips={f.chips} />}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ REVIZE SMLUV – banner ============ */}
      <section className="sec wrap">
        <div className="banner">
          <img className="banner-line" src={asset('/brand/line-hero-1.png')} alt="" aria-hidden width="720" height="673" decoding="async" loading="lazy" />
          <div className="banner-tx">
            <h2>Věděli jste, že…?</h2>
            <p>Pravidelnou revizí smluv ušetříte <b>v průměru {AVG_SAVING} Kč ročně.</b> {REVIEW_TEXT}</p>
            <Link to={REVIEW_CASE} className="btn">Jak revize probíhá <IconArrowRight size={18} stroke={2.2} /></Link>
          </div>
        </div>
      </section>


      {/* ============ KLIENTSKÉ PROFILY ============ */}
      {/* Dlaždica už nie je tab s panelom – každý profil má vlastnú stránku /profil/:slug. */}
      <section className="sec wrap">
        <SecHead
          ey="Klientské profily"
          title={<>Najděte se v <b>jednom ze {countGen(PROFILES.length)} profilů</b></>}
          lead="Vyberte typ klienta, který je vám nejblíž. Ukážeme, co je v jeho situaci dobré mít vyřešeno a co se stane, když to chybí."
        />
        <ProfileCards profiles={PROFILES} />
      </section>

      {/* ============ REFERENCE ============ */}
      {/* posuvný rad – šípky na desktope, swipe na mobile; celý zoznam žije na /reference */}
      <section className="sec wrap">
        <ReferenceCarousel items={REFERENCES_HOME} />
      </section>

      {/* ============ FAQ ============ */}
      {/* otázky sú číslované (Inter, nie Magistral) – ikona pri každej otázke pôsobila rušivo */}
      <section className="sec wrap">
        <SecHead ey="Časté dotazy" title={<>Co lidé <b>nejčastěji řeší</b></>} />
        <div className="faq faq-list">
          {FAQ.map(([q, a], i) => {
            const open = faqOpen === i
            return (
              <div className={`acc-item ${open ? 'open' : ''}`} key={q}>
                <button className="acc-q" onClick={() => setFaqOpen(open ? -1 : i)} aria-expanded={open}>
                  <span className="acc-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="acc-q-tx">{q}</span>
                  <span className="acc-ch"><IconChevronDown size={18} stroke={2.2} /></span>
                </button>
                <div className="acc-a"><p>{a}</p></div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ============ KONTAKT (spoločný banner) ============ */}
      <ContactBand />

      {/* ============ FOOTER (spoločný) ============ */}
      <SiteFooter />
    </div>
  )
}
