// Obsah domovskej stránky (/uvod) – „cesta života", značkové atribúty, čísla a referencie.
// Ikony sú KĽÚČE (rovnako ako v menu.js), komponenty k nim mapuje stránka. Dáta zostávajú bez Reactu.
import { NEEDS } from './needs.js'

// Rozšírenie cesty života o ďalšie životné situácie (needs.js nechávame netknuté).
export const JOURNEY_EXTRA = {
  domov: {
    key: 'domov', slug: 'pojisteni-domacnosti', event: 'Chráním, na čem mi záleží',
    service: 'Domácnost, odpovědnost & právní ochrana',
    icon: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z',
    lead: 'Vybavení domácnosti, škoda, kterou nechtěně způsobíte, i právní spory – ochrana pro běžný život, kdy se občas něco pokazí.',
    tabs: [
      { label: 'Domácnost', body: 'Ochrana vybavení a věcí uvnitř – od elektroniky po cennosti, včetně vloupání a živlu.' },
      { label: 'Odpovědnost („blbinka")', body: 'Když nechtěně způsobíte škodu druhým – doma, na chodníku i na dovolené. Zaplatíme za vás.' },
      { label: 'Právní ochrana', body: 'Spory se sousedy, zaměstnavatelem nebo prodejcem – právník i náklady na vaší straně.' },
    ],
  },
  podnikam: {
    key: 'podnikam', slug: 'podnikani', event: 'Začínám podnikat',
    service: 'Pojištění a financování firmy',
    icon: 'M4 8h16v11H4zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2',
    lead: 'Rozjíždíte podnikání? Ochráníme odpovědnost, majetek i lidi a pomůžeme s financováním růstu – jeden partner pro firmu i rodinu.',
    tabs: [
      { label: 'Odpovědnost za škodu', body: 'Krytí škod způsobených vaší činností klientům i třetím stranám.' },
      { label: 'Majetek a flotila', body: 'Pojištění provozoven, techniky i firemních vozidel na jedné smlouvě.' },
      { label: 'Financování a leasing', body: 'Podnikatelské úvěry, leasing i cash-flow řešení za výhodných podmínek.' },
    ],
  },
}

// Poradie uzlov cesty: osobný životný oblúk, škoda (červená) vždy posledná.
export const JOURNEY = [
  NEEDS[0], NEEDS[1], JOURNEY_EXTRA.domov, NEEDS[2],
  NEEDS[3], NEEDS[4], JOURNEY_EXTRA.podnikam, NEEDS[5],
]

// Päť značkových atribútov Allrisk (brand guide).
export const BRAND_ATTRS = [
  { icon: 'briefcase', t: 'Komplexnost', d: 'Pojištění, bydlení i finance vyřešíte na jednom místě, s jedním člověkem, který zná celý váš příběh.' },
  { icon: 'mappin', t: 'Dostupnost', d: 'Přes 60 poboček po celé ČR i online. Ať potřebujete cokoliv, jsme na dosah – osobně i na dálku.' },
  { icon: 'shield', t: 'Profesionalita', d: 'Vybíráme z celého trhu a vyjednáváme podmínky za vás. Škody navíc likvidujeme sami – rychleji a férově.' },
  { icon: 'handshake', t: 'Partnerství', d: 'Nejsme tu na jednu smlouvu. Vztah budujeme dlouhodobě a vždycky přidáme něco navíc.' },
  { icon: 'users', t: 'Lidskost', d: 'Mluvíme srozumitelně, bez pojišťováckého žargonu. Rozumíme vašim potřebám a vysvětlíme proč.' },
]

// Celý triplet patrí len sekcii Důkaz; hero nesie jedno číslo, aby sa neopakovali dvakrát.
//   = pevná medzera: číslo sa nikdy nezlomí, takže netreba white-space:nowrap na obale.
export const STATS = [
  { n: '236 000+', c: 'klientů nám důvěřuje' },
  { n: '1,5 mld Kč', c: 'vyřízených škod ročně' },
  { n: '300+', c: 'osobních poradců' },
]
export const HERO_STAT = { n: '236 000+', c: 'klientů nám svěřilo pojištění, bydlení i finance' }

export const REFS = [
  // pod menom je dátum recenzie – rovnako ako na kartách v /reference
  { q: 'Přehodnotili mi celé pojištění a ušetřili tisíce ročně. Nikdo mi nic netlačil – jen poradili, co dává smysl.', who: 'Petra K.', date: '2. 7. 2026', av: 'PK' },
  { q: 'Po nehodě jsem volal jednomu člověku a on to vyřídil za mě. Přesně tohle jsem od makléře čekal.', who: 'Martin D.', date: '19. 6. 2026', av: 'MD' },
]
