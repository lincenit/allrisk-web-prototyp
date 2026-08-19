/* Hlavička má JEDEN rozvrh (user, 2026-08-19: „čo sa týka hlavičky sprav len
   Bílá") - biely pás publík nad modrou lištou, podľa Figmy (súbor `Consolidation`,
   node 1966:473). Rozvrhy `modra` (ten istý pás na modrej) a `pruh` (publikum
   aj katalóg v spodnom páse) sú zmazané aj s prepínačom; kto ich bude hľadať,
   nájde ich v gite.

   Otvorená zostala JEDNA os: čím sa zvolená záložka drží nad foto-hero, kde je
   hlavička priehľadná. Zvolená záložka je tá istá plocha ako lišta, takže sa
   zpriehľadní s ňou - a keď zmizne, výber nedrží farba, ale tvar.

     obrys - biely pás nemá vôbec; je to tá istá plocha ako lišta a výber drží 1px
             LINKA, ktorá ide cez celé okno zľava doprava a záložku obíde.
     okno  - pás zostáva biely a záložka je z neho VYREZANÁ: dierou vidno plochu
             hlavičky, a nad foto-hero teda snímku. Diera má hore zaoblené rohy ako
             záložka. Nie je to CSS trik zadarmo - jej súradnice meria hlavička
             v JS, šírka záložky závisí od textu aj od okna.

   Zvolená záložka NEMÁ v žiadnom z nich vlastnú farbu (user, 2026-08-19: „verzia
   okno má mať rovnakú farbu ako header, čiže byť súčasťou headru a nie mať vlastný
   gradient") - v oboch je to plocha hlavičky, len raz vidno cez dieru a raz cez celý
   pás.

   Hodnota sedí na <html> ako `data-hdrtop`, štýly sú v components/SiteHeader.css
   pri bloku `.hero-hdr`. Prepínač je „Hlavička hore" v ladiacom paneli. */
export const HDR_TOP_VARIANTS = [
  { value: 'obrys', label: 'Obrys' },
  { value: 'okno', label: 'Okno' },
]

// Predvolený je `obrys` (user, 2026-08-19).
export const HDR_TOP_DEFAULT = 'obrys'

// Voľba prežíva v localStorage (useDebugOption), takže po zmazaní variantu tam
// môže ostať hodnota, ku ktorej už nie sú štýly - hlavička by sa vykreslila holá.
// Preto sa neznáma hodnota ticho vráti na predvolenú.
export const hdrTop = (v) =>
  HDR_TOP_VARIANTS.some((o) => o.value === v) ? v : HDR_TOP_DEFAULT
