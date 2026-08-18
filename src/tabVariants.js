// Vizuálne varianty radu záložiek (.tabbar). Zoznam žije mimo stránok, lebo ten istý
// prepínač je na /vozidla (produkty) aj na /profil/:slug (modelové situácie) - ponuka
// v ladiacom paneli musí byť na oboch rovnaká, inak sa varianty neporovnajú.
// Štýly k jednotlivým hodnotám sú v pages/wireframe.css (.tabs-*).
// (Skúšané a 2026-08-12 zahodené: „Původní" = pilulky s rámom, tichá referenčná poloha.)
export const TAB_VARIANTS = [
  { value: 'seg', label: 'Segment' },
  { value: 'card', label: 'Dlaždice' },
]

export const TAB_VARIANT_DEFAULT = 'seg'

// Voľba prežíva v localStorage (useDebugOption), takže po zmazaní variantu tam môže
// ostať hodnota, ku ktorej už nie sú štýly - rad by sa vykreslil holý. Preto sa
// neznáma hodnota tichšie vráti na predvolenú.
export const tabVariant = (v) =>
  TAB_VARIANTS.some((o) => o.value === v) ? v : TAB_VARIANT_DEFAULT
