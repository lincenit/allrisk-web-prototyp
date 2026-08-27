import { IconMapPin } from '@tabler/icons-react'
import './BranchMap.css'
import { BRANCHES } from '../data/branches.js'

// ============================================================
// MAPA POBOČEK - štylizovaná kresba ČR s pinmi.
//
// SEKCIU NENESIE, nesie len samotnú mapu: na /kontakt stojí ako pás nad
// záložkami, na úvode vnútri sekcie „Kde nás najdete". Rozvrh okolo nej patrí
// stránke, kresba komponentu.
//
// DVE MIESTA od 2026-08-27 (predtým žila priamo v pages/Contact.jsx). Preto je
// z nej komponent - druhá kópia tej istej mriežky a tých istých pinov by sa
// s prvou raz rozišla, a piny sa rátajú z jedných dát (data/branches.js).
//
// `pins` je voliteľné: bez neho sa vykreslí pin na každej pobočke. /kontakt si
// ich počíta sám - filtruje ich hľadanie a na záložke Poradci sa zlučujú do
// zhluku s počtom (`count`).
//
// Je to KRESBA, nie tile provider: podklad je preliv a mriežka, polohu nesú
// dáta (`map: [left %, top %]`). Nič sa nesťahuje, nič sa nemôže nenačítať.
// ============================================================

const ALL = BRANCHES.map((b) => ({ slug: b.slug, map: b.map, title: b.city }))

export default function BranchMap({ pins = ALL, label = 'Mapa poboček Allrisk po ČR', className = '' }) {
  return (
    <div className={`cmap ${className}`.trim()} role="img" aria-label={label}>
      {pins.map((p) => (
        <span className="cmap-pin" key={p.slug} style={{ left: `${p.map[0]}%`, top: `${p.map[1]}%` }} title={p.title}>
          <IconMapPin size={30} stroke={1.9} />
          {p.count > 1 && <i className="cmap-count">{p.count}</i>}
        </span>
      ))}
    </div>
  )
}
