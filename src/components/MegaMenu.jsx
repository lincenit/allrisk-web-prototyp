/* ============================================================
   MegaMenu - rozbaľovací katalóg hlavičky. Vie dve kostry:

   `cats` (pole línií) → VEĽKÝ panel „Produkty": línie vedľa seba v stĺpcoch,
                         na plnú šírku obsahu. Od 2026-08-18 je to hlavná
                         podoba (user: „produkty môžeme dať pod jedno Produkty,
                         tak ako to bolo") - päť položiek v lište zožralo celý
                         spodný pás a publikum sa v ňom stratilo.
   `cat`  (jedna línia) → úzky stĺpec odkazov pod tlačidlom svojej línie.
                         Zostáva pre línie, ktoré vo variante `pruh` stoja
                         v lište samostatne (Klientský servis, EFFECTIVE).

   Panel nesie IBA položky a názvy stĺpcov - žiadny nadpis publika, žiadna
   popisná veta (user, 2026-08-11: „len kartičky produktov, nepotrebuje to názov
   ani text, iba vylistovanie a rovno pod sebou"). Ktoré publikum to je, hovorí
   zvolená záložka o pár pixelov vyššie.
   ============================================================ */
import { Link } from 'react-router-dom'
import ProductIcon from './ProductIcon.jsx'
import { itemsFor } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import './MegaMenu.css'

const Item = ({ item, onNavigate }) => (
  <li>
    <Link className="mm-item" to={routeFor(item.label)} onClick={onNavigate}>
      <ProductIcon name={item.icon} size={22} />
      <span>{item.label}</span>
    </Link>
  </li>
)

export default function MegaMenu({ seg, cat, cats, onNavigate }) {
  /* ---- veľký panel: línie ako stĺpce ---- */
  if (cats) {
    // Línia bez položiek stĺpec nedostane - prázdny nadpis v rade štyroch
    // vyzerá ako chyba dát, nie ako „tu nič nemáme".
    const cols = cats.map((c) => ({ ...c, items: itemsFor(seg, c.key) })).filter((c) => c.items.length)
    if (!cols.length) return null
    return (
      <div className="mm mm--all hdr-dd--anim">
        <div className="mm-in" style={{ '--mm-cols': cols.length }}>
          {cols.map((c) => (
            <section className="mm-col" key={c.key}>
              <h3>{c.label}</h3>
              <ul className="mm-list">
                {c.items.map((item) => <Item key={item.label} item={item} onNavigate={onNavigate} />)}
              </ul>
            </section>
          ))}
        </div>
      </div>
    )
  }

  /* ---- úzky panel jednej línie ---- */
  const items = itemsFor(seg, cat)
  // Línia bez položiek sa v lište nemá čím otvoriť a hlavička sa na to pýta.
  if (!items.length) return null
  return (
    <div className="mm hdr-dd--anim">
      <ul className="mm-list">
        {items.map((item) => <Item key={item.label} item={item} onNavigate={onNavigate} />)}
      </ul>
    </div>
  )
}
