// Vizuálne varianty radu záložiek (.tabbar). Zoznam žije mimo stránok, lebo ten istý
// prepínač je na /vozidla (produkty) aj na /profil/:slug (modelové situácie) - ponuka
// v ladiacom paneli musí byť na oboch rovnaká, inak sa varianty neporovnajú.
// Štýly k jednotlivým hodnotám sú v pages/wireframe.css (.tabs-*).
export const TAB_VARIANTS = [
  { value: 'seg', label: 'Segment' },
  { value: 'card', label: 'Dlaždice' },
  { value: 'pill', label: 'Původní' },
]

export const TAB_VARIANT_DEFAULT = 'seg'
