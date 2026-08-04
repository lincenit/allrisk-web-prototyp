/* ============================================================
   MegaMenu — panel „Produkty".

   Layout je jediný: vľavo modrý panel s výberom segmentu, vpravo štyri
   stĺpce. Tri obchodné línie (Pojištění / Reality / Finance) sú stĺpce,
   dve doplnkové služby stoja nad sebou v poslednom. Žiadny spodný pás,
   žiadna karta poradcu, žiadne počty pri kategóriách.

   Spoločné pravidlo: obsah NIKDY neprepína hover, len klik. Pôvodný rail
   sa prepínal na onMouseEnter, takže cesta kurzora preblikla všetky
   kategórie — to je defekt, ktorý tu riešime.
   ============================================================ */
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductIcon from './ProductIcon.jsx'
import { MENU, CATS, SEGMENTS } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import './MegaMenu.css'

const PRIMARY = CATS.filter((c) => c.primary)
const EXTRA = CATS.filter((c) => !c.primary)

// Popisok v modrom paneli je statický — nemení sa so segmentom. Hovorí,
// čo panel je a čo sa od používateľa čaká, nie čo je práve zvolené.
// TODO(copy): finálne znenie od klienta.
export const SIDE_TITLE = 'Produkty'
export const SIDE_TEXT = 'Vyberte si, pro koho službu hledáte. Nabídka se tomu přizpůsobí.'

/* ---------- výber segmentu ---------- */

// Roving tabindex: šípky prechádzajú segmenty, Tab ide preč z celej skupiny.
function SegSide({ seg, setSeg }) {
  const ref = useRef(null)

  const onKeyDown = (e) => {
    const i = SEGMENTS.findIndex((s) => s.key === seg)
    const last = SEGMENTS.length - 1
    let n = null
    if (e.key === 'ArrowDown') n = i === last ? 0 : i + 1
    else if (e.key === 'ArrowUp') n = i === 0 ? last : i - 1
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = last
    if (n === null) return
    e.preventDefault()
    setSeg(SEGMENTS[n].key)
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
        {SEGMENTS.map((s) => (
          <button
            key={s.key} type="button" role="tab"
            aria-selected={s.key === seg} tabIndex={s.key === seg ? 0 : -1}
            className={s.key === seg ? 'on' : ''}
            onClick={() => setSeg(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mm-side-tx">
        <h2 className="mm-side-h">{SIDE_TITLE}</h2>
        <p className="mm-side-p">{SIDE_TEXT}</p>
      </div>
    </div>
  )
}

/* ---------- stĺpce ---------- */

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
// majú 12 pojištění) rastie do výšky, nelomí sa do podstĺpcov — pri delení
// klesla šírka stĺpca na ~156px a názvy sa lámali na tri riadky.
function Columns({ seg, onNavigate }) {
  return (
    <div className="mm-cols" key={seg}>
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

export default function MegaMenu({ seg, setSeg, onNavigate }) {
  return (
    <div className="mm">
      <div className="mm-body">
        <SegSide seg={seg} setSeg={setSeg} />
        <Columns seg={seg} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
