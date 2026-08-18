/* ============================================================
   Úvodná stránka. Od 2026-08-11 je celá riadená PUBLIKOM (src/segment.js) -
   pás záložiek v hlavičke nemení len menu, ale všetko pod ním.

   Čo publikum mení:
     rozcestník  - rodiny a obce dostanú „Co právě řešíte?", podnikatelia
                   namiesto neho „Proč si vybrat Allrisk" (systém péče)
     filozofia   - jedna veta na publikum
     Proč Allrisk- tri bloky pre rodiny a obce; podnikatelia majú na tom
                   mieste celý systém péče zo zrušenej stránky /podnikatele
     banner      - revize smluv / pojistného programu
     profily     - archetypy daného publika; obce ich nemajú vôbec
     FAQ         - iné otázky, nie tie isté inými slovami

   Čo publikum NEMENÍ (rozhodnutie usera, 2026-08-11): hero video, reference,
   blog a kontaktný formulár. Video je značková slučka, nie argument; ostatné
   tri sú dôkaz a obsah o firme ako celku.

   Obsah samotný žije v data/home.js a data/care.js - tu je len poskladanie.
   ============================================================ */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import './profile.css'
import './business.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import { ProfileCards } from '../components/ProfileParts.jsx'
import { profilesFor, countGen } from '../data/profiles.js'
import { intentsFor, NEED_CLAIM } from '../data/needfinder.js'
import { segmentBy } from '../data/menu.js'
import { useSegment } from '../segment.js'
import { PHIL, WHY, BANNER, PROFILES_HEAD, FAQ, homeFor } from '../data/home.js'
import { BizPrinciples, BizCare } from '../components/BizCare.jsx'
import { DebugPanel, DebugGroup, useDebugOption } from '../components/DebugPanel.jsx'
import { WHY_VARIANTS, WHY_VARIANT_DEFAULT, whyVariant } from '../bizVariants.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Illus from '../components/Illus.jsx'
import { ReferenceCarousel } from '../components/References.jsx'
import { REFERENCES_HOME } from '../data/references.js'
import { BlogSection } from '../components/ArticleParts.jsx'
import { ARTICLES } from '../data/blog.js'
import { SecHead } from '../components/PageParts.jsx'
import { Decor } from '../components/Decor.jsx'
import { Line } from '../components/Line.jsx'
import {
  IconCar, IconHome, IconShield, IconWorld, IconBox, IconScale, IconHeart, IconFish,
  IconChartLine, IconCoin, IconBuildingBank, IconBuildingSkyscraper, IconBolt, IconKey, IconAlertTriangle,
  IconArrowUpRight, IconArrowLeft, IconChevronDown,
  IconTruck, IconPigMoney, IconCreditCard, IconDeviceMobile, IconGavel, IconChecklist,
  IconHomeDollar, IconHomeSearch, IconHomeCheck,
  IconLicense, IconShieldCheck,
  IconPlayerPlayFilled, IconPlayerPauseFilled, IconVolume, IconVolumeOff,
  IconMaximize, IconMinimize, IconLayoutGrid,
} from '@tabler/icons-react'

// Ikony rozcestníka a ilustračné fallbacky: kľúč z dát -> tabler komponent
// (dáta zostávajú bez Reactu). Jedna mapa pre obe miesta - sú to tie isté kľúče.
const RZ_ICONS = {
  car: IconCar, house: IconHome, box: IconBox, shield: IconShield, shieldCheck: IconShieldCheck,
  scale: IconScale, heart: IconHeart, globe: IconWorld, fish: IconFish, bank: IconBuildingBank,
  coin: IconCoin, piggy: IconPigMoney, card: IconCreditCard, truck: IconTruck, chart: IconChartLine,
  building: IconBuildingSkyscraper, key: IconKey, gavel: IconGavel, bolt: IconBolt,
  mobile: IconDeviceMobile, houseSell: IconHomeDollar, houseSearch: IconHomeSearch,
  houseCheck: IconHomeCheck, license: IconLicense, checklist: IconChecklist,
}
// Produktové stránky zatiaľ neexistujú - bez vlastnej routy ide položka na kontakt s témou.
const temaHref = (label) => `/kontakt?tema=${encodeURIComponent(label)}`
const productHref = (p) => p.to || temaHref(p.label)
// väzba „vybrat z…" žiada genitív, tam je tvar rovnaký pre všetky počty
const productPickLabel = (n) => `Vybrat z ${n} produktů`

