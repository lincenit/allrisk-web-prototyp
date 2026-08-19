import { useEffect, useRef, useState } from 'react'
import { CARE } from '../data/company.js'

// ============================================================
// SYSTÉM PÉČE O KLIENTA - štyri kroky ako štyri karty v rade.
//
// JEDNA PODOBA, BEZ VARIANTOV (user, 2026-08-19: „nechaj karty s úsekom,
// odstráň všetky ostatné varianty"). Predtým tu žilo osem podôb naraz -
// dodaná kresba z tlače, vlásočnica so zastávkami, vlnitá stuha, schody
// z kariet a tri podoby hrubého stúpajúceho pásu. Sú v gite, tu už nie.
//
// Čo z tej cesty zostalo ako pravidlo sekcie:
//
//   1. KAŽDÝ KROK MÁ SVOJU FARBU (`tone` z dát ukazuje na značkovú linku).
//      Plynulý prechod cez celú sekciu farby rozlieval, takže sa nedalo
//      povedať, kde končí druhý krok a začína tretí.
//   2. FARBA JE ÚSEK LINKY, nie ozdoba. V karte je prvým prvkom obsahu -
//      stojí v jej paddingu ako všetko ostatné a má zaoblené konce, takže
//      rad kariet číta ako štyri zastávky jednej cesty. Pás od okraja po
//      okraj cez vrch karty user zamietol: to je zvýrazňovač na dlaždici.
//   3. TICHO. Sekcia stojí medzi dvoma modrými pásmi, takže tu nemá čo robiť
//      tretia veľká farebná plocha - PRODUCT.md menuje medzi anti-referenciami
//      „loud expressive gradient treatments" a značkový manuál hovorí o linke
//      ako o kontrolovanom akcente („it is never decoration"). Preto je z celej
//      značkovej linky v sekcii len osem pixelov na kartu.
//
// V úzkom okne sa karty rozpadnú na zvislú cestu: farebný kus si nesie každý
// krok sám a zastávka je na ňom biely bod. Nie je to náhradný rozvrh - rad
// zľava doprava sa na 380px nedá zahrať a cesta zhora nadol hovorí to isté.
// ============================================================

// Odtieň kroku - `tone` z dát ukazuje na značkovú linku, nie na vlastnú farbu.
const TONES = {
  dark: 'var(--line-1)', cyan: 'var(--line-2)',
  purple: 'var(--line-3)', violet: 'var(--line-4)',
}

export default function CareSteps() {
  const box = useRef(null)
  // Úseky sa kreslia zľava doprava, keď sekcia príde do záberu. `reveal` sa
  // zapína až v efekte, takže bez JS (aj v prehliadači, ktorý efekt nespustí)
  // sú rovno celé - animácia vylepšuje viditeľný stav, nepodmieňuje ho.
  const [reveal, setReveal] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    setReveal(true)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setSeen(true)
      io.disconnect()
    }, { threshold: .35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className={`care${reveal ? ' care--reveal' : ''}${seen ? ' is-in' : ''}`} ref={box}>
      <ol className="care-steps">
        {CARE.map((s, i) => (
          <li className="care-step" key={s.key} style={{ '--i': i, '--tone': TONES[s.tone] }}>
            {/* úsek cesty vo farbe kroku; v úzkom okne z neho zostane biely
                bod na zvislej ceste, ktorú kreslí `.care-step::before` */}
            <span className="care-tick" aria-hidden="true" />
            <span className="care-no">{i + 1}.</span>
            <b>{s.label}</b>
            <small>{s.desc}</small>
          </li>
        ))}
      </ol>
    </div>
  )
}
