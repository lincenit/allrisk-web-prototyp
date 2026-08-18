/* ============================================================
   MegaMenu - panel JEDNEJ obchodnej línie. Úzky stĺpec odkazov, visí pod
   tlačidlom svojej línie v spodnom páse hlavičky.

   Panel nesie IBA položky - žiadny nadpis publika, žiadna popisná veta (user,
   2026-08-11: „len kartičky produktov, nepotrebuje to názov ani text, iba
   vylistovanie a rovno pod sebou").

   Do 2026-08-12 mal aj druhý režim: bez `cat` kreslil VEĽKÝ panel „Produkty"
   s celým katalógom v štyroch stĺpcoch. Patril k verzii hlavičky `jeden`
   a odišiel s ňou; v gite ho nájdeš.
   ============================================================ */
import { Link } from 'react-router-dom'
import ProductIcon from './ProductIcon.jsx'
import { itemsFor } from '../data/menu.js'
import { routeFor } from '../productRoutes.js'
import './MegaMenu.css'

export default function MegaMenu({ seg, cat, onNavigate }) {
  const items = itemsFor(seg, cat)
  // Línia bez položiek sa v lište nemá čím otvoriť a hlavička sa na to pýta.
  if (!items.length) return null
  return (
    <div className="mm hdr-dd--anim">
      <ul className="mm-list">
        {items.map((item) => (
          <li key={item.label}>
            <Link className="mm-item" to={routeFor(item.label)} onClick={onNavigate}>
              <ProductIcon name={item.icon} size={22} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
