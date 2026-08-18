import { asset } from '../asset.js'
import { makePicker } from './decorPick.js'

// ============================================================
// ZNAČKOVÁ LINKA - druhá dekorácia modrých pásov.
//
// Prevzatá zo živého reality webu (allrisk-sites/sites/allrisk-reality,
// src/components/ui/hero-line.tsx), aby mali oba weby tú istú stuhu a nie dve
// podobné. Súbory sú tie isté bity, len prekopírované do /public/brand.
//
// PREČO NIE <Decor>. Kružnica je plátno cez celý pás: kladie sa na 100 %
// plochy, `cover` jej drží mierku a prebytok oreže. Linka je naopak OBJEKT
// zavesený na pravý okraj pásu - drží si vlastný pomer, vodorovne sa nikdy
// neoreže ani nenaťahuje a zvislo pretečie von, kde ju zreže `overflow` pásu.
// Sú to dva rôzne spôsoby kladenia, takže sa nedajú zliať do jedného
// komponentu; ďalší prop na Decor by len skryl, že ide o inú vec.
//
// Kód tu teda rozhoduje o POLOHE (inak by linka nemala kde stáť), ale nie
// o kresbe: veľkosť ťahu, gradient aj krytie si nesie sám PNG súbor.
//
// KAŽDÉ HERO A KAŽDÝ BANNER (user, 2026-08-16). Do toho dňa platilo „jedna na
// stránku a nikdy na fotku" - stuha bola akcent a nad fotohero z nej bol fialový
// opar (zamietnuté na /o-nas 2026-08-12). User to obrátil: stuha má byť na hero
// rovnako ako kružnice, teda aj cez fotku. Zostáva jedna na PÁS, nie na stránku;
// biele sekcie nedostanú nič. Výnimka je len videohero úvodu - to má stuhu, ale
// nie kružnice (vlásočnica cez pohyblivý záber je šmuha).
//
// ŽIADNA STUHA NEPATRÍ KU KONKRÉTNEMU MIESTU (user, 2026-08-16). Sada sú štyri
// rovnocenné gestá, `line-1…4.png`, a ktorékoľvek smie stáť kdekoľvek - preto
// súbor nevyberá call-site, ale komponent sám. Staré názvy `line-hero-*` /
// `line-banner-*` viazali kresbu na typ pásu, čo nikdy neplatilo; zvyšné súbory
// zo sady boli variácie toho istého ťahu a padli. Ak treba ďalšie gesto,
// originály celej sady sú v `brand-identity/graphics`.
// ============================================================

// Pozor na zhodu mien: `--line-1…4` v index.css sú FARBY (štyri zastávky
// značkového gradientu), tieto štyri sú SÚBORY so stuhou. Nesúvisia spolu.
const LINES = ['line-1.png', 'line-2.png', 'line-3.png', 'line-4.png']

// SKUTOČNÁ NÁHODA, NIE HASH Z CESTY (user, 2026-08-17): každé načítanie stránky
// prehodí kresby. Do 2026-08-17 tu bol hash z `pathname`, takže stránka mala
// navždy tú istú stuhu - to už neplatí. Mechanika je v decorPick.js, aj s tým,
// prečo sa nelosuje priamo v komponente.
const useLine = makePicker(LINES)

// Vloží sa do pásu PRED obsah, rovnako ako <Decor> - vrstvenie stojí na poradí
// v strome (viď komentár k .decor-line v index.css).
//   pos    typ pásu, na ktorom stojí - určuje MIERKU gesta:
//          `banner` (default) - banner a kontaktný pás, nižšie pole
//          `hero`             - hero a hlavička podstránky, vyššie pole
//   corner do ktorého rohu sa zavesí. Default `bottom-right`; ostatné hodnoty
//          `bottom-left`, `top-right`, `top-left`. Vyberá ho call-site, lebo to
//          nie je vec kresby ani typu pásu, ale toho, kde má daný pás voľné
//          miesto - kontaktný pás má napríklad vpravo formulár.
export function Line({ pos = 'banner', corner = 'bottom-right' }) {
  const img = useLine()
  if (!img) return null
  return (
    <div className={`decor-line decor-line--${pos} decor-line--${corner}`} aria-hidden="true">
      <img src={asset(`/brand/${img}`)} alt="" draggable="false" decoding="async" />
    </div>
  )
}