// Video na pozadí hera. Má to byť tichá značková slučka bez titulkov a bez
// tvárí - inak text v hero konkuruje deju vo videu. Je zámerne rovnaké pre
// všetky tri publiká: je to značka, nie argument pre konkrétne publikum.
// hero.mp4 = webový export z 16x9_Allrisk_smycka.mp4 (koreň workspace, 332 MB):
//   1920×1080, H.264 high, CRF 25 / max 3,2 Mb/s, +faststart → ~20 MB.
// TODO(asset): obsahovo je to stále provizórium - má hovorené slovo aj titulky.
const HERO_VIDEO = '/hero.mp4'

// Modrý akcent v nadpise. Ktorá časť sa zvýrazní, určujú dáta (`accent`) -
// česky sa to nedá odvodiť pravidlom („Chci se pojistit" vs „Chci úvěr").
// Rovnaký mechanizmus pre rozcestník aj pre „Proč Allrisk".
function accentTitle(text, accent) {
  const i = accent ? text.lastIndexOf(accent) : -1
  if (i === -1) return text
  return <>{text.slice(0, i)}<b>{accent}</b>{text.slice(i + accent.length)}</>
}

// Dlaždica rozcestníka - vždy prepínač druhej úrovne, preto nesie aj náznak,
// že sa pod ňou niečo otvorí („Vybrat z N produktů").
function NeedTile({ n, open, onToggle }) {
  const C = RZ_ICONS[n.icon] || IconShield
  return (
    <button
      type="button"
      className={`rz-tile rz-tile-btn${open ? ' on' : ''}`}
      aria-expanded={open}
      aria-controls={`rz-open-${n.key}`}
      onClick={onToggle}
    >
      {/* tá istá ikona ešte raz ako veľký vodoznak vpravo - tretinou vyčnieva von z dlaždice */}
      <span className="rz-bg" aria-hidden="true"><C size={200} stroke={1.1} /></span>
      <span className="ni"><C size={28} stroke={1.6} /></span>
      <b>{n.t}</b>
      <small>{n.d}</small>
      <span className="rz-more">
        {productPickLabel(n.products.length)}
        <IconChevronDown className="cv" size={16} stroke={2.2} aria-hidden="true" />
      </span>
    </button>
  )
}

// Produktová karta - jediný obsah druhej úrovne. Žiadne popisy navyše, len ponuka.
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

