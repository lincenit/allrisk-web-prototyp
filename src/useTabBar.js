import { useEffect, useRef } from 'react'
import { attachDragScroll } from './dragScroll.js'

// Vodorovný rad záložiek (.tabbar) drží aktívnu záložku vo výreze.
// Na mobile sa do šírky zmestia 2-3 taby, takže bez tohto po prepnutí často nevidno,
// ktorá je vybraná - a po scrollnutí späť hore je rad odrolovaný inde, než ho človek nechal.
// Prvé nastavenie je bez animácie (žiadny pohyb pri načítaní stránky), ďalšie plynulé.
export function useTabBar(activeKey) {
  const ref = useRef(null)
  const first = useRef(true)

  useEffect(() => {
    const bar = ref.current
    const on = bar?.querySelector('.on')
    if (!bar || !on) return
    // posúva sa vnútorná dráha, nie obal - ten drží odsadenie a fokusový prstenec
    const box = bar.querySelector('.tabbar-track') || bar
    // aktívny tab vycentrujeme; keď sa celý rad zmestí, scrollTo nič neurobí
    const left = Math.max(0, on.offsetLeft - (box.clientWidth - on.offsetWidth) / 2)
    box.scrollTo({ left, behavior: first.current ? 'auto' : 'smooth' })
    first.current = false
  }, [activeKey])

  // Rad sa dá aj chytiť myšou a potiahnuť - tá istá logika ako v carouseli referencií.
  // Posuvný je vnútorný .tabbar-track, u dlaždíc profilov (.prof-tabs) samotný obal.
  useEffect(() => {
    const bar = ref.current
    if (!bar) return
    return attachDragScroll(bar.querySelector('.tabbar-track') || bar)
  }, [])

  return ref
}
