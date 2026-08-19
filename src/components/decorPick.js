import { useLayoutEffect, useRef, useState } from 'react'
import { onSegmentChange } from '../segment.js'

// ============================================================
// LOSOVANIE DEKORÁCIÍ - spoločné pre kružnice (<Decor>) aj stuhu (<Line>).
//
// Zadanie (user, 2026-08-17): pri každom načítaní stránky iné kresby. Do toho dňa
// vyberal súbor hash z `pathname`, takže stránka mala navždy tú istú dvojicu.
// Od 2026-08-19 k tomu pribudlo druhé rozdanie: prepnutie publika v hlavičke
// (rodiny / podnikatelé / města) je pre úvod nová stránka, tak nech dostane aj
// novú kresbu.
//
// PREČO NIE `Math.random()` V KOMPONENTE. Dva dôvody, oba sa prejavia hneď:
//   1. V tele komponentu by sa losovalo pri KAŽDOM renderi - kresba by blikala
//      pri každom kliku v ladiacom paneli. (Prepnutie publika kresbu meniť má,
//      ale raz a riadene, nie ako vedľajší účinok prekreslenia.)
//   2. `useState(() => Math.random())` to síce zmrazí, ale v StrictMode React
//      inicializátor zavolá dvakrát. Modulový „posledný los" sa tým posunie
//      dvakrát na komponent a stráži nesprávnu hodnotu - vyskúšané, na /o-nas
//      vyšli dve rovnaké stuhy vedľa seba.
//
// AKO TO ROBÍ TENTO SÚBOR. Náhodné je len `base`, ktorý padne raz pri načítaní
// modulu (teda raz na načítanie stránky). Zvyšok je poradie: každá dekorácia si
// vezme ďalšie číslo v poradí a berie súbor `base + poradie`. Sada tak ide na
// stránke dokola - dve dekorácie pod sebou nikdy nemajú tú istú kresbu - a pri
// reloade sa celý cyklus pretočí inam.
//
// Číslo sa berie v `useLayoutEffect`, nie počas renderu, a pri odpojení sa VRACIA
// späť do zoznamu voľných. Bez toho vracania to nefunguje: StrictMode komponent
// pripojí, odpojí a pripojí znovu, takže by si každá dekorácia vzala dve čísla
// a krok cyklu by bol 2 - zo štyroch súborov by sa striedali len dva. Layout
// effect beží ešte pred vykreslením, takže sa prvý (prázdny) render nikdy neukáže.
//
// Voľné číslo sa HĽADÁ, nepočíta sa len „koľko ich už je". Prepnutie publika
// vymení obsah stránky, takže niektoré dekorácie odídu a iné prídu - s obyčajným
// počítadlom si nováčik vzal číslo, ktoré niekto pripojený stále držal, a na
// stránke boli dve rovnaké kresby (vyskúšané: rings-hero, rings-band, rings-hero).
//
// Prepnutie publika pretočí `base` a povie to všetkým pripojeným dekoráciám
// (preto je tu zoznam odberateľov - posun základu musí byť JEDEN na celý web,
// nie jeden na komponent). Poradie zostáva, takže sa ani po prepnutí neopakujú
// dve rovnaké kresby pod sebou.
// ============================================================
export function makePicker(files) {
  let base = Math.floor(Math.random() * files.length)
  const used = new Set()
  const subs = new Set()

  const claim = () => { let n = 0; while (used.has(n)) n += 1; used.add(n); return n }

  // Nový základ sa musí od doterajšieho LÍŠIŤ - keby sa losoval celý rozsah,
  // každé štvrté prepnutie publika by kresby nechalo tak a vyzeralo by to,
  // že sa nič nestalo. Preto sa posúva o 1 až (počet - 1).
  onSegmentChange(() => {
    base = (base + 1 + Math.floor(Math.random() * (files.length - 1))) % files.length
    subs.forEach((pick) => pick())
  })

  return function usePick() {
    const [img, setImg] = useState(null)
    const slot = useRef(0)
    useLayoutEffect(() => {
      slot.current = claim()
      const pick = () => setImg(files[(base + slot.current) % files.length])
      pick()
      subs.add(pick)
      return () => { subs.delete(pick); used.delete(slot.current) }
    }, [])
    return img
  }
}
