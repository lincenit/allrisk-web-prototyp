// Vizuálne varianty sekcie „Proč si vybrat Allrisk" na úvode (publikum
// Podnikatelé). Zoznam žije mimo komponentu, lebo ho čítajú dve miesta: sekcia
// samotná a ladiaci panel v pages/Wireframe.jsx.
// Štýly k hodnotám sú v pages/business.css (.biz-why--*).

/* ---- „Proč si vybrat Allrisk" - šesť dôvodov ----
   Varianty sa líšia tým, koľko z popisov pustia na plochu:
     radky - ruled riadky, na širokom okne názov a popis vedľa seba v jednom
             riadku. Najhustejší spôsob, ako popis udržať.
     karty - dlaždice 3×2, tá istá dlaždica ako v rozcestníku pre rodiny
             (.rz-tile), len nekliknuteľná. Predvolená od 2026-08-17 (user):
             obe publiká majú po videu ten istý tvar, mení sa obsah.
     pruh  - bez popisov: ikona a názov. Najnižšie, ale tvrdenia zostanú holé. */
export const WHY_VARIANTS = [
  { value: 'karty', label: 'Karty' },
  { value: 'radky', label: 'Řádky' },
  { value: 'pruh', label: 'Pruh' },
]

export const WHY_VARIANT_DEFAULT = 'karty'

// ZMAZANÉ 2026-08-16 (user): STEP_VARIANTS pre kroky spolupráce
// (`cesta` / `pas` / `radky`). Kroky majú odteraz rozhodnutý tvar - očíslovaný
// zoznam s rozbaľovacím popisom vedľa ilustrácie (viď BizCare.jsx).

// Voľba prežíva v localStorage (useDebugOption), takže po zmazaní variantu tam
// môže ostať hodnota, ku ktorej už nie sú štýly - sekcia by sa vykreslila holá.
// Preto sa neznáma hodnota ticho vráti na predvolenú.
const pick = (list, dflt) => (v) => (list.some((o) => o.value === v) ? v : dflt)
export const whyVariant = pick(WHY_VARIANTS, WHY_VARIANT_DEFAULT)
