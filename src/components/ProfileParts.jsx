// Zdieľané časti klientskych profilov. Zámerne žijú mimo stránok, lebo tú istú
// situáciu renderujeme z DVOCH strán:
//   • profilová stránka  - taby sú situácie, preklik vedie na produkt
//   • produktová stránka - taby sú profily, preklik vedie na profil
// Vďaka tomu je „tab názov produktu" a „tab stala se nehoda" doslova ten istý obsah.
import { createElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../asset.js'
import { useTabBar } from '../useTabBar.js'
import {
  productHref, productLabel, productHasPage, PRODUCTS_META,
  NEED_META, needRank, groupByNeed,
} from '../data/profiles.js'
import {
  IconHome, IconSofa, IconUmbrella, IconHeart, IconStethoscope, IconKey, IconPlane,
  IconChartLine, IconCoin, IconBuildingWarehouse, IconTruck, IconLicense, IconScale,
  IconCar, IconBriefcase, IconArrowUpRight, IconCircleCheck, IconUser,
  IconFileText, IconSparkles,
  IconDroplet, IconHomePlus, IconGavel, IconBuildingHospital,
  IconWind, IconPaw, IconSchool, IconFirstAidKit, IconHeartbeat, IconWallet,
  IconSnowflake, IconGauge, IconTrendingDown, IconTrendingUp, IconLock,
  IconShieldCheck, IconThumbUp, IconBulb,
  IconTool, IconBuildingFactory,
  IconUserHeart, IconBuildingCommunity, IconBuildingBank, IconTrees,
} from '@tabler/icons-react'

// Kľúč ikony (z dát) -> tabler komponent. Dáta zostávajú bez Reactu.
export const PROFILE_ICONS = {
  // archetypy
  user: IconUser, heart: IconHeart, briefcase: IconBriefcase, chart: IconChartLine, coin: IconCoin,
  // samoživiteľka - dospelý s dieťaťom, aby sa dlaždica odlíšila od „Rodiny" (srdce)
  // aj od „Sám za sebe" (postava); obec je budova úradu, nie ďalší človek
  parent: IconUserHeart, town: IconBuildingCommunity, townhall: IconBuildingBank,
  village: IconTrees,
  // firemné archetypy - živnostník má nástroj (pracuje vlastníma rukama),
  // výrobná firma halu. Kufrík zostáva podnikateľovi s tímom, aby sa tri
  // firemné dlaždice vedľa seba dali rozoznať aj bez čítania.
  tools: IconTool, factory: IconBuildingFactory,
  // produkty
  car: IconCar, home: IconHome, sofa: IconSofa, umbrella: IconUmbrella,
  stethoscope: IconStethoscope, key: IconKey, plane: IconPlane,
  warehouse: IconBuildingWarehouse, truck: IconTruck, license: IconLicense, scale: IconScale,
  // situácie - každá má vlastnú ikonu, aby sa taby dali odlíšiť na prvý pohľad.
  // Zámerne jednoduché tvary: v tabe sa kreslia na 16 px, detailné ikony tam splynú do škvrny.
  crash: IconCar, water: IconDroplet, injury: IconTrendingDown, newhome: IconHomePlus,
  claim: IconGavel, hospital: IconBuildingHospital, storm: IconWind, animal: IconPaw,
  school: IconSchool, firstaid: IconFirstAidKit, illness: IconHeartbeat, income: IconWallet,
  frost: IconSnowflake, garage: IconGauge, theft: IconLock, growth: IconTrendingUp,
  // úrovne naliehavosti v „Co je dobré mít vyřešeno" (NEED_META v profiles.js).
  // Štít zámerne u nutnosti - je to jediná úroveň, ktorá kryje, nie zlepšuje.
  'need-must': IconShieldCheck, 'need-rec': IconThumbUp, 'need-opt': IconBulb,
}
export const iconFor = (key) => PROFILE_ICONS[key] || IconFileText

// Ikona z kľúča. Zámerne cez createElement, nie cez JSX s premennou -
// inak React lint hlási „component created during render".
export const Icon = ({ name, ...props }) => createElement(iconFor(name), props)

// Ilustrácia profilu - tabler.io SVG z public/illus/tabler/stories.
// Keby súbor chýbal, spadne späť na ikonu, aby dlaždica nikdy nezostala prázdna.
export function ProfileIllus({ img, ic }) {
  const [ok, setOk] = useState(true)
  if (!img || !ok) return <span className="ni"><Icon name={ic} size={26} stroke={1.7} /></span>
  return (
    <span className="story-ill">
      <img src={asset(img)} alt="" aria-hidden="true" onError={() => setOk(false)} />
    </span>
  )
}

// Mriežka profilov na landingu - dlaždica je odkaz na vlastnú stránku profilu.
// Počet stĺpcov ide do CSS ako premenná, nie ako trieda: publikum má tri
// archetypy, „Nejste to úplně vy?" na detaile dva a pevná štvorica po nich
// nechávala prázdne miesto, ktoré vyzerá ako chýbajúca dlaždica.
//
// Profil BEZ `slug` je dlaždica bez prekliku: je to portrét, nie vstup do stránky.
// Tak stoja profily miest a obcí (user, 2026-08-12) - archetyp obce sa oplatí
// ukázať, ale detailná stránka s modelovými situáciami k nemu zatiaľ nie je.
// Nekreslí sa ani „Zobrazit profil": sľúbený preklik, ktorý nikam nevedie, je
// horší než žiadny.
export function ProfileCards({ profiles, className = '' }) {
  return (
    <div className={`prof-cards ${className}`.trim()} style={{ '--pc-n': Math.min(4, profiles.length) }}>
      {profiles.map((p) => {
        const body = (
          <>
            {/* ilustrácia ide edge-to-edge (rovnako ako foto modelu na produktovej stránke),
                preto má dlaždica padding 0 a text vlastný odsadený blok */}
            <ProfileIllus img={p.img} ic={p.ic} />
            <span className="prof-card-tx">
              <span className="ey">{p.ey}</span>
              <b>{p.t}</b>
              <p>{p.p}</p>
              {p.slug && (
                <span className="story-pick">
                  Zobrazit profil <IconArrowUpRight size={16} stroke={2.2} />
                </span>
              )}
            </span>
          </>
        )
        return p.slug ? (
          <Link key={p.key} to={`/profil/${p.slug}`} className="story prof-card">{body}</Link>
        ) : (
          <div key={p.key} className="story prof-card prof-card--flat">{body}</div>
        )
      })}
    </div>
  )
}

// Tá istá dlaždica ako na landingu, len ako prepínač na produktovej stránke.
// Zámerne bez „Zobrazit profil" - výber nikam nevedie, prepína situáciu pod sebou.
// Vybraná dlaždica berie stav .on z .story (wireframe.css), rovnako ako ostatné prepínače.
export function ProfileTabs({ profiles, value, onChange }) {
  // pod desktopom je rad vodorovne posuvný - vybraná dlaždica sa musí sama dostať do výrezu
  const ref = useTabBar(value)
  return (
    <div className="prof-cards prof-tabs" ref={ref} role="tablist">
      {profiles.map((p) => (
        <button
          key={p.key} type="button" role="tab" aria-selected={value === p.key}
          className={`story prof-card ${value === p.key ? 'on' : ''}`}
          onClick={() => onChange(p.key)}
        >
          <ProfileIllus img={p.img} ic={p.ic} />
          <span className="prof-card-tx">
            <span className="ey">{p.ey}</span>
            <b>{p.t}</b>
            <p>{p.p}</p>
          </span>
        </button>
      ))}
    </div>
  )
}

// Jedna situácia. `context` mení iba CTA a nadpisové drobnosti - telo je zhodné.
//   context='profil'  → z profilu klikáš na produkt
//   context='produkt' → z produktu klikáš na profil
export function SituationPanel({ profile, situation, context = 'profil' }) {
  // Z profilu je „druhá strana" produkt, z produktu je to samotný profil.
  const toProduct = context === 'profil'
  const linkIcon = toProduct ? PRODUCTS_META[situation.product]?.icon : profile.ic
  return (
    <div className="sit">
      <div className="sit-main">
        <span className="sit-badge">
          <Icon name={situation.ic} size={15} stroke={2} /> {situation.tab}
        </span>
        <h3>{situation.title}</h3>
        <p className="sit-story">{situation.story}</p>

        <div className="sit-fix">
          <div className="sit-lbl">Jak to vyřešilo pojištění</div>
          <ul>
            {situation.fix.map((f) => (
              <li key={f}><IconCircleCheck size={18} stroke={1.8} /><span>{f}</span></li>
            ))}
          </ul>
        </div>

        <div className="sit-outcome">
          <IconSparkles size={18} stroke={1.7} />
          <span>{situation.outcome}</span>
        </div>
      </div>

      {/* Preklik na druhú stranu väzby - kartička v pravom stĺpci.
          Ikona + názov sedia v jednom riadku (nie štyri veci pod sebou),
          tlačidlo drží spodok na plnú šírku. */}
      <aside className="sit-aside">
        {/* popisok je hlavička karty, pod ňou ikona a až pod ňou názov - ako „Dobré vědět“ vyššie */}
        <div className="sit-aside-lbl">{toProduct ? 'Řeší produkt' : 'Profil klienta'}</div>
        <span className="sit-aside-ic"><Icon name={linkIcon} size={38} stroke={1.5} /></span>
        {/* Z profilu ukazujeme PODPRODUKT, ktorý škodu reálne kryl („Havarijní pojištění“),
            a pod ním produkt, na ktorého stránke býva - to je tá istá dvojica, akú človek
            uvidí na /vozidla ako záložku. Samotné „Pojištění vozidel“ mu nepovie, čo z toho
            zafungovalo. Ak situácia podprodukt nemá, karta spadne späť na názov produktu. */}
        <div className="sit-aside-h">
          <div className="sit-aside-t">
            {!toProduct ? profile.t : situation.sub || productLabel(situation.product)}
          </div>
          {toProduct && situation.sub && (
            <div className="sit-aside-parent">{productLabel(situation.product)}</div>
          )}
        </div>
        <p>
          {toProduct
            ? 'Co přesně kryje a jak si ho poskládat na míru.'
            : `${profile.ey} - co dalšího je v téhle situaci dobré mít vyřešeno.`}
        </p>
        {/* „Zobrazit produkt" sľubuje stránku produktu - dáme ho len tam, kde reálne je
            (dnes vozidlá). Inak vedie odkaz na poradcu a musí to aj povedať. */}
        <Link
          to={toProduct ? productHref(situation.product) : `/profil/${profile.slug}`}
          className="btn fill"
        >
          {!toProduct
            ? 'Zobrazit profil'
            : productHasPage(situation.product) ? 'Zobrazit produkt' : 'Probrat s poradcem'}
          <IconArrowUpRight size={18} stroke={2.2} />
        </Link>
      </aside>
    </div>
  )
}

// Zoznam „Co je dobré mít vyřešeno" - produkt + prečo ho tento archetyp potrebuje.
// Pôvodne jeden stĺpec so štítkom naliehavosti na každom riadku; naliehavosť sa tak
// dala prečítať až po položkách a rovnaké úrovne držala pri sebe len zhoda triedenia.
// Dnes je delenie samotné rozloženie: úroveň je hlavička skupiny, položka pod ňu patrí.
// Preto na karte NIE JE štítok - v skupine „Nutnost" by bol na každej karte ten istý.
export function SolvedList({ items }) {
  const sorted = [...items].sort((a, b) => needRank(a.need) - needRank(b.need))
  const groups = groupByNeed(sorted)
  return (
    // počet skupín ide do CSS ako premenná - rozloženie sa podľa nej rozdelí
    // na 3 alebo 2 stĺpce podľa toho, či profil vôbec nejaké „Zvážit" má
    <div className="solved-m" style={{ '--sgrp-n': groups.length }}>
      {/* Hlavička nesie IBA ikonu, názov úrovne a preklad do bežnej reči.
          Počet položiek ani poradové číslo tu zámerne nie sú - poradie aj množstvo
          človek vidí priamo z toho, čo je pod hlavičkou, a v troch hlavičkách nad sebou
          to boli tri čísla, ktoré ťahali oko preč od názvov produktov. */}
      {groups.map((g) => (
        <section key={g.need} className={`sgrp ${g.need}`}>
          <header className="sgrp-h">
            <span className="sgrp-ic"><Icon name={NEED_META[g.need].ic} size={24} stroke={1.8} /></span>
            <span className="sgrp-t">
              <b>{NEED_META[g.need].label}</b>
              <small>{NEED_META[g.need].hint}</small>
            </span>
          </header>
          <div className="sgrp-list">
            {g.items.map((it) => (
              <Link key={it.product} to={productHref(it.product)} className="scard">
                <span className="scard-ic"><Icon name={PRODUCTS_META[it.product]?.icon} size={20} stroke={1.6} /></span>
                <span className="scard-tx">
                  <b>{productLabel(it.product)}</b>
                  <small>{it.note}</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
