import { useLayoutEffect, useState } from 'react'

// ============================================================
// LOSOVANIE DEKORÁCIÍ - spoločné pre kružnice (<Decor>) aj stuhu (<Line>).
//
// Zadanie (user, 2026-08-17): pri každom načítaní stránky iné kresby. Do toho dňa
// vyberal súbor hash z `pathname`, takže stránka mala navždy tú istú dvojicu.
//
// PREČO NIE `Math.random()` V KOMPONENTE. Dva dôvody, oba sa prejavia hneď:
//   1. V tele komponentu by sa losovalo pri KAŽDOM renderi - kresba by blikala
//      pri každom prepnutí publika aj pri každom kliku v ladiacom paneli.
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
// späť. Bez toho vracania to nefunguje: StrictMode komponent pripojí, odpojí
// a pripojí znovu, takže by si každá dekorácia vzala dve čísla a krok cyklu by
// bol 2 - zo štyroch súborov by sa striedali len dva. Layout effect beží ešte
// pred vykreslením, takže sa prvý (prázdny) render nikdy neukáže.
// ============================================================
export function makePicker(files) {
  const base = Math.floor(Math.random() * files.length)
  let taken = 0

  return function usePick() {
    const [img, setImg] = useState(null)
    useLayoutEffect(() => {
      setImg(files[(base + taken++) % files.length])
      return () => { taken-- }
    }, [])
    return img
  }
}
