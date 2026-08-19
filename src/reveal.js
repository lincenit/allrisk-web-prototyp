// ============================================================
// PRÍCHOD OBSAHU - sekcie sa pri doscrollovaní vynoria, nestoja tam odjakživa.
//
// Jeden motor pre celý web, nie animácia dopísaná po jednej stránke: sekcia má
// na každej stránke ten istý tvar (`.sec` + hlavička + mriežka), takže aj jej
// príchod musí byť jeden. Nasadzuje sa z App.jsx cez `useReveal()`.
//
// JEDNA PODOBA, BEZ VARIANTOV (user, 2026-08-19: „nechaj iba bloky, ostatné
// varianty zmaž"). Hlavička aj celá mriežka prídu naraz ako jeden blok, zdvih
// zdola o 18 px. Predtým tu boli ešte dve podoby a vypínač v ladiacom paneli -
// `Prvky` (rad dlaždíc kus po kuse, aj s hľadaním radov v DOM) a `Závoj`
// (odkrytie zdola cez clip-path). Sú v gite, tu už nie.
//
// PRAVIDLÁ, KTORÉ DRŽIA CELÝ SÚBOR:
//
//   1. ANIMÁCIA VYLEPŠUJE VIDITEĽNÝ STAV, NEPODMIEŇUJE HO. Skrýva až JS a len
//      vtedy, keď vie aj odkryť (IntersectionObserver). Bez JS a so systémovým
//      „obmedziť pohyb" je obsah rovno celý - motor sa vtedy ani nespustí.
//      To isté robí CareSteps.jsx so svojou vlastnou cestou krokov.
//   2. PO DOBEHNUTÍ PO SEBE UPRACE. Trieda `.rv` aj `.rv-in` idú v `animationend`
//      preč, takže na prvku nezostane `transform`. Zostávajúci transform robí
//      z prvku obsahujúci blok pre `position:sticky/fixed` vnútri (bočné stĺpce
//      detailových stránok) a ticho by ich rozbil.
//   3. NIKDY NESKRYŤ NIEČO, ČO SA NEMUSÍ VRÁTIŤ. Preto sa nesiaha na ozdoby
//      (`aria-hidden`) ani na hero - ten je nad ohybom a má vlastný život -
//      a preto má observer záchrannú sieť pri scrollovaní (viď `catchUp`).
// ============================================================
import { useLayoutEffect, useState } from 'react'

// Sekcia = koreň príchodu. `.sec` je tvar celého webu a od 2026-08-19 jediný:
// `.phil` (filozofia na úvode) bol jediný pás bez nej a sekcia je zmazaná.
// Hero (`.hero`, `.phero`, `.page-head`) tu zámerne nie je: stojí nad ohybom,
// takže by sa „vynorilo" hneď pri načítaní a čakalo by sa naň, kým sa načíta
// fotka alebo video pod ním.
const ROOTS = '.sec'

// Čo sa neskrýva ani keď to v sekcii stojí: ozdoby (kružnice, stuha - nesú
// `aria-hidden`), blok s vlastnou animáciou (systém péče) a ladiaci panel.
const SKIP = '[aria-hidden="true"],[data-rv-skip],.care,.switch'

const STEP = 70         // odstup blokov v sekcii; hlavička ide prvá, mriežka za ňou
const MAX_DELAY = 420   // posledný blok nesmie čakať na svoje poradie

// Prvok bez rozmeru (`display:none` - napr. pätička karuselu, ktorá je len na
// mobile). Observer sa naň nemá kde chytiť, takže by ostal skrytý; nechať ho
// tak, ako je, je vždy bezpečnejšie než ho skryť a čakať na odkrytie.
const hidden = (el) => !el.getClientRects().length

// Čo sa v jednej sekcii hýbe: jej priame deti (hlavička, mriežka, pás).
const targetsFor = (root) => [...root.children].filter((el) => !el.matches(SKIP) && !hidden(el))

const clear = (el) => {
  el.classList.remove('rv', 'rv-in')
  el.style.removeProperty('--rv-d')
}

