// Zvolené publikum (jednotlivci a rodiny / podnikatelé / města a obce) ako stav
// CELÉHO webu, nie hlavičky.
//
// Prečo tu a nie v SiteHeaderi: prepínač publika v lište (verzia hlavičky
// „kontext") nemá zmysel, kým sa po jeho prepnutí na stránke nič nezmení -
// user to na prototype hneď našiel: „nič sa nedeje, keď ho prepnem". Výber
// preto musí vedieť prečítať aj stránka pod hlavičkou (úvod prepína rozcestník)
// a musí prežiť preklik na inú stránku.
//
// Mechanika je tá istá ako pri useDebugOption: localStorage prežije preklik,
// ale nepovie o zmene komponentu, ktorý sa práve nerenderuje, takže zmenu
// rozposiela vlastná udalosť. (`storage` event nestačí - prehliadač ho pošle
// len do INÝCH kariet, nie do tej, ktorá zapisovala.)
import { useEffect, useState } from 'react'

const KEY = 'wfSeg'
const EVENT = 'seg:change'
export const SEG_DEFAULT = 'rodiny'

export function readSegment() {
  return localStorage.getItem(KEY) || SEG_DEFAULT
}

export function setSegment(next) {
  localStorage.setItem(KEY, next)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }))
}

// Odber zmeny publika pre kód MIMO Reactu (dekorácie sa losujú v module, nie
// v komponente - viď decorPick.js). Vracia odhlásenie, aby sa dal odber zrušiť.
export function onSegmentChange(fn) {
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}

export function useSegment() {
  const [seg, setSeg] = useState(readSegment)

  useEffect(() => {
    const onChange = (e) => setSeg(e.detail)
    window.addEventListener(EVENT, onChange)
    return () => window.removeEventListener(EVENT, onChange)
  }, [])

  return [seg, setSegment]
}

// Stránka, ktorá JE jedným publikom, si výber nastaví sama - kto príde na
// /podnikatele z Googlu, nemá dôvod ešte niečo prepínať a prepínač v lište by
// inak tvrdil niečo iné, než čo má človek pred sebou.
export function useSegmentPage(seg) {
  useEffect(() => {
    if (seg && readSegment() !== seg) setSegment(seg)
  }, [seg])
}
