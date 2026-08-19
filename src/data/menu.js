// IA allrisk.cz - segment × kategória × produkty (pre header mega-menu).
// icon = kľúč do ICONS. Wireframe dáta, dolaďujeme.

export const ICONS = {
  car: 'M5 13l2-5h10l2 5M5 13h14v4H5zM7.5 17v1.5M16.5 17v1.5',
  house: 'M3 11l9-7 9 7M5 10v10h14V10',
  box: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7',
  shield: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z',
  scale: 'M7 20h10M6 6l6-1 6 1M12 3v17M9 12l-3-6-3 6a3 3 0 006 0M21 12l-3-6-3 6a3 3 0 006 0',
  heart: 'M12 21s-7-4.4-9-8.5C1.5 9 3 6 6 6c2 0 3 1.3 3 1.3S10 6 12 6s3 1.3 3 1.3S16 6 18 6c3 0 4.5 3 3 6.5-2 4.1-9 8.5-9 8.5z',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20',
  chart: 'M4 19V5M4 19h16M8 15l3-4 3 3 4-6',
  coin: 'M12 3a9 9 0 100 18 9 9 0 000-18zM14.8 9a2 2 0 00-1.8-1h-2a2 2 0 000 4h2a2 2 0 010 4h-2a2 2 0 01-1.8-1',
  bank: 'M3 21h18M5 21V10M19 21V10M4 10l8-5 8 5M9 21v-6h6v6',
  building: 'M3 21V8l6-4 6 4v13M9 21v-5M15 12h4a2 2 0 012 2v7',
  truck: 'M3 7h11v8H3zM14 10h4l3 3v2h-7M6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3M17.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3',
  briefcase: 'M4 8h16v11H4zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6z',
  key: 'M15 8a4 4 0 11-7 1l-5 5v3h3l1-1h2v-2h2l1.3-1.3A4 4 0 0015 8z',
  warn: 'M12 9v4M12 17h.01M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0z',
  doc: 'M6 3h9l3 3v15H6zM15 3v3h3',
  leaf: 'M5 21c0-8 6-14 14-14 0 8-6 14-14 14M5 21c2-4 5-7 9-9',
  fish: 'M3 12c4-5 11-5 15 0-4 5-11 5-15 0zM18 9v6M6 12h.01',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2',
}

// Päť obchodných línií. Od 2026-08-11 je KAŽDÁ vlastnou položkou lišty (predtým
// stĺpce v jedinom paneli „Produkty") - prvou úrovňou navigácie je publikum
// v páse nad lištou a línie sú až to, čo si pod zvoleným publikom vyberáš.
//   primary - tri hlavné línie. Dnes už nerozhoduje o rozložení panelu, ale
//             o poradí a o tom, čo je jadro ponuky a čo nadstavba.
//   lead    - veta v hlavičke panelu. Povie, čo je tá línia, skôr než sa človek
//             pustí do zoznamu; pri „Allrisk EFFECTIVE" je to jediné miesto,
//             kde sa dozvie, že ide o klubový projekt na prevádzkové náklady.
export const CATS = [
  { key: 'pojisteni', label: 'Pojištění', primary: true, lead: 'Krytí rizik, která by vás jinak stála vlastní peníze.' },
  { key: 'reality', label: 'Reality', primary: true, lead: 'Prodej, nákup i nájem - papírování necháte na nás.' },
  { key: 'finance', label: 'Finance', primary: true, lead: 'Úvěry, investice a účty srovnané napříč trhem.' },
  { key: 'servis', label: 'Klientský servis', lead: 'To, co se děje po podpisu - hlavně když se něco stane.' },
  { key: 'effective', label: 'Allrisk EFFECTIVE', lead: 'Klubový projekt na snížení provozních nákladů.' },
]

// Segmenty sú prvou úrovňou navigácie - pás záložiek NAD lištou, presne ako na
// allrisk.cz. Prepnutie nemení len menu, ale celý web pod ním (src/segment.js).
//   label = názov v záložke hlavičky, VŽDY v plnom znení (user, 2026-08-18:
//           „rodiny musia byť všade v plnom znení - Rodiny a jednotlivci").
//           Pole `short` („Rodiny") je preto zrušené: jediný, kto ho čítal, bola
//           hlavička, a tá teraz musí ukázať celé meno publika. Skracovať sa
//           nesmie ani podľa šírky okna (user, 2026-08-12) - je to nastavenie
//           celého webu a nemôže sa volať zakaždým inak.
//   pro   = nadpis/eyebrow panelu a úvodu, v tvare „Pro …".
//   icon  = kľúč ikony publika (mapuje ju SiteHeader). V mobilnom prepínači
//           dáva výber najavo aj bez čítania textu.
export const SEGMENTS = [
  { key: 'rodiny', label: 'Rodiny a jednotlivci', pro: 'Pro rodiny a jednotlivce', icon: 'users', desc: 'Auto, bydlení, zdraví a úspory pro vaši domácnost.' },
  { key: 'podnikatele', label: 'Podnikatelé', pro: 'Pro podnikatele a firmy', icon: 'briefcase', desc: 'Majetek, odpovědnost a lidé ve vaší firmě.' },
  { key: 'mesta', label: 'Města a obce', pro: 'Pro města a obce', icon: 'city', desc: 'Obecní majetek, zastupitelé a bytové domy.' },
]

