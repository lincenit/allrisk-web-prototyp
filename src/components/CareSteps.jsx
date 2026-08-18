import { useEffect, useRef, useState } from 'react'
import { asset } from '../asset.js'
import { CARE } from '../data/company.js'

// ============================================================
// SYSTÉM PÉČE O KLIENTA - štyri kroky.
//
// PREROBENÉ 2026-08-17 (user: „vyzerá to hrozne"). Predtým tu bola tlačová
// stuha prekreslená 1:1 do SVG - široký farebný cikcak cez celú sekciu.
// Prečo to nefungovalo, tri dôvody a všetky sú z briefu, nie z vkusu:
//
//   1. PRODUCT.md má medzi anti-referenciami doslova „loud expressive gradient
//      treatments" ako príliš mladé pre vážneho makléra. Sedemdesiat pixelov
//      hrubý azúrovo-fialový pás je presne to.
//   2. Značkový manuál hovorí o linke ako o KONTROLOVANOM akcente, ktorý
//      označuje kľúčové momenty - „it is never decoration". Stuha cez pol
//      sekcie bola najhlasnejší prvok stránky.
//   3. Sekcia stojí medzi dvoma modrými pásmi (čísla, kanály). Tretia farebná
//      plocha medzi nimi nemá kde dýchať; toto miesto má byť nádych.
//
// Čo z tlače zostáva: STÚPANIE. Krok po kroku vyššie, zľava doprava. Nesie ho
// vlásočnica v značkovom prechode - dva pixely namiesto sedemdesiatich - a
// stĺpce, ktoré na nej stoja. Je to jediné miesto na webe, kde značková linka
// niečo ZNAMENÁ (cesta klienta), nie je len ozdobou pásu.
//
// Geometria (prečo tie čísla sedia): stĺpec `i` má odsadenie zhora
// (3-i)·rise, takže vrchy stĺpcov ležia na jednej priamke. Linka je preto
// jedna úsečka z rohu do rohu schránky vysokej 4·rise, posunutej o -rise
// nahor. Zvislá čiarka pri každom čísle začína presne na nej.
// `preserveAspectRatio="none"` schránku roztiahne na akúkoľvek šírku a
// `vector-effect="non-scaling-stroke"` pritom udrží ťah na dvoch pixeloch.
//
// Tri podoby na priklik (panel vľavo dole):
//   obrazek - dodaná kresba `care-system.png` (predvolené od 2026-08-17 večer)
//   linka   - vlásočnica so štyrmi zastávkami
//   schody  - štyri karty stúpajúce doprava, bez linky
// ============================================================

// Odtieň kroku - `tone` z dát ukazuje na značkovú linku, nie na vlastnú farbu.
const TONES = {
  dark: 'var(--line-1)', cyan: 'var(--line-2)',
  purple: 'var(--line-3)', violet: 'var(--line-4)',
}

// Štyri zastávky značkového prechodu CORE. SVG si ich musí zopakovať, lebo
// CSS gradient sa nedá dať do `stroke` (rovnako to rieši Ecosystem.jsx).
// Posledné dve zastávky sú tá istá farba, len druhá je priehľadná: trasa sa
// vpravo stráca do stránky, lebo „následná péče" posledným krokom nekončí.
// Blednutie je TU, nie ako `mask-image` v CSS: maska sa predvolene opakuje,
// takže za ľavým okrajom schránky pokračovala priehľadným koncom a odhryzla
// zaoblený začiatok stuhy aj s bielym bodom prvej zastávky.
const STOPS = [
  ['0%', '#0021E5', 1], ['35%', '#01C7FF', 1], ['70%', '#8806E4', 1],
  ['86%', '#571483', 1], ['100%', '#571483', 0],
]

