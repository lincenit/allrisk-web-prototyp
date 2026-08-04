// Obsah stránky pojištění vozidel (/vozidla) – kategórie, produkty, cenník modulov a modelové situácie.
// Ikony sú KĽÚČE (rovnako ako v menu.js a home.js), komponenty k nim mapuje stránka.

// kategórie vozidiel, ktoré vieme poistiť
export const VEHICLE_CATS = [
  { code: 'L', icon: 'motorbike', desc: 'Motorky, tříkolky' },
  { code: 'M', icon: 'car', desc: 'Osobní vozidla' },
  { code: 'O', icon: 'caravan', desc: 'Přípojná vozidla' },
  { code: 'R', icon: 'tractor', desc: 'Ostatní vozidla' },
]

// 5 produktov = záložky (ako přepínátko u Directu)
export const PRODUCTS = [
  {
    key: 'povinne',
    icon: 'shield',
    label: 'Povinné ručení',
    tag: 'Ze zákona povinné',
    lead: 'Pojištění odpovědnosti z provozu vozidla, které musí ze zákona mít každý provozovatel vozidla. V případě nehody, kterou zaviníte, se postará o úhradu způsobených škod na zdraví a majetku třetích osob.',
    covers: ['Škody na zdraví třetích osob', 'Škody na cizím majetku', 'Asistenční služby v základu', 'Zelená karta pro cesty do zahraničí'],
    note: 'Limit krytí volíte vy – od zákonných 50 mil. Kč přes 100 mil. až po 1 miliardu Kč. Povinné ručení ale nekryje škody na vašem vlastním voze ani jeho odcizení – na to slouží havarijní pojištění.',
  },
  {
    key: 'havarijni',
    icon: 'crash',
    label: 'Havarijní pojištění',
    tag: 'Chrání vaše auto',
    lead: 'Ochranný štít pro vaše vozidlo pro případ nehody, poškození i odcizení. Pokryje veškeré náklady na váš vůz – opravy, nové díly, odtah i zapůjčení náhradního vozu po dobu opravy v servisu.',
    covers: ['Poškození vlastního vozu při nehodě', 'Odcizení vozidla', 'Vandalismus a živelní události', 'Náhradní vůz po dobu opravy'],
    note: 'Při sjednání si pohlídejte územní platnost, výši pojistné částky a spoluúčasti – některé pojišťovny zlevňují produkt právě omezováním těchto parametrů.',
  },
  {
    key: 'skla',
    icon: 'window',
    label: 'Pojištění skel',
    tag: 'Připojištění',
    lead: 'Oprava nebo výměna čelního i ostatních skel bez velkých výdajů. Drobné prasklinky vyřešíme rychle a často bez vlivu na vaše ostatní pojištění.',
    covers: ['Čelní sklo', 'Boční a zadní skla', 'Oprava často bez spoluúčasti'],
    note: 'Drobná prasklina = rychlá oprava na počkání, často bez vlivu na bonus.',
  },
  {
    key: 'asistence',
    icon: 'tool',
    label: 'Technické asistence',
    tag: 'Připojištění',
    lead: 'Pomoc na cestě 24/7, 365 dní v roce – v ČR i v zahraničí. Odtah do servisu, oprava na místě, náhradní vozidlo i ubytování, když se vůz porouchá daleko od domova.',
    covers: ['Odtah a vyproštění vozidla', 'Oprava na místě – baterie, palivo, odemčení', 'Náhradní vozidlo nebo ubytování', 'Non-stop dispečink a právní pomoc'],
    note: 'Limit asistence můžete zvýšit nálepkou Allrisk – nalepíte ji na vůz, pošlete foto se SPZ a do 5 pracovních dnů ji aktivujeme zdarma.',
  },
  {
    key: 'cesty',
    icon: 'route',
    label: 'Ochrana na cestách',
    tag: 'Připojištění',
    lead: 'Až 80 % vozidel nemá dostatečné limity technické asistence. Ochrana na cestách je zvýší přesně na dobu, kdy je potřebujete – na výlet i dovolenou autem, doma i v zahraničí.',
    covers: ['Vyšší limity asistence – 10 000 Kč v ČR, 40 000 Kč v zahraničí', 'Ubytování i doprava posádky na cestě', 'Delší uskladnění a odtah vozidla', 'Asistence při odcizení vozu'],
    note: 'Pro klienty s autopojištěním Allrisk aktivujete na 20 dní za 199 Kč přímo v portálu mujallrisk.cz – klidně i dopředu na plánovanou cestu.',
  },
]

// ---- ceník modulů (pro výpočet doporučené skladby u modelů) ----
export const MODULES = [
  { key: 'povinne', icon: 'shield', name: 'Povinné ručení', desc: 'Škody způsobené provozem jiným', price: 0, base: true },
  { key: 'havarie', icon: 'crash', name: 'Havarijní pojištění', desc: 'Havárie, vandalismus, živel', price: 420 },
  { key: 'zver', icon: 'paw', name: 'Střet se zvěří', desc: 'Srážka se zvířetem na silnici', price: 90 },
  { key: 'odcizeni', icon: 'lock', name: 'Odcizení vozidla', desc: 'Krádež celého auta', price: 140 },
  { key: 'skla', icon: 'window', name: 'Pojištění skel', desc: 'Čelní i boční skla', price: 110 },
  { key: 'asistence', icon: 'tool', name: 'Technické asistence', desc: 'Odtah, oprava, dispečink 24/7', price: 60 },
  { key: 'cesty', icon: 'route', name: 'Ochrana na cestách', desc: 'Úraz posádky, zavazadla', price: 80 },
  { key: 'nahradni', icon: 'car', name: 'Náhradní vozidlo', desc: 'Auto po dobu opravy', price: 70 },
]

// Modelové situácie (4 klientské profily vrátane vozidla, skladby krytia a situácie)
// žijú v data/profiles.js – sú zdieľané s landingom aj so stránkou /profil/:slug.
