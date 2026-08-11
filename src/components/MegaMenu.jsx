/* ============================================================
   MegaMenu - rozbaľovací panel hlavičky s katalógom produktov.

   Panel vie dve kostry, lebo hlavička má dve verzie (headerVariants.js):

   `setSeg` daný  → verzia „přepínač": vľavo modrý panel s výberom publika,
                    vpravo katalóg. Jedna položka v lište („Produkty").
   `setSeg` nedaný → verzia „položky": publikum už zvolila lišta, takže
                    namiesto prepínača je hore riadok, ktorý pomenuje, čie
                    to je - label v lište býva skrátený.

   Podnikateľov panel NEUKAZUJE ani v jednej verzii: vedú rovno na
   /podnikatele, lebo tam nejde o výber produktu, ale o spôsob spolupráce.
   V bočnom paneli sú preto odkazom so šípkou, nie záložkou.

   Layout katalógu: tri obchodné línie (Pojištění / Reality / Finance) sú
   stĺpce, dve doplnkové služby stoja nad sebou v poslednom. Žiadny spodný
   pás, žiadna karta poradcu, žiadne počty pri kategóriách.
   ============================================================ */
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowUpRight } from '@tabler/icons-react'
import ProductIcon from './ProductIcon.jsx'
import { MENU, CATS, SEGMENTS } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import './MegaMenu.css'

// Podnikatelé nikde neotvárajú katalóg - vedú na vlastnú stránku.
const BIZ_KEY = 'podnikatele'
const BIZ = '/podnikatele'

const PRIMARY = CATS.filter((c) => c.primary)
const EXTRA = CATS.filter((c) => !c.primary)

// Popisok v modrom paneli je statický - nemení sa so segmentom. Hovorí,
// čo panel je a čo sa od používateľa čaká, nie čo je práve zvolené.
export const SIDE_TITLE = 'Produkty'
export const SIDE_TEXT = 'Vyberte si, pro koho službu hledáte. Nabídka se tomu přizpůsobí.'

/* ---------- výber segmentu (len verzia „přepínač") ---------- */

// Roving tabindex: šípky prechádzajú segmenty, Tab ide preč z celej skupiny.
// Prepína sa KLIKOM, nikdy hoverom - pôvodný rail sa menil na onMouseEnter,
// takže cesta kurzora preblikla všetky kategórie. To je defekt, nie funkcia.
function SegSide({ seg, setSeg, onNavigate }) {
  const ref = useRef(null)
  // Podnikatelé nie sú záložka, takže ani šípky ich nesmú „zvoliť" - klávesnica
  // prechádza len tie publiká, ktoré panel naozaj prepínajú.
  const TABS = SEGMENTS.filter((s) => s.key !== BIZ_KEY)

  const onKeyDown = (e) => {
    const i = TABS.findIndex((s) => s.key === seg)
    const last = TABS.length - 1
    let n = null
    if (e.key === 'ArrowDown') n = i === last ? 0 : i + 1
    else if (e.key === 'ArrowUp') n = i === 0 ? last : i - 1
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = last
    if (n === null) return
    e.preventDefault()
    setSeg(TABS[n].key)
    ref.current?.querySelectorAll('[role="tab"]')[n]?.focus()
  }

  return (
    <div className="mm-side">
      {/* Prepínač je hore, titulok s popiskom pod ním na spodku panelu.
          Ovládanie tak sadne na jednu linku s nadpismi stĺpcov vedľa. */}
      <div
        className="mm-tags" ref={ref} onKeyDown={onKeyDown}
        role="tablist" aria-label="Pro koho" aria-orientation="vertical"
      >
        {SEGMENTS.map((s) => (s.key === BIZ_KEY ? (
          /* Šípka je jediné, čo odlíši odkaz od záložky - obe sedia v jednom
             stĺpci a bez nej by klik prekvapil odchodom zo stránky. */
          <Link key={s.key} className="mm-tag-link" to={BIZ} onClick={onNavigate}>
            {s.label} <IconArrowUpRight size={16} stroke={2.2} />
          </Link>
        ) : (
          <button
            key={s.key} type="button" role="tab"
            aria-selected={s.key === seg} tabIndex={s.key === seg ? 0 : -1}
            className={s.key === seg ? 'on' : ''}
            onClick={() => setSeg(s.key)}
          >
            {s.label}
          </button>
        )))}
      </div>
      <div className="mm-side-tx">
        <h2 className="mm-side-h">{SIDE_TITLE}</h2>
        <p className="mm-side-p">{SIDE_TEXT}</p>
      </div>
    </div>
  )
}

