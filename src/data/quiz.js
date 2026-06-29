// "Jak dobře jste pojištěni?" – kombinácia vyplnenia (osobné info) + výberu (oblasti) + voľnej poznámky.
// choice oblasť nesie score 0..1 (null = netýka sa ma → mimo skóre); gap=true → oblasť na riešenie.
// Vychádza z nástroja Profil klienta.

// 1) Základné osobné info – krok na VYPLNENIE (text / číslo / výber).
export const PERSONAL = {
  type: 'form',
  id: 'osobni',
  label: 'O vás',
  icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M16 20a6 6 0 0 1 5-5.7',
  q: 'Nejdřív pár údajů o vás',
  sub: 'Ať umíme odhadnout, co dává smysl řešit. Slouží jen pro tento výpočet.',
  fields: [
    { id: 'jmeno', label: 'Jak vám máme říkat?', type: 'text', placeholder: 'Jméno', span: 2 },
    { id: 'vek', label: 'Věk', type: 'number', placeholder: '35', suffix: 'let', min: 15, max: 99, required: true },
    { id: 'situace', label: 'Životní situace', type: 'select', placeholder: 'Vyberte…', required: true,
      options: ['Sám / sama', 'Pár bez dětí', 'Rodina s dětmi', 'Senior'] },
    { id: 'prijem', label: 'Čistý měsíční příjem domácnosti', type: 'number', placeholder: '45 000', suffix: 'Kč' },
    { id: 'deti', label: 'Počet dětí', type: 'number', placeholder: '0', suffix: 'dětí' },
  ],
}

// 2) Oblasti – krok na VÝBER (otázka + možnosti).
export const AREAS = [
  {
    type: 'choice',
    id: 'auto',
    label: 'Vozidlo',
    slug: 'pojisteni-vozidel',
    icon: 'M5 13l2-5h10l2 5M5 13h14v4H5zM7.5 17v1.5M16.5 17v1.5',
    q: 'Jak máte pojištěné auto?',
    sub: 'Povinné ručení kryje škody druhým, havarijní chrání vás.',
    why: 'Bez havarijního si opravu po nehodě, krádeži nebo krupobití platíte celou z vlastní kapsy – klidně i stovky tisíc.',
    save: 'Havarijní pojištění od ~420 Kč/měs',
    options: [
      { t: 'Povinné i havarijní pojištění', score: 1 },
      { t: 'Jen povinné ručení', score: 0.5, gap: true },
      { t: 'Nemám nebo nevím', score: 0, gap: true },
      { t: 'Auto nevlastním', score: null },
    ],
  },
  {
    type: 'choice',
    id: 'bydleni',
    label: 'Bydlení',
    slug: 'pojisteni-nemovitosti',
    icon: 'M3 11l9-7 9 7M5 10v10h14V10',
    q: 'Je váš domov chráněný?',
    sub: 'Nemovitost (stavba) i domácnost (vybavení) bývají dvě různá pojištění.',
    why: 'Požár, vytopení nebo vykradení bez pojištění znamená rekonstrukci a nové vybavení na vlastní náklady.',
    save: 'Nemovitost i domácnost od ~150 Kč/měs',
    options: [
      { t: 'Nemovitost i domácnost', score: 1 },
      { t: 'Jen jedno z toho', score: 0.5, gap: true },
      { t: 'Nemám nic', score: 0, gap: true },
      { t: 'Bydlím u rodičů / netýká se', score: null },
    ],
  },
  {
    type: 'choice',
    id: 'prijem',
    label: 'Příjem & rodina',
    slug: 'zivotni-pojisteni',
    icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M16 20a6 6 0 0 1 5-5.7',
    q: 'Co se stane s příjmem, když vážně onemocníte?',
    sub: 'Životní pojištění drží domácnost nad vodou při výpadku příjmu.',
    why: 'Při delší nemoci nebo úrazu vypadne příjem, ale splátky a výdaje běží dál – pojištění je nahradí.',
    save: 'Životní pojištění na míru od ~300 Kč/měs',
    options: [
      { t: 'Mám životní pojištění na míru', score: 1 },
      { t: 'Mám jen základní / staré', score: 0.5, gap: true },
      { t: 'Spoléhám na úspory', score: 0.25, gap: true },
      { t: 'Neřeším to', score: 0, gap: true },
    ],
  },
  {
    type: 'choice',
    id: 'rezerva',
    label: 'Rezerva & investice',
    slug: 'investice',
    icon: 'M4 19V5M4 19h16M8 15l3-4 3 3 4-6',
    q: 'Máte finanční rezervu a zhodnocujete peníze?',
    sub: 'Doporučená rezerva jsou 3–6 měsíčních výdajů, zbytek může pracovat.',
    why: 'Bez rezervy řešíte nečekané výdaje drahým úvěrem a peníze na účtu navíc požírá inflace.',
    save: 'Investovat lze už od 500 Kč/měs',
    options: [
      { t: 'Rezervu mám a investuji', score: 1 },
      { t: 'Mám rezervu, neinvestuji', score: 0.6, gap: true },
      { t: 'Nemám ani jedno', score: 0, gap: true },
    ],
  },
  {
    type: 'choice',
    id: 'cesty',
    label: 'Cestování',
    slug: 'cestovni-pojisteni',
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
    q: 'Jak jezdíte do zahraničí?',
    sub: 'Léčebné výlohy bez pojištění mohou stát statisíce.',
    why: 'Ošetření nebo převoz domů ze zahraničí bez pojištění může vyjít na statisíce korun.',
    save: 'Celoroční cestovní pojištění od ~40 Kč/měs',
    options: [
      { t: 'S celoročním cestovním pojištěním', score: 1 },
      { t: 'Pokaždé sjednám jednorázově', score: 0.8 },
      { t: 'Spoléhám na kartičku pojišťovny', score: 0.3, gap: true },
      { t: 'Necestuji', score: null },
    ],
  },
  {
    type: 'choice',
    id: 'odpovednost',
    label: 'Odpovědnost',
    slug: 'pojisteni-nemovitosti',
    icon: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z',
    q: 'Jste krytí, když nechtěně způsobíte škodu druhým?',
    sub: 'Pojištění odpovědnosti („blbinka") kryje škody v běžném životě.',
    why: 'Když nechtěně způsobíte škodu druhému (vytopený soused, sražený cyklista), hradíte ji celou sami.',
    save: 'Pojištění odpovědnosti od ~30 Kč/měs',
    options: [
      { t: 'Ano, mám pojištění odpovědnosti', score: 1 },
      { t: 'Nejsem si jistý/á', score: 0.3, gap: true },
      { t: 'Nemám', score: 0, gap: true },
    ],
  },
]

// 3) Voľná poznámka – krok na VYPLNENIE (nepovinné).
export const NOTE = {
  type: 'text',
  id: 'pozn',
  label: 'Poznámka',
  icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  q: 'Chcete něco doplnit?',
  sub: 'Cokoli, co byste rádi probrali s poradcem. Nepovinné.',
  placeholder: 'Např. plánujeme miminko, koupi bytu nebo výměnu auta…',
}

export const STEPS = [PERSONAL, ...AREAS, NOTE]

// Spätná kompatibilita (ak by niečo importovalo pôvodný QUIZ).
export const QUIZ = AREAS
