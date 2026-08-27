import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import './about.css'
// zoznam odborných skúšok je ten istý prvok ako výpočty služby v sekciách
// pre podnikateľov (.biz-list) - kópia tých istých hodnôt by sa raz rozišla
import './business.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Ecosystem from '../components/Ecosystem.jsx'
import CareSteps from '../components/CareSteps.jsx'
import NumbersBand from '../components/NumbersBand.jsx'
import { SecHead } from '../components/PageParts.jsx'
import { Decor } from '../components/Decor.jsx'
import { Line } from '../components/Line.jsx'
import TabBar from '../components/TabBar.jsx'
import { DebugPanel } from '../components/DebugPanel.jsx'
import HeaderDebug from '../components/HeaderDebug.jsx'
import {
  INTRO, LEADERSHIP, PARTNERS, PROJECTS,
  CHANNELS, EXAMS, HELP, CERTIFICATES,
} from '../data/company.js'
import {
  IconChevronRight, IconArrowUpRight, IconHome, IconBuildingStore, IconVideo,
  IconMapPin, IconCheck,
} from '@tabler/icons-react'

// ============================================================
// /o-nas - profil společnosti.
//
// Stránka je webová podoba tlačenej brožúry „Profil společnosti Allrisk"
// (2026-08-06) a drží jej poradie aj jej obrazový materiál: balón z obálky,
// fotka zakladateľov s podpismi, kolečka ekosystému aj oba certifikáty sú
// výrezy z toho istého PDF (public/o-nas/).
//
// Čo sem NEPATRÍ: predajný argument pre jedno publikum. Tá istá firma je tu
// pre rodiny aj pre firmy, takže stránka nereaguje na prepínač publika v
// hlavičke - na rozdiel od úvodu. Segmentové rezy žijú na úvode (BizCare)
// a v katalógu.
//
// Texty sú prepis z tlače a bývajú v data/company.js, nie v tomto súbore -
// stránka je len ich rozvrh. Dve tlačové chyby, ktoré web opravuje (prehodené
// popisy certifikátov a zle nadpísaný blok skúšok), sú okomentované tam.
// ============================================================

const CHANNEL_ICONS = { home: IconHome, office: IconBuildingStore, video: IconVideo }

// Výber a poradie čísel na modrom páse si od 2026-08-27 nesie
// components/NumbersBand.jsx - pás stojí aj na úvode a dve kópie toho istého
// výpočtu by sa raz rozišli.
// Hero čísla nemá: sedem údajov na dvoch miestach je jeden údaj dvakrát,
// takže všetky stoja na páse (user, 2026-08-12).

// ZMAZANÉ 2026-08-19 (user): prepínače ekosystému - podoba sekcie (`dbg:eko4`)
// aj poloha šípok (`dbg:ekonav`) aj s components/EcosystemDebug.jsx. Sekcia má
// jednu podobu: koleso s textom a šípkami nad popisom.

// ZMAZANÉ 2026-08-17 (user): os `ekoVaz` (karta na kružnici / panel vedľa).
// Panel vedľa kružnice bol práve to, čo user na návrhu zamietol - voľba to
// teda nie je. Vybraná línia je veľký kruh a ten je hlavou karty, bodka.

// Certifikace v oboru - päť skupín skúšok ako záložky (user, 2026-08-15).
// Rad záložiek je spoločný TabBar celého webu, nie vlastný rad tlačidiel;
// počet skúšok stojí rovno v popise záložky, aby bolo vidieť, ktorá skupina
// je tá veľká, ešte pred klikom.
// ZMAZANÉ 2026-08-15: `karty` (mriežka piatich kariet) a `akordeon` (tvar FAQ).
// Karty rozsadili sedemnásť skúšok do piatich rôzne vysokých blokov, akordeón
// z nich robil otázky, ktoré to nie sú.
function ExamTabs({ groups }) {
  const [key, setKey] = useState(groups[0].key)
  const g = groups.find((x) => x.key === key) || groups[0]
  return (
    <div className="ab-exam-tabs">
      <TabBar
        items={groups.map((x) => ({ key: x.key, label: `${x.label} (${x.items.length})` }))}
        value={g.key} onChange={setKey} label="Skupiny odborných zkoušek"
      />
      {/* Ten istý zoznam ako výpočty služby na úvode pre podnikateľov
          (.biz-list--lg): 16px v tmavej, modrá fajka, riadky delené linkou.
          Odškrtnutie sedí aj významovo - sú to skúšky, ktoré poradcovia
          naozaj majú, nie zoznam tém. Drobná bodka v 14px sivej z toho robila
          poznámku pod čiarou, pritom je to dôkaz odbornosti. */}
      <ul className="biz-list biz-list--lg ab-exam-panel">
        {g.items.map((it) => (
          <li key={it}><IconCheck size={22} stroke={2.4} aria-hidden="true" />{it}</li>
        ))}
      </ul>
    </div>
  )
}

