import { useEffect } from 'react'

// Ťahanie myšou po vodorovne posuvnom rade. Prst na dotyku scrolluje sám a klávesnica
// má fokus, ale myš nemá ako rad posunúť: koliesko točí stránkou, nie radom, a šípky
// má len carousel referencií. Preto sa dá rad chytiť a potiahnuť.
//
// Používa to každý vodorovný scroller na webe – rad záložiek (.tabbar-track), dlaždice
// profilov na produktovej stránke (.prof-tabs) aj carousel referencií (.refs-track).
// Keby pribudol ďalší, stačí naň zavesiť useDragScroll.
export function attachDragScroll(el) {
  if (!el) return () => {}

  let startX = 0, startLeft = 0, moved = false, dragging = false

  const move = (e) => {
    const dx = e.clientX - startX
    // prah oddeľuje ťah od kliku – bez neho by posun o pixel pri kliknutí prepol
    // záložku, na ktorú človek vôbec nemieril
    if (Math.abs(dx) > 4) moved = true
    el.scrollLeft = startLeft - dx
    e.preventDefault() // inak ťah označuje text v kartičkách
  }

  const stop = () => {
    if (!dragging) return
    dragging = false
    el.classList.remove('dragging')
    // Snap vraciame až tu a rovno necháme rad dosadnúť: pri `mandatory` skončí každý
    // programový scroll na snap bode, takže scrollTo na aktuálnu pozíciu s `smooth`
    // doklzne na najbližšiu kartu. Bez toho by rad zastal uprostred kartičky.
    el.style.scrollSnapType = ''
    if (moved) el.scrollTo({ left: el.scrollLeft, behavior: 'smooth' })
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', stop)
    window.removeEventListener('pointercancel', stop)
  }

  const down = (e) => {
    // len ľavé tlačidlo myši; dotyk a pero si scrollujú natívne
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    // keď sa rad celý zmestí, nie je kam ťahať – nechceme kurzor, čo klame
    if (el.scrollWidth <= el.clientWidth) return
    dragging = true
    moved = false
    startX = e.clientX
    startLeft = el.scrollLeft
    // Snap vypíname inline, nie triedou: carousel referencií ho má z `.site .refs-track`,
    // čo je vyššia špecificita než čokoľvek, čo sem vieme dať triedou. So zapnutým
    // `mandatory` snapom by rad každý posun okamžite strhol späť a ťah by drhol.
    el.style.scrollSnapType = 'none'
    el.classList.add('dragging')
    // poslucháči na window, nie pointer capture: ťah často skončí mimo radu
    // a capture navyše mieša cieľ následného kliku
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  // klik po ťahaní zahodíme v capture fáze, teda skôr, než sa dostane k tlačidlu
  const click = (e) => {
    if (!moved) return
    moved = false
    e.preventDefault()
    e.stopPropagation()
  }

  // Kurzor „grab" je jediné, čo o ťahaní vopred prezradí – ale len keď je rad naozaj
  // posuvný, inak by sľuboval pohyb, ktorý sa nekoná. Šírka sa mení pri resize okna
  // aj pri výmene obsahu (iný profil = iné záložky), preto obe sledujeme.
  const syncDraggable = () => el.classList.toggle('can-drag', el.scrollWidth > el.clientWidth)
  syncDraggable()
  const ro = new ResizeObserver(syncDraggable)
  ro.observe(el)
  const mo = new MutationObserver(syncDraggable)
  mo.observe(el, { childList: true, subtree: true, characterData: true })

  el.addEventListener('pointerdown', down)
  el.addEventListener('click', click, true)

  return () => {
    ro.disconnect()
    mo.disconnect()
    el.removeEventListener('pointerdown', down)
    el.removeEventListener('click', click, true)
    stop()
  }
}

// Ref mieri rovno na posuvný element.
export function useDragScroll(ref) {
  useEffect(() => attachDragScroll(ref.current), [ref])
}
