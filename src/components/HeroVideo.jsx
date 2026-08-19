/* ============================================================
   VIDEO HERO ÚVODU - značková slučka cez celú šírku okna.

   Od 2026-08-18 je video LEN PRE RETAIL (jednotlivci a rodiny, user).
   Podnikatelia a obce dostanú namiesto neho foto-hero s tvrdením a tromi
   sklenenými kartami - viď HERO v data/home.js a poskladanie vo Wireframe.jsx.
   Preto stojí video vo vlastnom komponente a nie v tele úvodu: jeho stav
   (beh, zvuk, hlasitosť, fullscreen, pretáčanie) je päť useState a štyri
   obsluhy, a tie nemajú bežať pre publikum, ktoré video vôbec nevidí.

   Video je kulisa, nie obsah: beží samo a potichu, je bez titulkov a bez
   tvárí - inak text v hero konkuruje deju vo videu. Preto nemá ani tlačidlo
   „přehrát": ovládanie je len pauza a zvuk pre toho, koho pohyb ruší.

   Dekoráciu nemá ani jednu (rozhodnuté 2026-08-16). Stuha tu bola skúšaná
   a padla: záber si nesie vlastnú sadzbu („Vítejte ve finanční…") a stuha jej
   ide rovno cez ňu. Kružnice cez pohyblivý záber sú šmuha. Prvú stuhu úvodu
   preto nesie až banner nižšie.
   VÝNIMKA je podoba `classic` (heroVariants.js): tam je okolo videa fotka pod
   modrým závojom a kresba padne na ňu, nie na záber - dôvod pôvodného
   rozhodnutia teda neplatí. Preto sa vykresľuje podmienene a nie je schovaná
   cez CSS: skrytý <Decor> si berie číslo z losovania a posunul by kresby
   ostatným pásom stránky (viď decorPick.js).
   ============================================================ */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../asset.js'
import { Decor } from './Decor.jsx'
import { Line } from './Line.jsx'
import { HERO_VIDEO_TX } from '../data/home.js'
import { HERO_DEFAULT } from '../heroVariants.js'
import { numbers } from '../data/company.js'
import { REFERENCES, REVIEWS_TOTAL } from '../data/references.js'
import {
  IconPlayerPlayFilled, IconPlayerPauseFilled, IconVolume, IconVolumeOff,
  IconMaximize, IconMinimize, IconArrowUpRight, IconStarFilled,
} from '@tabler/icons-react'

// Čísla do hera si stránka NEVYMÝŠĽA - sú to tie isté hodnoty z brožúry, aké
// nesie /o-nas (NUMBERS v data/company.js). Rodine hovorí niečo iné než firme:
// koľko je klientov, koľko poradcov a ako blízko je najbližšia pobočka.
const HERO_STATS = numbers('klienti', 'poradci', 'pobocky')
// Hodnotenie sa počíta z referencií, nie je napísané - pridaná referencia ho
// posunie sama, rovnako ako na /reference. Počet hodnotení je ale iné číslo než
// počet kartičiek (REVIEWS_TOTAL v data/references.js) - zverejnené citácie sú výber.
const REF_AVG = (REFERENCES.reduce((a, r) => a + r.stars, 0) / REFERENCES.length).toFixed(1).replace('.', ',')

// hero.mp4 = webový export z 16x9_Allrisk_smycka.mp4 (koreň workspace, 332 MB):
//   1920×1080, H.264 high, CRF 25 / max 3,2 Mb/s, +faststart → ~20 MB.
// TODO(asset): obsahovo je to stále provizórium - má hovorené slovo aj titulky.
const HERO_VIDEO = '/hero.mp4'
// Kým video stojí, nie je na karte statický náhľad, ale PREZENTÁCIA: štyri
// zábery zo slučky sa striedajú prelínaním (user, 2026-08-19: „dal by som tam
// iba tie obrázky ako prezentaci a by sa iba premietali"). Je to stále to isté
// video, len rozobrané na obrázky - kto klikne, dostane presne to, čo videl.
// Prečo výrezy a nie celé snímky (stena partnerských log vpravo) aj časy je
// v public/hero/README.md. Prvý záber nesie aj `poster`, aby po kliknutí
// nepreblikla čierna, kým sa video rozbehne.
const STILLS = HERO_VIDEO_TX.stills
const STILL_MS = 4200