export default function About() {
  // foto-hero pod priehľadnou hlavičkou - rovnaký mechanizmus ako /vozidla
  useHeroHeader()
  return (
    <div className="site">
      {/* ============ HERO - obálka brožúry ============ */}
      <section className="hero photo-hero ab-hero">
        <div
          className="photo-hero-bg ab-hero-bg"
          style={{ backgroundImage: `url(${asset('/o-nas/balon.jpg')})` }}
          aria-hidden="true"
        />
        {/* Obe dekorácie, aj cez fotku. Ležia nad fotkou aj nad závojom (z-index
            1, v strome za ::before) a pod sadzbou. Stuha tu raz padla (2026-08-12
            pri krytí .16 čítala cez balón ako fialový opar), ale 2026-08-16 ju
            user vypýtal na každé hero - platí to novšie rozhodnutie. */}
        <Decor />
        <Line pos="hero" />
        <div className="wrap">
          <div className="hero-in ab-hero-in">
            <div className="hero-tx">
              <nav className="page-crumb">
                <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} /><b>O nás</b>
              </nav>
              {/* Bez eyebrowu (user, 2026-08-12): nad h1 už stojí breadcrumb
                  s názvom stránky, takže „Profil společnosti" bol tretí riadok
                  o tom istom. */}
              <h1>Pomáháme lidem <b>plnit sny</b></h1>
              <p>
                Česká poradenská skupina s více než 20letou tradicí. Pojištění, finance, reality
                a vlastní likvidace škod pod jednou střechou - v Česku i na Slovensku.
              </p>
              <div className="hero-cta">
                <Link className="btn fill" to="/kontakt">Ozvěte se nám<IconArrowUpRight size={20} stroke={2.2} /></Link>
                <Link className="btn" to="/pobocky">Najít pobočku</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ JSME ALLRISK - fotka zakladateľov + poziční text ============ */}
      <section className="sec wrap">
        <div className="ab-intro">
          <figure className="ab-intro-photo">
            <img src={asset(LEADERSHIP.photo)} alt="Zakladatelé společnosti Allrisk" loading="lazy" />
          </figure>
          <div className="ab-intro-tx">
            <SecHead
              ey="Jsme Allrisk"
              title={<>Partner, který stojí <b>na vaší straně</b></>}
            />
            {INTRO.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            {/* Text končí menami a pod nimi sú už len dva ťahy pera (user,
                2026-08-17). Mená stoja raz, v jednom riadku - opakovať ich
                ešte pod každým podpisom znamenalo mať ich na stránke dvakrát.
                Podpisy sú preto `aria-hidden`: čítačke ich nesie riadok nad
                nimi, obrázok by ohlásil to isté meno druhýkrát. */}
            <p className="ab-sign-who">
              {LEADERSHIP.sign}<br />{LEADERSHIP.role}
            </p>
            <div className="ab-sign" aria-hidden="true">
              {LEADERSHIP.founders.map((f) => (
                <img key={f.name} src={asset(f.sign)} alt="" loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ČÍSLA ============
          Pás si od 2026-08-27 nesie komponent sám (components/NumbersBand.jsx):
          to isté pole s tými istými číslami stojí aj na úvode pod „Proč Allrisk?",
          takže sadzba ani výber čísel nesmú žiť v stránke. */}
      <NumbersBand />

      {/* ============ EKOSYSTÉM - najdôležitejšia sekcia ============
          SEKCIU SI NESIE KOMPONENT SÁM (`<section class="sec">` + `.wrap`
          vnútri), nie stránka: hlavička sekcie, kružnica a text k nej sú jeden
          rozvrh a stránka do neho nemá čo hovoriť. Podoba je jedna, sekcia
          sa neprepína (2026-08-19). */}
      <Ecosystem />

      {/* ============ FORMY MODERNÍ KOMUNIKACE ============
          Praktická vec medzi ekosystémom a systémom péče - kde sa vlastne
          stretneme. */}
      <section className="sec wrap">
        <div className="banner ab-chan-band">
          <Decor />
          {/* vľavo dole: spodok pásu držia tri kartičky kanálov */}
          <Line corner="bottom-left" />
          {/* Rovnaký rozvrh ako pás „O společnosti" (user, 2026-08-17): hlavička
              hore cez celú šírku, dlaždice pod ňou. Podnadpis odišiel - hovoril
              to isté ako tri kartičky pod ním, len vetou. */}
          <div className="ab-chan-tx">
            <span className="ey">Kde se potkáme</span>
            <h2>Formy moderní <b>komunikace</b></h2>
          </div>
          <div className="ab-chans">
            {CHANNELS.map((c) => {
              const Icon = CHANNEL_ICONS[c.icon]
              return (
                <div className="ab-chan" key={c.key}>
                  <Icon size={24} stroke={1.7} aria-hidden="true" />
                  <b>{c.label}</b>
                  <small>{c.desc}</small>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ SYSTÉM PÉČE O KLIENTA ============
          Poradie s ekosystémom vymenené (user, 2026-08-18): najprv ucelený
          ekosystém, až za pásom „Kde se potkáme" systém péče.
          Sekcia má od 2026-08-19 JEDNU PODOBU (user: „nechaj karty s úsekom,
          odstráň všetky ostatné varianty") - štyri karty v rade, v každej je
          prvým prvkom úsek linky vo farbe svojho kroku, pod ním číslo v tej
          istej farbe a text. Osem podôb aj s prepínačom je zmazaných, hľadať
          ich treba v gite; nepoužitá zostala aj kresba
          `public/o-nas/care-system.png`. */}
      <section className="sec wrap">
        <SecHead
          ey="Jak to u nás chodí"
          title={<>Systém péče <b>o klienta</b></>}
        />
        <CareSteps />
      </section>

      {/* ============ CERTIFIKACE V OBORU ============ */}
      <section className="sec wrap">
        <SecHead
          ey="Odbornost"
          title={<>Certifikace <b>v oboru</b></>}
          lead="Přehled odborných zkoušek, kterými disponují naši poradci pro zajištění odborné obsluhy našich klientů."
        />
        <ExamTabs groups={EXAMS} />
      </section>

      {/* ============ ALLRISK POMÁHÁ ============
          Malá sekcia s logami (user, 2026-08-12) - nie tri odstavce. Celé
          znenie z brožúry zostáva v data/company.js, keby sa preň našlo
          miesto (napr. článok na blogu). */}
      <section className="sec wrap">
        <SecHead
          ey="Společenská odpovědnost"
          title={<>Allrisk <b>pomáhá</b></>}
          lead="Pomáháme tím, co umíme - odborností, vyjednáváním a penězi."
        />
        {/* Celá karta je modrá dlaždica: hore logo, pod ním názov, jeho druhý
            riadok a skrátené znenie z tlače (user, 2026-08-17). Text stál
            predtým pod obrázkom na bielej stránke, takže logo a jeho popis
            boli dva oddelené predmety - teraz je to jeden. */}
        <div className="ab-helps">
          {HELP.map((h) => (
            <figure className="ab-help-item" key={h.key}>
              <img src={asset(h.img)} alt={`${h.label} ${h.note}`} loading="lazy" />
              <figcaption>
                <b>{h.label}</b><span>{h.note}</span>
                <p>{h.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ PARTNEŘI ============
          Logotypový arch z tlače (user, 2026-08-12) stojí vpravo oproti textu.
          Mená partnerov zostávajú v dátach ako zdroj počtu a ako `alt`. */}
      <section className="sec wrap">
        <div className="ab-split">
          <div className="ab-split-tx">
            <SecHead
              ey="Partneři"
              title={<>Spolupracujeme s <b>{PARTNERS.length} institucemi</b></>}
              lead="Banky, pojišťovny, stavební spořitelny a leasingové společnosti. Díky tomu porovnáváme trh, ne vlastní nabídku."
            />
          </div>
          <img
            className="ab-logo-sheet" src={asset('/o-nas/partneri.jpg')} loading="lazy"
            alt={`Loga partnerů: ${PARTNERS.join(', ')}.`}
          />
        </div>
      </section>

      {/* ============ VÝZNAMNÉ REFERENCE ============
          Zrkadlovo k partnerom: arch vľavo, text vpravo. V HTML je text prvý,
          aby na telefóne aj v čítačke prišiel nadpis pred obrázok. */}
      <section className="sec wrap">
        <div className="ab-split rev">
          <div className="ab-split-tx">
            <SecHead
              ey="Reference"
              title={<>Významné <b>reference</b></>}
              lead="Firmy, města a instituce, které nám svěřily svá rizika."
            />
            <div className="ab-logos-foot">
              <Link className="btn" to="/reference">
                Přečíst, co říkají klienti<IconArrowUpRight size={18} stroke={2.2} />
              </Link>
            </div>
          </div>
          <img
            className="ab-logo-sheet" src={asset('/o-nas/reference-loga.jpg')} loading="lazy"
            alt="Loga významných klientů Allrisk: Apleg, Bílovice nad Svitavou, Lázně Bohdaneč, Bosal, město Brno, BDS, Crocodille, ČSAD Svitavy, Dopravní podnik města Jihlavy, Floormat, Fond ohrožených dětí, GEEN, GHV Trading, Gold's Gym, Heřmanův Městec, Jimi Electronic Solutions, Konica Minolta, Metax, Městská policie Jihlava, Trhový Štěpánov, město Žamberk, Oresi, Ter-Metal Moravia, Unis, Žitný, ZW Electrical Technology, Smero, JTZE, UlovDomov.cz, Cetl Cargo, Doprava Blažejovský, Plaček, Asmodee, Blackfire, Tamda Foods, Dallmayr, Furch, Česká komora zeměměřičů a Leoš Novotný a.s."
          />
        </div>
      </section>

      {/* ============ CERTIFIKÁTY ============
          Každé ocenenie je vlastná sekcia v tom istom tvare ako partneri
          a referencie (user, 2026-08-12): text oproti certifikátu, prvý
          obrázok vpravo, druhý vľavo. Roky stoja pásom vedľa textu.
          POZOR na párovanie textov - viď poznámku pri CERTIFICATES. */}
      {CERTIFICATES.map((c, i) => (
        <section className="sec wrap" key={c.key}>
          <div className={`ab-split cert${i % 2 ? ' rev' : ''}`}>
            <div className="ab-split-tx">
              <SecHead ey={c.ey} title={<>{c.title} <b>{c.titleB}</b></>} />
              <div className="ab-cert-body">
                <div className="ab-cert-tx">
                  {c.text.map((p) => <p key={p}>{p}</p>)}
                </div>
                {c.years && (
                  <ul className="ab-years" aria-label="Roky udělení">
                    {c.years.map((y) => <li key={y}>{y}</li>)}
                  </ul>
                )}
              </div>
            </div>
            <figure className="ab-cert-img">
              <img src={asset(c.img)} alt={c.alt} loading="lazy" />
            </figure>
          </div>
        </section>
      ))}

      {/* ============ DEVELOPERSKÉ PROJEKTY ============
          Karty POD hlavičkou cez celú šírku (user, 2026-08-17). Rozvrh
          „hlavička vľavo, karty vpravo" tu bol pol dňa a vrátil sa späť:
          vizualizácia je dôkaz, ktorý chce plochu, a v polovičnom stĺpci
          z nej bol úzky výrez. Je to ten istý tvar ako ostatné sekcie
          stránky - hlavička, pod ňou mriežka. */}
      <section className="sec wrap">
        <SecHead
          ey="Reality"
          title={<>Významné referenční <b>developerské projekty</b></>}
          lead="Nezůstáváme u zprostředkování prodeje. Vlastní developerské projekty vedeme od přípravy až po finální předání."
        />
        <div className="ab-projects">
          {PROJECTS.map((p) => (
            <figure className="ab-project" key={p.key}>
              <img src={asset(p.img)} alt={p.label} loading="lazy" />
              {/* modrá schránka vnútri obrázku, odsadená od jeho hrán - rovnaký
                  tvar karty ako na realitnom webe (user, 2026-08-12, modrá 17) */}
              <figcaption>
                <b>{p.label}</b>
                <small><IconMapPin size={16} stroke={1.8} aria-hidden="true" />{p.place}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ZMAZANÉ 2026-08-16 (user): pás „Kde všude Allrisk najdete" s mapou.
          Cestu na pobočky nesie kontaktný pás pod ním aj menu - mapa opakovala
          to isté ešte raz, len väčšie. */}

      <ContactBand />
      <SiteFooter />

      {/* Otvorené voľby stránky. Dlaždice pásu medzi nimi nie sú - rozvrh
          čísel aj podoba veľkej dlaždice sú rozhodnuté (user, 2026-08-17). */}
      <DebugPanel title="O společnosti">
        <HeaderDebug />
      </DebugPanel>
    </div>
  )
}