export function useReveal() {
  // Prepnutie systémového „obmedziť pohyb" musí motor vypnúť okamžite, nie až
  // po obnovení stránky - preto sa naň prekresľuje.
  const [tick, bump] = useState(0)

  // useLayoutEffect, nie useEffect: skrývať sa musí v tom istom snímku, v akom
  // React vykreslil sekcie. Po vykreslení by prehliadač stihol ukázať obsah
  // a hneď ho schovať, čiže preblik pri každom otvorení stránky.
  useLayoutEffect(() => {
    const html = document.documentElement
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => bump((n) => n + 1)
    mq.addEventListener('change', onMq)

    const off = () => { mq.removeEventListener('change', onMq) }
    if (mq.matches || !('IntersectionObserver' in window)) {
      delete html.dataset.rv
      return off
    }
    // Príznak pre CSS: skryté je len to, čo tento motor aj vie odkryť.
    html.dataset.rv = 'on'

    // Spustenie príchodu. Okrem triedy sa nasadzuje aj poistka na upratanie:
    // `animationend` nepríde, keď prvok medzitým zmizne z rozvrhu (zbalená
    // záložka, prepnuté publikum) a bez upratania by na ňom zostal transform.
    // 1400 ms je s rezervou nad najdlhším príchodom (0,58 s + 0,42 s odklad).
    const enter = (el) => {
      if (el.classList.contains('rv-in')) return
      el.classList.add('rv-in')
      io.unobserve(el)
      setTimeout(() => clear(el), 1400)
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) enter(e.target)
    }, { rootMargin: '0px 0px -8% 0px' })

    // Záchranná sieť k pravidlu 3. Observer stráca prehľad o prvku, ktorý React
    // medzitým vybral z dokumentu a vrátil späť (prepnutie publika prekreslí pol
    // úvodnej stránky), a taký prvok by ostal neviditeľný navždy. Preto sa pri
    // každom scrollovaní dopočíta zvyšok - množina `.rv` sa cestou dolu zmenšuje
    // na prázdnu, takže je to lacné.
    const catchUp = () => {
      const edge = window.innerHeight * .92
      for (const el of document.querySelectorAll('.rv:not(.rv-in)')) {
        if (el.getBoundingClientRect().top < edge) enter(el)
      }
    }
    let queued = false
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => { queued = false; catchUp() })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Upratovanie po dobehnutí (pravidlo 2). Jeden poslucháč na dokumente, nie
    // jeden na každý prvok - prvkov je na stránke aj dvesto.
    const onEnd = (e) => {
      const el = e.target
      if (el instanceof Element && el.classList.contains('rv-in')) clear(el)
    }
    document.addEventListener('animationend', onEnd, true)

    // Sekcia sa spracuje raz (`data-rv-root`). Keď React neskôr prekreslí jej
    // vnútro (prepnutie publika, záložky, rozbalenie), nové uzly už zostanú
    // rovno viditeľné - radšej sekcia bez animácie než sekcia bez obsahu.
    const scan = () => {
      for (const sec of document.querySelectorAll(ROOTS)) {
        if (sec.dataset.rvRoot) continue
        sec.dataset.rvRoot = '1'
        targetsFor(sec).forEach((el, i) => {
          el.classList.add('rv')
          el.style.setProperty('--rv-d', `${Math.min(i * STEP, MAX_DELAY)}ms`)
          io.observe(el)
        })
      }
    }
    scan()

    // Nové sekcie prídu s každým preklikom na inú stránku. MutationObserver ich
    // chytí ešte pred vykreslením (callback beží ako mikrotask), takže ani tu
    // nie je preblik. Sleduje sa len pribúdanie uzlov - triedy, ktoré motor sám
    // nasadzuje, sú atribúty a slučku nespustia.
    const mo = new MutationObserver((recs) => {
      if (!recs.some((r) => r.addedNodes.length)) return
      scan()
      onScroll()   // prekreslenie mohlo posunúť zvyšok stránky do výrezu
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      off()
      mo.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('animationend', onEnd, true)
      for (const el of document.querySelectorAll('[data-rv-root]')) delete el.dataset.rvRoot
      for (const el of document.querySelectorAll('.rv')) clear(el)
      delete html.dataset.rv
    }
  }, [tick])
}
