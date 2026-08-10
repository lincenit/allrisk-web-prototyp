import { useEffect, useState } from 'react'
import { IconAdjustments, IconChevronDown } from '@tabler/icons-react'

// Ladiace „option" menu prototypu - floating panel vpravo dole.
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

// Voľba, ktorá musí prežiť preklik na inú stránku - ten istý prvok (napr. rad záložiek)
// žije na viacerých stránkach a porovnávať sa dá len vtedy, keď sa výber neresetuje.
export function useDebugOption(key, fallback) {
  const [value, setValue] = useState(() => localStorage.getItem(`dbg:${key}`) || fallback)

  // localStorage prežije preklik, ale nepovie o zmene komponentu, ktorý sa
  // práve nerenderuje. Panel Podnikatelé žije v hlavičke a jeho prepínač na
  // stránke - bez tejto udalosti by sa prepínač prepol a menu zostalo staré,
  // kým používateľ neobnoví stránku. (`storage` event nestačí: prehliadač ho
  // pošle len do iných kariet, nie do tej, ktorá zapisovala.)
  useEffect(() => {
    const onDbg = (e) => { if (e.detail?.key === key) setValue(e.detail.value) }
    window.addEventListener('dbg:change', onDbg)
    return () => window.removeEventListener('dbg:change', onDbg)
  }, [key])

  const set = (next) => {
    setValue(next)
    localStorage.setItem(`dbg:${key}`, next)
    window.dispatchEvent(new CustomEvent('dbg:change', { detail: { key, value: next } }))
  }
  return [value, set]
}

// wrap = viac možností, než sa zmestí do jedného riadku (zalomí do mriežky 2×N)
export function DebugGroup({ icon: Icon, label, value, onChange, options, wrap }) {
  return (
    <div className="switch-grp">
      <span className="lbl">{Icon && <Icon size={14} stroke={1.8} />} {label}</span>
      <div className={`opts${wrap ? ' opts-wrap' : ''}`}>
        {options.map((o) => (
          <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  )
}