/* ---------- výber segmentu ako karty (verzia hlavičky „karty") ----------

   Tá istá reč ako bočný panel - neaktívne biele, aktívne plná modrá,
   Podnikatelé odkaz so šípkou - ale na plnú šírku a v prvom riadku panelu.
   Karta navyše unesie popis publika, ktorý sa do 256px stĺpca nezmestil.
   Nie je to tablist: Podnikatelé v rade nie sú záložka a role="tab" by
   sľuboval prepnutie obsahu, ktoré neurobia. */
function SegCards({ seg, setSeg, onNavigate }) {
  return (
    <div className="mm-cards" role="group" aria-label="Pro koho">
      {SEGMENTS.map((s) => (s.key === BIZ_KEY ? (
        <Link key={s.key} className="mm-card mm-card--link" to={BIZ} onClick={onNavigate}>
          {/* Šípka je väčšia než v stĺpcovej podobe menu (user, 2026-08-11):
              na karte je to jediný rozdiel medzi „prepne obsah" a „odídeš
              odtiaľto" a v 16px sa strácala. */}
          <b>{s.label} <IconArrowUpRight size={22} stroke={2.2} /></b>
          <small>{s.desc}</small>
        </Link>
      ) : (
        <button
          key={s.key} type="button" aria-pressed={s.key === seg}
          className={`mm-card ${s.key === seg ? 'on' : ''}`}
          onClick={() => setSeg(s.key)}
        >
          <b>{s.label}</b>
          <small>{s.desc}</small>
        </button>
      )))}
    </div>
  )
}

/* ---------- katalóg ---------- */

function ItemList({ items, onNavigate }) {
  return (
    <ul className="mm-list">
      {items.map((item) => (
        <li key={item.label}>
          <Link to={routeFor(item.label)} onClick={onNavigate}>
            <ProductIcon name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

// Vždy štyri stĺpce: tri línie + doplnkové služby. Dlhá línia (Podnikatelé
// majú 12 pojištění) rastie do výšky, nelomí sa do podstĺpcov - pri delení
// klesla šírka stĺpca na ~156px a názvy sa lámali na tri riadky.
function Columns({ seg, onNavigate }) {
  return (
    <div className="mm-cols">
      {PRIMARY.map((cat) => (
        <section className="mm-col" key={cat.key}>
          <h3>{cat.label}</h3>
          <ItemList items={MENU[seg][cat.key]} onNavigate={onNavigate} />
        </section>
      ))}
      <section className="mm-col mm-col--stack">
        {EXTRA.map((c) => (
          <div className="mm-colgrp" key={c.key}>
            <h3>{c.label}</h3>
            <ItemList items={MENU[seg][c.key]} onNavigate={onNavigate} />
          </div>
        ))}
      </section>
    </div>
  )
}

/* ---------- panel ---------- */

export default function MegaMenu({ seg, setSeg, cards, onNavigate }) {
  const s = SEGMENTS.find((x) => x.key === seg)
  const body = <Columns seg={seg} onNavigate={onNavigate} />

  if (setSeg && cards) {
    return (
      <div className="mm">
        <SegCards seg={seg} setSeg={setSeg} onNavigate={onNavigate} />
        {body}
      </div>
    )
  }

  if (setSeg) {
    return (
      <div className="mm mm--rail">
        <div className="mm-body">
          <SegSide seg={seg} setSeg={setSeg} onNavigate={onNavigate} />
          <div className="mm-main">{body}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mm">
      <div className="mm-head">
        <h2>{s.pro}</h2>
        <p>{s.desc}</p>
      </div>
      {body}
    </div>
  )
}