export default function HeroVideo({ variant = HERO_DEFAULT }) {
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  // `classic`: video je prvok na spustenie, nie kulisa - preto sa nespúšťa samo
  // a kým stojí, nemá ani rad ovládania (nie je čo ovládať, len spustiť).
  // Platí na KAŽDEJ šírke (user, 2026-08-19: „sprav aj na desktop, aby to
  // prepínalo") - nie je to oprava mobilu, ale iné hero.
  const tap = variant === 'classic'
  // `useHeroHeader` sa volá o úroveň vyššie, v samotnom úvode: priehľadnú
  // hlavičku potrebuje foto-hero úplne rovnako ako video, takže patrí stránke,
  // nie jednému z dvoch hero. Volať ho aj tu by znamenalo dva scroll listenery.
  const [videoPlaying, setVideoPlaying] = useState(true)
  const [videoMuted, setVideoMuted] = useState(true)
  const [videoFs, setVideoFs] = useState(false)
  // Hlasitosť je posuvník, nie len prepínač - kulisa má znieť potichu, nie naplno.
  // Autoplay ale beží stlmene (inak ho prehliadač nespustí), takže je to hodnota
  // „ako nahlas to bude, keď to odtlmíš".
  const [videoVol, setVideoVol] = useState(0.5)
  // index premietaného záberu - beží len kým je karta v pokoji
  const [still, setStill] = useState(0)
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

  // Prezentácia beží len v pokoji: keď video hrá, nie je čo premietať. Kto má
  // v systéme vypnutý pohyb, dostane prvý záber a ten zostane - je to dekoratívne
  // striedanie, nie obsah, ktorý by inak nešlo prečítať.
  useEffect(() => {
    if (!tap || videoPlaying) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setStill((i) => (i + 1) % STILLS.length), STILL_MS)
    return () => clearInterval(id)
  }, [tap, videoPlaying])

  // Prepnutie podoby za behu (ladiaci panel) nesmie nechať video v stave, ktorý
  // k novej podobe nepatrí: `classic` ho zastaví, `video` je kulisa a beží.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (tap) { v.pause(); setVideoPlaying(false) }
    else { v.play().then(() => setVideoPlaying(true)).catch(() => {}) }
  }, [tap])

  const videoBox = (
    <div className="hero-bgvid" ref={videoBoxRef}>
        <video ref={videoRef} className="hero-video-el" muted loop playsInline autoPlay={!tap} preload="auto"
               poster={asset(STILLS[0])}
               onLoadedMetadata={readVideoRatio}
               onPointerDown={onVideoDown} onPointerMove={onVideoMove}
               onPointerUp={onVideoUp} onPointerCancel={onVideoUp}>
          <source src={asset(HERO_VIDEO)} type="video/mp4" />
        </video>
        {tap && !videoPlaying && (
          <div className="hero-stills" aria-hidden="true">
            {STILLS.map((src, i) => (
              <img key={src} src={asset(src)} alt="" className={i === still ? 'on' : ''} />
            ))}
          </div>
        )}
        {tap && !videoPlaying && (
          /* Spúšťacie tlačidlo cez celú kartu: ťuknutie kdekoľvek do záberu
             video rozbehne. Kruh je len značka, kam mieriť - plochu drží tlačidlo,
             aby sa netrafilo do 42px terča na telefóne. */
          <button className="hero-video-start" onClick={playVideo} aria-label="Přehrát video">
            <span className="hero-video-start-ic"><IconPlayerPlayFilled size={26} /></span>
          </button>
        )}
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
  )

  return (
    <section className={`hero wf-hero${tap ? ' wf-hero--classic photo-hero' : ''}${tap && !videoPlaying ? ' is-idle' : ''}`} ref={heroRef}>
      {/* Fotka pod modrým závojom - spoločný recept .photo-hero (wireframe.css),
          ten istý, aký nesie hero firmy aj obce. Iba pri `classic`: v podobe
          `video` vypĺňa celý pás video a fotku by nebolo kde vidieť. */}
      {tap && (
        <div className="photo-hero-bg" style={{ backgroundImage: `url(${asset(HERO_VIDEO_TX.img)})` }} aria-hidden="true" />
      )}
      {/* Kresba padne na FOTKU, nie na záber - teda len v podobe `classic`.
          Video je vo vlastnej schránke v .hero-in (z-index 2), takže sa jej
          kružnice ani stuha (z-index 1) nedostanú do cesty. */}
      {tap && <><Decor /><Line pos="hero" /></>}
      {tap ? (
        /* Tá istá kostra ako foto-hero ostatných publík (.hero-in + .hero-tx):
           tvrdenie, veta, dve tlačidlá vľavo, video vpravo. Text je v dátach,
           nie tu. Titulok je väčší než na ostatných hero - drží ho --fs-hero
           cez `.wf-hero .hero-tx h1`, teda ten istý stupeň, aký mala landing
           page vždy. */
        <div className="wrap hero-in wf-hero-in">
          <div className="hero-tx">
            <h1>{HERO_VIDEO_TX.h} <b>{HERO_VIDEO_TX.hb}</b></h1>
            <p>{HERO_VIDEO_TX.p}</p>
            {/* Čísla stoja NAD tlačidlami: sú to dôvody, prečo na tlačidlo kliknúť,
                nie pätička hera. Rozvrh nesú spoločné .hero-stats. */}
            <div className="hero-stats">
              <div className="hero-stats-grid">
                {HERO_STATS.map((n) => (
                  <div className="hero-stat" key={n.label}>
                    <div className="n">{n.value}</div>
                    <div className="c">{n.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Ľudia stoja POD číslami (user, 2026-08-19; skúšané bolo aj nad
                titulkom a pod tlačidlami). Čísla a hodnotenie sú jedna vec -
                dôkaz, že firma nie je prázdny sľub - a stoja spolu nad tlačidlami.
                TODO(asset): kolieska sú iniciály z data/references.js - tá istá
                náhrada, akú nesie karta referencie. Keď budú fotky klientov so
                súhlasom, vymení sa obsah `.av`, nie rozvrh. */}
            <Link to="/reference" className="hero-proof">
              <span className="hero-proof-av" aria-hidden="true">
                {REFERENCES.slice(0, 4).map((r) => (
                  r.photo
                    ? <img className="av" key={r.name} src={r.photo} alt="" loading="lazy" />
                    : <span className="av" key={r.name}>{r.av}</span>
                ))}
              </span>
              <span className="hero-proof-tx">
                <span className="stars" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => <IconStarFilled key={i} size={14} />)}
                </span>
                <span><b>{REF_AVG} / 5</b> z <b>{REVIEWS_TOTAL}</b> hodnocení klientů</span>
              </span>
            </Link>
            <div className="hero-cta">
              <a href={HERO_VIDEO_TX.cta.to} className="btn fill">
                {HERO_VIDEO_TX.cta.label} <IconArrowUpRight size={18} stroke={2.2} />
              </a>
              <Link to={HERO_VIDEO_TX.cta2.to} className="btn">{HERO_VIDEO_TX.cta2.label}</Link>
            </div>
          </div>
          {videoBox}
        </div>
      ) : videoBox}
    </section>
  )
}
