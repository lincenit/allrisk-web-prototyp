// Jeden rad záložiek pre celý web. Ten istý prepínač nesie produkty na /vozidla
// aj modelové situácie na profile klienta - je to tá istá vec, tak je to aj ten istý
// komponent (predtým žili dve zhodné kópie: .veh-tab vo vehicles.css a .sit-tab
// v profile.css, ktoré sa museli udržiavať synchrónne ručne).
//
// `variant` mení iba vizuál (definície v wireframe.css), nikdy nie správanie:
//   seg  - segmentový prepínač v svetlomodrej schránke (predvolený)
//   card - dlaždice s ikonou v odznaku a špičkou do panelu
import { useTabBar } from '../useTabBar.js'

// väčší variant kreslí ikonu väčšiu - v dlaždici by 18px pôsobilo stratene
const IC_SIZE = { card: 22 }

export default function TabBar({ items, value, onChange, variant = 'seg', label }) {
  // lišta je sticky pod headerom a drží aktívnu záložku vo výreze
  const ref = useTabBar(`${variant}:${value}`)
  const size = IC_SIZE[variant] || 18
  return (
    <div className={`tabbar tabs-${variant}`} ref={ref}>
      <div className="tabbar-track" role="tablist" aria-label={label}>
        {items.map((it) => {
          const Ic = it.icon
          return (
            <button
              key={it.key} type="button" role="tab" aria-selected={value === it.key}
              className={`tab ${value === it.key ? 'on' : ''}`}
              onClick={() => onChange(it.key)}
            >
              {Ic && <span className="tab-ic"><Ic size={size} stroke={1.8} /></span>}
              <span className="tab-lb">{it.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
