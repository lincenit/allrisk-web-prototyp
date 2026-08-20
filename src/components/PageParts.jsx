import { Link } from 'react-router-dom'
import { IconArrowLeft, IconChevronRight } from '@tabler/icons-react'
import { asset } from '../asset.js'
import { Decor } from './Decor.jsx'
import { Line } from './Line.jsx'

// Spoločné diely sekundárnych stránok (kontakt, detail pobočky, detail poradce).
// Poradie prvkov drží tvar reality webu: tlačidlo späť → identita (foto/avatar +
// titulok + podtitulok) → pás kontaktných čipov, potom telo stránky v mriežke
// [obsah | sticky bočný stĺpec].

// Hero presahuje pod sticky header (margin -64 / padding +64), takže gradient
// aj podkladová fotka vidno aj za hlavičkou.
// Kružnice má hero VŽDY, aj s fotkou (user, 2026-08-16): fotka a modrý závoj
// zostávajú, kresba je len ďalšia vrstva nad nimi (z-index 1, v strome za
// .photo-hero::before, takže sa kreslí nad závojom a pod sadzbou).
//
// Stuhu má hero VŽDY, aj s fotkou (user, 2026-08-16) - rovnako ako kružnice.
// Do 2026-08-16 platil opak (nad fotkou z nej bol fialový opar), teraz je to
// druhá vrstva nad závojom a pod sadzbou. Ktorá zo štyroch stúh a ktoré plátno
// kružníc to bude, si oba komponenty losujú samy pri každom načítaní.
//
// NAD TITULKOM STOJÍ BUĎ DROBEČEK, ALEBO TLAČIDLO SPÄŤ - nikdy oboje. Rozhoduje
// hĺbka, nie stránka: `crumb` patrí stránke, na ktorú sa chodí z hlavičky
// (/kontakt), lebo tá má polohu v strome webu; `back` patrí detailu, kam sa
// človek preklikol z konkrétneho zoznamu (pobočka, poradce), a preto sa vracia
// tam, odkiaľ prišiel, nie „o úroveň vyššie".
//   crumb  názov stránky v drobečku; cesta je vždy Domů › <názov>, tak ako na
//          /blog, /reference a /o-nas. Tvar `.page-crumb` je spoločný.
export function PageHero({ crumb, back, backLabel, title, subtitle, photo, media, children }) {
  return (
    <section className="phero photo-hero">
      {photo && (
        <div className="photo-hero-bg" style={{ backgroundImage: `url(${asset(photo)})` }} aria-hidden="true" />
      )}
      <Decor />
      <Line pos="hero" />
      <div className="wrap phero-in">
        {crumb && (
          <nav className="page-crumb">
            <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} /><b>{crumb}</b>
          </nav>
        )}
        {back && (
          <Link to={back} className="phero-back">
            <IconArrowLeft size={18} stroke={2.2} aria-hidden="true" />
            <span>{backLabel}</span>
          </Link>
        )}
        <div className={media ? 'phero-id' : 'phero-tx'}>
          {media}
          {media ? (
            <div className="phero-tx">
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
              {children}
            </div>
          ) : (
            <>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
              {children}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

// Kontaktný čip v hero - telefón, e-mail, adresa. Bez href je to len údaj.
// Tvar podľa reality webu: hranatý rám v bielej, ikona rovno v riadku (bez bublinky).
export function HeroChip({ href, icon, children }) {
  const Tag = href ? 'a' : 'span'
  const extra = href && href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}
  return (
    <Tag className="hchip" {...(href ? { href, ...extra } : {})}>
      {icon}
      <span className="tx">{children}</span>
    </Tag>
  )
}

// Hlavička sekcie: eyebrow → titulok → úvodná veta. JEDINÝ tvar pre celý web -
// sekcie na všetkých stránkach aj modrá hlavička podstránky (/reference), ktorá
// je ten istý blok, len s h1 a s farbami na tmavom (rieši .page-head v CSS).
// Predtým bola táto trojica rozpísaná inline na dvanástich miestach a hlavička
// podstránky mala vlastnú štruktúru s inými medzerami - presne tým sa rozišli.
//   ey    - text eyebrowu; ako element (napr. tlačidlo späť) sa vloží tak, ako je
//   lead  - úvodná veta pod titulkom
//   level - 1 pre titulok stránky, inak 2
//   children - čokoľvek pod vetou (čísla v hlavičke, skratky v „cestě života")
export function SecHead({ ey, title, lead, leadClass, level = 2, className = '', children }) {
  const H = `h${level}`
  return (
    <div className={`sec-h ${className}`.trim()}>
      {ey && (typeof ey === 'string' ? <span className="ey">{ey}</span> : ey)}
      <H>{title}</H>
      {lead && <p className={leadClass}>{lead}</p>}
      {children}
    </div>
  )
}

// Hlavička bloku vnútri stránky: ikona v modrom štvorčeku + názov, vpravo akcia.
export function SectionHead({ icon, title, action }) {
  return (
    <div className="shead">
      {icon && <span className="ic">{icon}</span>}
      <h2>{title}</h2>
      {action && <span className="act">{action}</span>}
    </div>
  )
}

// Karta človeka (poradce) - avatar, meno, rola. Zhodná v tíme pobočky aj vo formulári.
export function PersonCard({ a, initials, to, plain }) {
  const inner = (
    <>
      <span className="avatar">{initials(a.name)}</span>
      <span className="tx"><b>{a.name}</b><small>{a.role}</small></span>
    </>
  )
  if (plain) return <div className="pcard plain">{inner}</div>
  return <Link className="pcard" to={to}>{inner}</Link>
}
