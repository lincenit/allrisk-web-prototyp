/* ============================================================
   Úvodná stránka. Od 2026-08-11 je celá riadená PUBLIKOM (src/segment.js) -
   pás záložiek v hlavičke nemení len menu, ale všetko pod ním.

   Čo publikum mení:
     hero        - video len pre retail; firma a obec majú foto-hero
     rozcestník  - rodiny a obce dostanú „Co právě řešíte?", podnikatelia
                   namiesto neho „Proč si vybrat Allrisk" (systém péče)
     filozofia   - jedna veta na publikum
     Proč Allrisk- tri bloky pre rodiny a obce; podnikatelia majú na tom
                   mieste celý systém péče zo zrušenej stránky /podnikatele
     banner      - revize smluv / pojistného programu
     profily     - len retail; firma ani obec archetypy nemajú
     FAQ         - iné otázky, nie tie isté inými slovami

   Čo publikum NEMENÍ: reference, blog a kontaktný formulár - to sú dôkaz
   a obsah o firme ako celku.

   HERO bol do 2026-08-18 spoločný (video pre všetkých, „je to značka, nie
   argument"). User to obrátil: video je kulisa bez tvrdenia a bez cesty ďalej,
   čo firme ani obci nestačí. Video zostáva retailu, ostatní dvaja dostanú
   foto-hero s vetou, dvoma tlačidlami a tromi sklenenými kartami.

   Obsah samotný žije v data/home.js a data/care.js - tu je len poskladanie.
   ============================================================ */
import { useState } from 'react'
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
import { HERO, WHY, BANNER, PROFILES_HEAD, FAQ, homeFor } from '../data/home.js'
import { BizPrinciples, BizCare } from '../components/BizCare.jsx'
import { DebugPanel, DebugGroup, useDebugOption } from '../components/DebugPanel.jsx'
import { HERO_VARIANTS, HERO_DEFAULT, heroVariant } from '../heroVariants.js'
import HeaderDebug from '../components/HeaderDebug.jsx'
import { WHY_VARIANTS, WHY_VARIANT_DEFAULT, whyVariant } from '../bizVariants.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Illus from '../components/Illus.jsx'
import Ecosystem from '../components/Ecosystem.jsx'
import NumbersBand from '../components/NumbersBand.jsx'
import BranchMap from '../components/BranchMap.jsx'
import HeroVideo from '../components/HeroVideo.jsx'
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
  IconMovie,
  IconHomeDollar, IconHomeSearch, IconHomeCheck,
  IconLicense, IconShieldCheck, IconUserCheck, IconArrowRight,
  IconLayoutGrid, IconMapPin,
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
  // `partner` sem pribudol s foto-herom: je to ten istý kľúč, aký nesú princípy
  // v BizCare.jsx, takže dáta hovoria o ikone jedným menom na celom webe.
  partner: IconUserCheck,
}
// Produktové stránky zatiaľ neexistujú - bez vlastnej routy ide položka na kontakt s témou.
const temaHref = (label) => `/kontakt?tema=${encodeURIComponent(label)}`
const productHref = (p) => p.to || temaHref(p.label)
// väzba „vybrat z…" žiada genitív, tam je tvar rovnaký pre všetky počty
const productPickLabel = (n) => `Vybrat z ${n} produktů`

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

/* Foto-hero úvodu - podoba pre podnikateľov a pre obce.
   Ten istý mechanizmus ako /vozidla a /o-nas: `.hero photo-hero` + `.photo-hero-bg`
   s fotkou v pozadí, modrý závoj a značkovú farbu drží CSS (wireframe.css), tu je
   len obsah. Geometriu (podlezenie pod priehľadnú hlavičku, dva stĺpce na širokom
   okne) nesie `.wf-phero`.

   Dekoráciu má obe - kružnice aj stuhu. To je pravidlo každého modrého poľa vrátane
   fotohera (user, 2026-08-16); výnimkou je len videohero, kde je vlásočnica cez
   pohyblivý záber šmuha.

   Karty vpravo sú tvrdenia, nie odkazy: `<li>` bez `<a>`. Nemajú kam viesť a náznak
   kliknuteľnosti v hero je sľub, ktorý stránka nesplní. Jeden riadok na kartu -
   vysvetľujúca veta pod tvrdením padla 2026-08-16 a platí to aj tu.

   Prvé tlačidlo je kotva na tej istej stránke, preto `<a href="#…">` a nie `<Link>`:
   router by z kotvy urobil novú adresu a scroll-margin z `[id]` by sa neuplatnil. */
