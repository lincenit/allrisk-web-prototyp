import { useState } from 'react'
import { IconAdjustments, IconChevronDown } from '@tabler/icons-react'

// Ladiace „option" menu prototypu — floating panel vpravo dole.
// Zbaliteľné (stav v localStorage), reusable naprieč stránkami.
// Do <DebugPanel> vkladáš ľubovoľný počet <DebugGroup> (segmentovaný prepínač).

export function DebugPanel({ title = '', children }) {
  const [open, setOpen] = useState(() => localStorage.getItem('wfSwitch') !== 'closed')
  const toggle = () => {
    const n = !open
    setOpen(n)
    localStorage.setItem('wfSwitch', n ? 'open' : 'closed')
  }
  return (
    <div className={`switch${open ? '' : ' collapsed'}`}>
      <button className="switch-head" onClick={toggle} aria-expanded={open}>
        <span className="switch-title"><IconAdjustments size={14} stroke={1.8} />{title && ` ${title}`}</span>
        <IconChevronDown size={16} stroke={2} className="switch-caret" />
      </button>
      <div className="switch-body">{children}</div>
    </div>
  )
}

export function DebugGroup({ icon: Icon, label, value, onChange, options }) {
  return (
    <div className="switch-grp">
      <span className="lbl">{Icon && <Icon size={14} stroke={1.8} />} {label}</span>
      <div className="opts">
        {options.map((o) => (
          <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  )
}