// Rozcestník ako celok: mriežka dlaždíc a druhý krok s produktmi.
// PODOBA JE JEDNA (user, 2026-08-18: „daj preč tie varianty okrem dlaždíc").
// Skúšané a zmazané: `seznam` (riadok s ikonou a šípkou), `panel` (lišta zámerov
// vľavo, karta s produktmi vpravo), `index` (číslovaný rejstřík s ponukou pod
// riadkom) a `veta` (šesť slovies ako jedna veta). Prepínač zanikol s nimi -
// voľba s jednou hodnotou nie je voľba.
function NeedFinder({ intents, eyebrow }) {
  const [openKey, setOpenKey] = useState(null)
  const open = intents.find((n) => n.key === openKey) || null

  // Druhý krok prepíše nadpis aj vetu celej sekcie, takže ju človek musí mať pred
  // očami - inak by po kliknutí na dlaždicu dolu v mriežke zmenu vôbec nevidel.
  // (Scroll-margin rieši sticky header.)
  const toggle = (key) => {
    setOpenKey((k) => (k === key ? null : key))
    document.getElementById('rozcestnik')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // V druhom kroku prevezme hlavičku sekcie zvolená potreba - nadpis aj veta pod ním.
  // Druhý nadpis vnútri kroku tak odpadá a človek má na obrazovke len jednu vec naraz.
  const step = open
  const head = (
    <SecHead
      key={step ? open.key : 'root'}
      /* v kroku 2 stojí tlačidlo späť na mieste eyebrowu - jeden stĺpec, žiadna šípka zboku.
         Eyebrow tam nechýba: názov sekcie už nesie cesta, po ktorej sa človek prekliká. */
      ey={step ? (
        <button type="button" className="btn rz-back" onClick={() => toggle(openKey)}>
          <IconArrowLeft size={18} stroke={2.2} aria-hidden="true" />
          Zpět na výběr
        </button>
      ) : eyebrow}
      title={step ? accentTitle(open.t, open.accent) : <>Co právě <b>řešíte?</b></>}
      lead={step ? open.d : 'Řekněte to svými slovy, ne názvem produktu. Ozve se vám poradce, který danou situaci zná - a zůstane u ní až do konce.'}
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
        {intents.map((n) => (
          <NeedTile
            key={n.key}
            n={n}
            open={openKey === n.key}
            onToggle={() => toggle(n.key)}
          />
        ))}
      </div>

      {/* Škoda nie je nákup - vlastný pás a jediné miesto, kde na tejto sekcii žije AllRed.
          V druhom kroku odpadá: tam už ide o výber produktu, nie o rozhodovanie, čo vlastne riešim. */}
      <Link to={NEED_CLAIM.to} className="rz-claim">
        <span className="ni"><IconAlertTriangle size={28} stroke={1.8} /></span>
        <span className="tx"><b>{NEED_CLAIM.t}</b><small>{NEED_CLAIM.d}</small></span>
        <span className="rz-claim-go">Nahlásit teď <IconArrowUpRight size={18} stroke={2.2} aria-hidden="true" /></span>
      </Link>
    </>
  )
}

// Časté dotazy. Vlastný komponent kvôli stavu: pri prepnutí publika je otvorená
// otázka iná otázka, takže sa musí zavrieť. Rieši to `key={seg}` na tomto
// komponente - React ho odmontuje aj so stavom. Efekt, ktorý index resetuje,
// by robil to isté o jeden render neskôr (a react-hooks to právom hlási).
function FaqList({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq faq-list">
      {items.map(([q, a], i) => {
        const on = open === i
        return (
          <div className={`acc-item ${on ? 'open' : ''}`} key={q}>
            <button className="acc-q" onClick={() => setOpen(on ? -1 : i)} aria-expanded={on}>
              <span className="acc-n">{i + 1}</span>
              <span className="acc-q-tx">{q}</span>
              <span className="acc-ch"><IconChevronDown size={18} stroke={2.2} /></span>
            </button>
            <div className="acc-a"><p>{a}</p></div>
          </div>
        )
      })}
    </div>
  )
}

export default function Wireframe() {
  // Publikum. Prepínač je v hlavičke na každej stránke, takže úvod naň môže
  // reagovať bez podmienok - do 2026-08-11 to platilo len vo verzii lišty
  // „kontext", lebo inde nebolo čím prepnúť späť.
  const [seg] = useSegment()
  const segObj = segmentBy(seg)
  const intents = intentsFor(seg)
  const phil = homeFor(PHIL, seg)
  const why = homeFor(WHY, seg)
  const banner = homeFor(BANNER, seg)
  const faq = homeFor(FAQ, seg)
  const profHead = homeFor(PROFILES_HEAD, seg)
  const profiles = profilesFor(seg)
  // Podoba sekcie „Proč si vybrat Allrisk". Prepínač je v ladiacom paneli a ten
  // je na úvode len pre podnikateľov - ostatné publiká tú sekciu nemajú.
  const [whyRaw, setWhy] = useDebugOption('bizWhy', WHY_VARIANT_DEFAULT)
  const whyStyle = whyVariant(whyRaw)

  /* ---- video v hero ----
     Video kryje celú sekciu a beží samo a potichu - je to kulisa, nie obsah.
     Preto je aj bez tlačidla „přehrát": ovládanie je len pauza a zvuk pre
     toho, koho pohyb ruší. */
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  // Video beží aj pod hlavičkou (na každej šírke), takže header nesmie mať vlastnú
  // plochu - hook ho sprehľadní a plné pozadie mu vráti až scroll.
  useHeroHeader()
  const [videoPlaying, setVideoPlaying] = useState(true)
  const [videoMuted, setVideoMuted] = useState(true)
  const [videoFs, setVideoFs] = useState(false)
  // Hlasitosť je posuvník, nie len prepínač - kulisa má znieť potichu, nie naplno.
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
    // odtlmiť na nulovej hlasitosti je ticho, ktoré vyzerá ako porucha - vrátime slušnú hodnotu
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
  /* ---- ovládanie priamo na ploche videa ----
     Klik = pauza/beh, vodorovný ťah = pretáčanie (doľava späť, doprava vpred).
     Mierka: ťah cez CELÚ šírku prejde celé video, takže sa nemá čo učiť - to,
     ako ďaleko si zašiel, sedí s tým, koľko plochy si prešiel.
     Rad tlačidiel vpravo dole zostáva: je to jediná cesta pre klávesnicu a pre
     toho, kto ťahanie neobjaví. */
  const dragRef = useRef(null)
  const onVideoDown = (e) => {
    const v = videoRef.current
    const box = videoBoxRef.current
    if (!v || !box) return
    dragRef.current = { x: e.clientX, t: v.currentTime, w: box.clientWidth, was: !v.paused, moved: false }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onVideoMove = (e) => {
    const d = dragRef.current
    const v = videoRef.current
    if (!d || !v) return
    const dx = e.clientX - d.x
    // Prah 6px: bez neho by sa z každého klepnutia stalo pretočenie o pár snímok
    // a klik by prestal spoľahlivo pauzovať.
    if (!d.moved && Math.abs(dx) < 6) return
    // Počas pretáčania video stojí - inak sa čas posúva pod rukou aj sám od seba
    // a snímka nesedí s tým, kde človek drží prst.
    if (!d.moved) { d.moved = true; v.pause() }
    const dur = v.duration
    if (!Number.isFinite(dur) || dur <= 0 || !d.w) return
    v.currentTime = Math.min(dur, Math.max(0, d.t + (dx / d.w) * dur))
  }
  const onVideoUp = (e) => {
    const d = dragRef.current
    const v = videoRef.current
    dragRef.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    if (!d || !v) return
    // Po pretáčaní sa prehrávanie vráti do stavu spred ťahu - kto si video
    // predtým zastavil, nechce, aby mu ho pretočenie zase rozbehlo.
    if (d.moved) { if (d.was) playVideo(); return }
    if (v.paused) playVideo(); else pauseVideo()
  }

  // Pomer stránke nediktujeme natvrdo - berieme ho z videa samotného, nech sedí
  // aj keď klient nahrá iný export než 16:9.
  const readVideoRatio = () => {
    const v = videoRef.current
    const hero = heroRef.current
    // hlasitosť z posuvníka platí od prvej snímky (video beží stlmene, kým ju človek nepustí)
    if (v) v.volume = videoVol
    if (!hero || !v?.videoWidth || !v.videoHeight) return
    // Pomer bezrozmerne (calc() so zápisom `16 / 9` ako aspect-ratio pracovať nevie).
    // Na sekciu, nie na samotný pás - vlastné vlastnosti sa dedia nadol.
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
    // iOS Safari nevie fullscreen na ľubovoľnom elemente - tam ide do fullscreenu
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

  // Filozofia sa rozsvecuje po slovách podľa scrollu. Sekcia existuje len pre
  // rodiny, takže `el` môže byť null - efekt sa vtedy ticho neprihlási.
  const philRef = useRef(null)
  useEffect(() => {
    const el = philRef.current
    if (!el) return undefined
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
  }, [phil?.text])

  const philAccent = new Set(phil?.accent)

  return (
    <div className="site">
      {/* ============ HERO ============ */}
      <section className="hero wf-hero" ref={heroRef}>
        <div className="hero-bgvid" ref={videoBoxRef}>
          <video ref={videoRef} className="hero-video-el" muted loop playsInline autoPlay
                 onLoadedMetadata={readVideoRatio}
                 onPointerDown={onVideoDown} onPointerMove={onVideoMove}
                 onPointerUp={onVideoUp} onPointerCancel={onVideoUp}>
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
            {/* na telefóne je hero len pás v pomere videa - celá obrazovka je tu, po otočení na šírku */}
            <button onClick={toggleFullscreen} aria-label={videoFs ? 'Ukončit celou obrazovku' : 'Přehrát přes celou obrazovku'}>
              {videoFs ? <IconMinimize size={18} /> : <IconMaximize size={18} />}
            </button>
          </div>
        </div>
        {/* Videohero nemá ani jednu dekoráciu. Stuha tu bola skúšaná 2026-08-16
            a padla: záber si nesie vlastnú sadzbu („Vítejte ve finanční…") a
            stuha jej ide rovno cez ňu. Kružnice cez pohyblivý záber sú šmuha.
            Prvú stuhu úvodu preto nesie až banner nižšie. */}
      </section>

      {/* Za videom nič nenasleduje - stránka ide rovno do rozcestníka. */}

      {/* ============ ROZCESTNÍK / PROČ ALLRISK PRO FIRMY ============ */}
      {/* Prvá vec po videu odpovedá na „co tu pro mě je". Rodinám a obciam je
          to rozcestník potrieb, podnikateľom systém péče - klient výslovne
          nechcel, aby firmy dostali ako prvé katalóg produktov.
          `key` je publikum zámerne: pri prepnutí sa rozcestník musí vrátiť na
          prvý krok, lebo otvorená potreba v novom publiku neexistuje. */}
      <section id="rozcestnik" className="sec wrap">
        {intents
          ? <NeedFinder key={seg} intents={intents} eyebrow={segObj.pro} />
          : <BizPrinciples variant={whyStyle} />}
      </section>

      {/* ============ FILOZOFIA ============ */}
      {/* Len jednotlivci a rodiny (user, 2026-08-11). Firma ani obec sa
          nerozhodujú podľa vety o životných situáciách. */}
      {phil && (
        <section className="phil">
          <div className="wrap">
            <span className="ey">Naše filozofie</span>
            <p className="phil-text" ref={philRef}>
              {phil.text.split(' ').map((w, i) => (
                <span key={`${w}-${i}`}><span className={`w${philAccent.has(w) ? ' acc' : ''}`}>{w}</span>{' '}</span>
              ))}
            </p>
          </div>
        </section>
      )}

      {/* ============ PROČ ALLRISK ============ */}
      {/* Rodiny a obce: tri bloky text + ilustrácia, striedavo.
          Podnikatelia: celý systém péče zo zrušenej stránky /podnikatele. */}
      {why ? (
        <section className="sec wrap">
          <div className="why-feats">
            {why.map((f, i) => (
              <div className={`feature ${i % 2 ? 'alt' : ''}`} key={f.key}>
                <div className="feature-tx">
                  <span className="ey">{f.ey}</span>
                  <h2>{accentTitle(f.t, f.accent)}</h2>
                  <p>{f.p}</p>
                  <span className="btn fill">{f.cta} <IconArrowUpRight size={18} stroke={2.2} /></span>
                </div>
                <Illus src={f.img} icon={RZ_ICONS[f.ic] || IconShield} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Systém péče je celý blok sekcií, nie jedna - biele pole sa mu
           nepodsúva zvonku, rozhodovalo by sa vždy len o jeho prvej sekcii. */
        <BizCare />
      )}

      {/* ============ REVIZE - banner ============ */}
      {/* Nadpis je len háčik („Věděli jste, že…?"), celé tvrdenie aj vysvetlenie
          ide do textu, pod tým tlačidlo. Vpravo značková linka (rovnaká ako
          v hero) - zámerne väčšia než banner, presah oreže overflow:hidden. */}
      <section className="sec wrap">
        <div className="banner">
          <Decor />
          <Line />
          <div className="banner-tx">
            <h2>{banner.h}</h2>
            <p><b>{banner.claim}</b> {banner.p}</p>
            {/* revízia nemá vlastnú stránku - mieri na kontakt s predvyplnenou témou */}
            <Link to={temaHref(banner.tema)} className="btn">{banner.cta} <IconArrowUpRight size={18} stroke={2.2} /></Link>
          </div>
        </div>
      </section>

      {/* ============ KLIENTSKÉ PROFILY ============ */}
      {/* Dlaždica už nie je tab s panelom - každý profil má vlastnú stránku /profil/:slug.
          Města a obce sekciu nemajú: obec nie je archetyp človeka. */}
      {profHead && profiles.length > 0 && (
        <section className="sec wrap">
          <SecHead
            ey={profHead.ey}
            title={<>{profHead.pre} <b>jednom ze {countGen(profiles.length)} profilů</b></>}
            lead={profHead.lead}
          />
          <ProfileCards profiles={profiles} />
        </section>
      )}

      {/* ============ REFERENCE ============ */}
      {/* posuvný rad - šípky na desktope, swipe na mobile; celý zoznam žije na /reference */}
      <section className="sec wrap">
        <ReferenceCarousel items={REFERENCES_HOME} />
      </section>

      {/* ============ FAQ ============ */}
      {/* otázky sú číslované (Inter, nie Magistral) - ikona pri každej otázke pôsobila rušivo */}
      <section className="sec wrap">
        <SecHead ey="Časté dotazy" title={<>Co se <b>nejčastěji ptáte</b></>} />
        <FaqList key={seg} items={faq} />
      </section>

      {/* ============ BLOG ============ */}
      {/* Tá istá sekcia ako pod produktom aj pod článkom - rovnaké karty, šípky
          i odkaz „Zobrazit vše", líši sa len titulok. Berie štyri najnovšie
          články, takže sa o ňu po pridaní článku netreba starať. */}
      <section className="sec wrap">
        <BlogSection
          items={ARTICLES.slice(0, 4)}
          title={<>Vysvětlujeme, <b>co se vyplatí vědět</b></>}
        />
      </section>

      {/* ============ KONTAKT (spoločný banner) ============ */}
      <ContactBand />

      {/* ============ FOOTER (spoločný) ============ */}
      <SiteFooter />

      {/* Ladiaci panel. „Podklad" majú všetky publiká - sekcie sú tie isté.
          „Proč Allrisk" má len publikum Podnikatelé: mení sekciu, ktorú
          ostatné nemajú. Voľba „Spolupráce" tu od 2026-08-16 nie je - kroky
          majú rozhodnutý tvar. */}
      <DebugPanel>
        {!intents && (
          <DebugGroup
            icon={IconLayoutGrid} label="Proč Allrisk" value={whyStyle} onChange={setWhy} wrap
            options={WHY_VARIANTS}
          />
        )}
      </DebugPanel>
    </div>
  )
}