function HeroPhoto({ hero }) {
  return (
    <section className="hero wf-phero photo-hero">
      {/* fotka je pozadie, nie obsah - preto div s background-image a aria-hidden.
          Keby súbor chýbal, ostane pod ňou --hero-base, teda značkový modrý
          prechod: hero tým nestratí tvar, len fotku. */}
      <div className="photo-hero-bg" style={{ backgroundImage: `url(${asset(hero.img)})` }} aria-hidden="true" />
      <Decor />
      <Line pos="hero" />
      <div className="wrap hero-in wf-phero-in">
        <div className="hero-tx">
          <h1>{hero.h} <b>{hero.hb}</b></h1>
          <p>{hero.p}</p>
          <div className="hero-cta">
            <a href={hero.cta.to} className="btn fill">
              {hero.cta.label} <IconArrowRight size={18} stroke={2.2} aria-hidden="true" />
            </a>
            <Link to={hero.cta2.to} className="btn">{hero.cta2.label}</Link>
          </div>
        </div>
        <ul className="hero-points">
          {hero.points.map((pt) => {
            const C = RZ_ICONS[pt.icon] || IconShield
            return (
              <li key={pt.t}>
                <span className="hp-ic"><C size={24} stroke={1.7} /></span>
                <span className="hp-tx"><b>{pt.t}</b></span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
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
  const why = homeFor(WHY, seg)
  const banner = homeFor(BANNER, seg)
  const faq = homeFor(FAQ, seg)
  const profHead = homeFor(PROFILES_HEAD, seg)
  const profiles = profilesFor(seg)
  // `null` = video (retail), objekt = foto-hero (firma, obec). Tá istá konvencia
  // ako pri WHY: null znamená „iný tvar", nie „obsah chýba".
  const hero = homeFor(HERO, seg)
  // Podoba sekcie „Proč si vybrat Allrisk". Prepínač je v ladiacom paneli a ten
  // je na úvode len pre podnikateľov - ostatné publiká tú sekciu nemajú.
  const [whyRaw, setWhy] = useDebugOption('bizWhy', WHY_VARIANT_DEFAULT)
  const whyStyle = whyVariant(whyRaw)
  // Mapa „Kde nás najdete" nad kontaktným boxom. VYPNUTÁ (user, 2026-08-27:
  // sekciu si dal najprv zmazať, potom vrátiť ako voľbu) - preto `ne` ako
  // východzia hodnota a nie prepínač dvoch podôb: je to os zap/vyp.
  const [mapRaw, setMap] = useDebugOption('mapa', 'ne')
  const showMap = mapRaw === 'ano'

  // Podoba hera pre rodiny: `video` (kulisa) alebo `classic` (motto, čísla, dve
  // tlačidlá a video ako karta) - viď src/heroVariants.js. Podobu si nesie
  // sekcia triedou, dokument o nej nemusí vedieť.
  const [heroRaw, setHeroVar] = useDebugOption('hero', HERO_DEFAULT)
  const heroMode = heroVariant(heroRaw)

  // Priehľadná hlavička nad hero. Platí pre obe podoby - video aj fotku -
  // takže hook patrí stránke, nie jednému z dvoch hero komponentov.
  useHeroHeader()

  return (
    <div className="site">
      {/* ============ HERO ============ */}
      {/* Video LEN PRE RETAIL (user, 2026-08-18). Značková slučka je kulisa bez
          tvrdenia a bez cesty ďalej - to sedí jednotlivcom a rodinám, ktorí prídu
          bez konkrétneho zadania. Firma a obec dostanú foto-hero: veta, dva kroky
          a tri sklenené karty s dôkazom (data/home.js HERO).
          Podnikatelia majú späť presne to hero, aké mala zrušená stránka
          /podnikatele - tá istá fotka, ten istý titulok, tá istá veta. */}
      {hero ? <HeroPhoto hero={hero} /> : <HeroVideo variant={heroMode} />}

      {/* Za herom nič nenasleduje - stránka ide rovno do rozcestníka. */}

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

      {/* ZMAZANÉ 2026-08-19 (user): sekcia „Naše filozofie" - jedna veta,
          ktorá sa pri scrollovaní rozsvecovala po slovách. Mala ju len rodina
          a jednotlivci, ostatné publiká nie, takže s ňou padol celý tvar aj
          jeho motor (.phil vo wireframe.css, PHIL v data/home.js). */}

      {/* ============ PROČ ALLRISK ============ */}
      {/* PRIDANÉ 2026-08-27 (user): sekcia sa otvára tým, čo dovtedy žilo len
          na /o-nas - kolesom ekosystému a modrým pásom s číslami. Je to dôkaz
          pred argumentom: najprv ČO všetko Allrisk je (šesť línií) a ČÍM to
          dokladá (čísla), až potom jednotlivé dôvody.

          Obe sekcie si nesie komponent sám a obe stoja na /o-nas z toho istého
          zdroja - koleso nad `LINES`, pás nad `NUMBERS` (data/company.js).
          Úprava čísel je preto jedna zmena na jednom mieste, nie dve kópie.

          Nadpis sekcie nesie OKO nad titulkom kolesa, nie samostatný h2:
          dva veľké nadpisy pod sebou („Proč Allrisk?" a „Ucelený unikátní
          ekosystém Allrisk") by boli dva nadpisy o tom istom mieste. Ten istý
          spôsob, akým sekciu uvádza BizCare („Vše pod jednou střechou").

          LEN RODINY A JEDNOTLIVCI (user, 2026-08-27). Podnikatelia koleso majú
          na konci systému péče (BizCare) a druhýkrát na tej istej stránke
          nepatrí; úvod pre obce zostáva bez zmeny. Preto sa tu neskúša `why`
          (to majú aj obce), ale priamo publikum. */}
      {seg === 'rodiny' && (
        <>
          <Ecosystem ey="Proč Allrisk?" />
          <NumbersBand ey="Allrisk v číslech" />
        </>
      )}

      {/* Rodiny a obce: bloky text + ilustrácia, striedavo.
          Podnikatelia: celý systém péče zo zrušenej stránky /podnikatele. */}
      {why ? (
        <section className="sec wrap">
          <div className="why-feats">
            {why.map((f, i) => (
              <div className={`feature ${i % 2 ? 'alt' : ''}`} key={f.key}>
                <div className="feature-tx">
                  <span className="ey">{f.ey}</span>
                  <h2>{accentTitle(f.t, f.accent)}</h2>
                  {/* `p` smie byť veta aj pole viet - druhý odstavec je o stupeň
                      menší (.feature-tx p ~ p), takže blok znesie dlhší text
                      bez toho, aby prerástol susedný. Odstavec smie byť aj
                      `{ t, b }` s tučným začiatkom; vysádza ho ten istý
                      `accentTitle` ako tučné slovo v nadpise. */}
                  {(Array.isArray(f.p) ? f.p : [f.p]).map((par) => {
                    const t = par.t || par
                    return <p key={t.slice(0, 24)}>{accentTitle(t, par.b)}</p>
                  })}
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
          LEN RETAIL (user, 2026-08-18): firma ani obec sekciu nemajú. Archetyp je
          pomôcka pre toho, kto sa v ponuke nevyzná; firma svoju kategóriu pozná.
          Podmienka zostáva dvojitá - `profHead` je vypnutá sekcia (null v dátach),
          `profiles.length` poistka proti publiku bez archetypov. */}
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

      {/* ============ KDE NÁS NAJDETE - mapa ============ */}
      {/* VYPNUTÁ, žije len ako voľba v ladiacom paneli (user, 2026-08-27:
          sekciu si dal najprv zmazať a potom vrátiť ako vypnutú možnosť).
          Je to TÁ ISTÁ MAPA AKO NA /kontakt (user, 2026-08-27), teda spoločný
          komponent nad tými istými dátami - nie tlačová strana z brožúry, ktorá
          tu stála prvý pokus. Pin na každej pobočke, bez filtra: úvod je prehľad,
          hľadanie patrí na /kontakt.

          BEZ TLAČIDLA (user): pod mapou nič nenasleduje, hneď za ňou je
          kontaktný box a v ňom „Najít pobočku" už raz stojí. */}
      {seg === 'rodiny' && showMap && (
        <section className="sec wrap">
          <SecHead ey="Pobočky" title={<>Kde nás <b>najdete</b></>} />
          <BranchMap />
        </section>
      )}

      {/* ============ KONTAKT (spoločný banner) ============ */}
      <ContactBand />

      {/* ============ FOOTER (spoločný) ============ */}
      <SiteFooter />

      {/* Ladiaci panel. „Podklad" majú všetky publiká - sekcie sú tie isté.
          „Proč Allrisk" má len publikum Podnikatelé: mení sekciu, ktorú
          ostatné nemajú. Voľba „Spolupráce" tu od 2026-08-16 nie je - kroky
          majú rozhodnutý tvar. */}
      <DebugPanel>
        <HeaderDebug />
        {/* Skupina má zmysel len tam, kde je video - firma a obec majú na úvode
            fotohero a prepínať by nemali čo. Obe podoby platia na každej šírke;
            na telefóne je `video` rozhodnuté na pás pod hlavičkou (heroVariants.js). */}
        {!hero && (
          <DebugGroup
            icon={IconMovie} label="Hero" value={heroMode} onChange={setHeroVar} wrap
            options={HERO_VARIANTS}
          />
        )}
        {!intents && (
          <DebugGroup
            icon={IconLayoutGrid} label="Proč Allrisk" value={whyStyle} onChange={setWhy} wrap
            options={WHY_VARIANTS}
          />
        )}
        {/* Len pre rodiny - sekcia inde na úvode nie je, tak by prepínač nemal
            čo prepínať. Os je zap/vyp, nie dve podoby: východzí stav je `ne`. */}
        {seg === 'rodiny' && (
          <DebugGroup
            icon={IconMapPin} label="Mapa poboček" value={mapRaw} onChange={setMap}
            options={[{ value: 'ne', label: 'Skrytá' }, { value: 'ano', label: 'Zobrazit' }]}
          />
        )}
      </DebugPanel>
    </div>
  )
}