// ---- trasa medzi zastávkami ------------------------------------------------
// Obe kreslené podoby majú zastávky na tých istých miestach: krok `i` stojí
// vodorovne na `i·25 %` a zvisle o stupeň vyššie než predošlý. Líši sa len to,
// čím sú spojené - a podľa toho aj výška schránky, do ktorej sa SVG kreslí.
//
//   linka  schránka 4 stupne (od -1 do 3), zastávky presne v rohoch
//          uhlopriečky - rovná úsečka, dva pixely
//   vlna   schránka o stupeň vyššia (5), aby sa do nej zmestil výkyv;
//          zastávky preto padnú na 80/60/40/20. Medzi nimi sa trasa strieda
//          dole-hore-dole (kvadratické oblúky s riadiacim bodom 48 jednotiek
//          od tetivy = výkyv 24 jednotiek na každú stranu). Ťah je hrubý,
//          takže výkyv musí byť výrazne väčší než on sám - inak sa vlna
//          v hrúbke stuhy stratí a vyjde z nej rovná šmuha.
//
// Prečo kvadratické `Q` a nie hladké `S`: pri esíčku si riadiace body ťahajú
// krivku proti sebe a na klesajúcej trase sa výkyv takmer vyruší (zmerané:
// z 20 jednotiek zostali 2,6). `Q` s bodom nad/pod tetivou dá presne polovicu
// odsadenia ako výkyv, čiže sa dá spočítať dopredu.
// Riadiaci bod je vždy 48 jednotiek od stredu tetivy (70 → 118, 50 → 2,
// 30 → 78); chvost za poslednou zastávkou má výkyv menší, aby nevyšiel von
// zo schránky. Krajné hodnoty krivky: 94 dole, 1,5 hore - obe vnútri 0-100.
const WAVE = 'M0,80 Q12.5,118 25,60 Q37.5,2 50,40 Q62.5,78 75,20 Q87.5,-10 100,6'

export default function CareSteps({ variant = 'linka' }) {
  const box = useRef(null)
  // Kreslenie linky beží až keď sekcia príde do záberu. `reveal` sa zapína v
  // efekte, takže bez JS (aj v prehliadači, ktorý efekt nespustí) je linka
  // rovno celá - animácia vylepšuje viditeľný stav, nepodmieňuje ho.
  const [reveal, setReveal] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (variant !== 'linka' && variant !== 'vlna') return undefined
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
  }, [variant])

  // Dodaná kresba (user nahral `care-system.png` 2026-08-17 večer a vypýtal si
  // ju priamo - je to predvolená podoba sekcie). Nahradila starý výrez z PDF
  // (`pece.jpg`). Biele pozadie je zo súboru vypálené do priehľadnosti, takže
  // about.css ho už nemusí čistiť blendom `multiply` - odstraňovalo sa
  // záplavovým vyplnením od okrajov, aby biele ikony vnútri stuhy zostali
  // biele a nie dierami.
  // Nadpis, čísla aj popisy sú súčasťou kresby, preto ich `alt` vypisuje
  // z dát - obrázok bez textovej náhrady by sekciu vyprázdnil.
  if (variant === 'obrazek') {
    return (
      <figure className="ab-care-img">
        <img
          src={asset('/o-nas/care-system.png')}
          alt={`Systém péče o klienta ve čtyřech krocích: ${CARE.map((s, i) => `${i + 1}. ${s.label} - ${s.desc}`).join('; ')}.`}
          loading="lazy"
        />
      </figure>
    )
  }

  return (
    <div
      className={`care care--${variant}${reveal ? ' care--reveal' : ''}${seen ? ' is-in' : ''}`}
      ref={box}
    >
      {(variant === 'linka' || variant === 'vlna') && (
        // Trasa je dekorácia významu, nie obsah - poradie krokov nesie <ol>.
        <svg className="care-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="care-line-grad" x1="0" y1="0" x2="1" y2="0">
              {STOPS.map(([o, c, a]) => <stop key={o} offset={o} stopColor={c} stopOpacity={a} />)}
            </linearGradient>
          </defs>
          {/* POZOR: kreslenie trasy sa NESMIE robiť cez stroke-dasharray.
              `vector-effect:non-scaling-stroke` počíta ťah v obrazovkových
              pixeloch, kým `pathLength` normalizuje v používateľských - dohromady
              z linky vyjde bodkovaná čiara. Odhalenie preto rieši clip-path
              na celom SVG (about.css).
              Hrúbku aj zakončenie nesie CSS, nie atribút: je to jediný rozdiel
              medzi oboma podobami a patrí k nim. */}
          <path
            d={variant === 'vlna' ? WAVE : 'M0,100 L100,0'}
            fill="none" stroke="url(#care-line-grad)" vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      <ol className="care-steps">
        {CARE.map((s, i) => (
          <li className="care-step" key={s.key} style={{ '--i': i, '--tone': TONES[s.tone] }}>
            {/* zvislá čiarka visí z linky a je jediné farebné miesto kroku */}
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
