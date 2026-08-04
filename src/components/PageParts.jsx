import { Link } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import { asset } from '../asset.js'

// Spoločné diely sekundárnych stránok (kontakt, detail pobočky, detail poradce).
// Poradie prvkov drží tvar reality webu: tlačidlo späť → identita (foto/avatar +
// titulok + podtitulok) → pás kontaktných čipov, potom telo stránky v mriežke
// [obsah | sticky bočný stĺpec].

// Hero presahuje pod sticky header (margin -64 / padding +64), takže gradient
// aj podkladová fotka vidno aj za hlavičkou.
export function PageHero({ back, backLabel, title, subtitle, photo, media, children }) {
  return (
    <section className="phero">
      {photo && (
        <div className="phero-bg" style={{ backgroundImage: `url(${asset(photo)})` }} aria-hidden="true" />
      )}
      <div className="wrap phero-in">
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

// Kontaktný čip v hero – telefón, e-mail, adresa. Bez href je to len údaj.
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

// Hlavička sekcie: eyebrow → titulok → úvodná veta. JEDINÝ tvar pre celý web —
// sekcie na všetkých stránkach aj modrá hlavička podstránky (/reference), ktorá
// je ten istý blok, len s h1 a s farbami na tmavom (rieši .page-head v CSS).
// Predtým bola táto trojica rozpísaná inline na dvanástich miestach a hlavička
// podstránky mala vlastnú štruktúru s inými medzerami — presne tým sa rozišli.
//   ey    – text eyebrowu; ako element (napr. tlačidlo späť) sa vloží tak, ako je
//   lead  – úvodná veta pod titulkom
//   level – 1 pre titulok stránky, inak 2
//   children – čokoľvek pod vetou (čísla v hlavičke, skratky v „cestě života")
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

// Karta človeka (poradce) – avatar, meno, rola. Zhodná v tíme pobočky aj vo formulári.
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