// koľko služieb ponúkame danému segmentu (číslo v hlavičke menu)
export const countFor = (seg) => CATS.reduce((n, c) => n + (MENU[seg]?.[c.key]?.length || 0), 0)

// Publikum podľa kľúča. Nikdy nevracia undefined: kľúč môže prísť z localStorage
// z minulej návštevy a hlavička by potom čítala `.label` z ničoho.
export const segmentBy = (key) => SEGMENTS.find((s) => s.key === key) || SEGMENTS[0]
// Položky jednej línie pre zvolené publikum. Prázdne pole namiesto pádu - línia
// bez položiek sa v lište nemá čím otvoriť a header sa na to pýta.
export const itemsFor = (seg, cat) => MENU[seg]?.[cat] || []

const it = (label, icon, desc) => ({ label, icon, desc })

export const MENU = {
  rodiny: {
    pojisteni: [
      it('Vozidla', 'car', 'Povinné ručení i havárie'),
      it('Nemovitost', 'house', 'Stavba domu a bytu'),
      it('Domácnost', 'box', 'Vybavení a věci uvnitř'),
      it('Odpovědnost', 'shield', '„Blbinka" v běžném životě'),
      it('Právní ochrana', 'scale', 'Spory a zastoupení'),
      it('Život a úraz', 'heart', 'Zajištění příjmu rodiny'),
      it('Cestovní', 'globe', 'Léčebné výlohy, storno'),
      it('Rybářské', 'fish', 'Vybavení a odpovědnost'),
    ],
    reality: [
      it('Prodej nemovitostí', 'houseSell'), it('Výkup nemovitostí', 'houseBuyout'),
      it('Nákup nemovitostí', 'houseBuy'), it('Aukce', 'doc'),
      it('Developerské projekty', 'building'), it('Nájem bez rizika', 'key'),
    ],
    finance: [
      it('Úvěry na bydlení', 'bank'), it('Spotřebitelské úvěry', 'coin'),
      it('Investice', 'chart'), it('Penzijní spoření', 'coin'),
      it('Stavební spoření', 'bank'), it('Bankovní produkty', 'bank'),
      it('Leasing', 'truck'), it('Měnové konverze', 'coin'),
    ],
    servis: [
      it('Likvidace pojistných událostí', 'warn', 'Vlastní likvidace, rychle'),
      it('Autopůjčovna', 'key', 'Náhradní vůz'),
    ],
    effective: [
      it('Energie', 'bolt'), it('Operativní leasing', 'truck'), it('Telekomunikace', 'phone'),
    ],
  },
  podnikatele: {
    pojisteni: [
      it('Odpovědnost za škodu', 'shield'), it('Průmyslová nebezpečí', 'building'),
      it('D&O pojištění', 'briefcase'), it('Kybernetická rizika', 'doc'),
      it('Přepravní pojištění', 'truck'), it('Technická rizika', 'doc'),
      it('Pojištění záruk', 'doc'), it('Vozidla / flotily', 'car'),
      it('Nemovitost', 'house'), it('Zemědělské', 'leaf'),
      it('Bytové domy', 'building'), it('Život a úraz', 'heart'),
    ],
    reality: [it('Nájem bez rizika', 'key')],
    finance: [
      it('Podnikatelské úvěry', 'coin'), it('Investice', 'chart'),
      it('Leasing', 'truck'), it('Bankovní produkty', 'bank'),
      it('Měnové konverze', 'coin'), it('Privátní bankovnictví', 'bank'),
    ],
    servis: [
      it('Likvidace pojistných událostí', 'warn'), it('Autopůjčovna', 'key'),
    ],
    effective: [it('Energie', 'bolt'), it('Operativní leasing', 'truck'), it('Telekomunikace', 'phone')],
  },
  mesta: {
    pojisteni: [
      it('Majetek měst a obcí', 'building'), it('Zastupitelé', 'shield'),
      it('Bytové domy', 'house'), it('Vozidla', 'car'),
    ],
    reality: [it('Nájem bez rizika', 'key')],
    finance: [
      it('Bankovní produkty', 'bank'), it('Investice', 'chart'),
      it('Leasing', 'truck'), it('Měnové konverze', 'coin'), it('Privátní bankovnictví', 'bank'),
    ],
    servis: [it('Likvidace pojistných událostí', 'warn')],
    effective: [it('Energie', 'bolt'), it('Operativní leasing', 'truck')],
  },
}
