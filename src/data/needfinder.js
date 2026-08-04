// Potřebový rozcestník na landing page – dve úrovne.
// 1. úroveň = „nákupný zámer" v prvej osobe (dlaždica), 2. úroveň = konkrétne produkty.
// Produkty držia rovnaké názvy ako mega-menu (data/menu.js, segment „rodiny"), aby si
// klient po kliku z rozcestníka a z menu prišiel na to isté.
// Ikony sú kľúče (string) – mapuje ich stránka. `to` je nepovinné; bez neho ide položka
// na /kontakt?tema=<label>, lebo produktové stránky zatiaľ neexistujú.

const p = (label, icon, desc, to) => ({ label, icon, desc, to })

// Škoda nie je nákup – urgentná, neprodejná potreba, preto stojí mimo mriežky.
export const NEED_CLAIM = {
  t: 'Chci nahlásit škodu',
  d: 'Škody likvidujeme sami – jeden kontakt od nahlášení až po výplatu.',
  to: '/kontakt?tema=Nahlásit škodu',
}

export const NEED_INTENTS = [
  {
    key: 'pojisteni', icon: 'shield', t: 'Chci se pojistit', accent: 'pojistit', d: 'Auto, bydlení, rodina i cesty',
    tema: 'Pojištění',
    lead: 'Vyberte, co chcete chránit. Krytí i limity doladíme spolu.',
    products: [
      p('Vozidla', 'car', 'Povinné ručení i havárie', '/vozidla'),
      p('Nemovitost', 'house', 'Dům, byt, chata i garáž'),
      p('Domácnost', 'box', 'Vybavení a věci uvnitř'),
      p('Odpovědnost', 'shieldCheck', '„Blbinka" v běžném životě'),
      p('Právní ochrana', 'scale', 'Spory a zastoupení'),
      p('Život a úraz', 'heart', 'Zajištění příjmu rodiny'),
      p('Cestovní', 'globe', 'Léčebné výlohy i storno'),
      p('Rybářské', 'fish', 'Vybavení a odpovědnost'),
    ],
  },
  {
    key: 'uver', icon: 'bank', t: 'Chci úvěr', accent: 'úvěr', d: 'Hypotéka i spotřebitelský úvěr',
    tema: 'Úvěry a hypotéky',
    lead: 'Srovnáme nabídky bank a vyjednáme podmínky za vás.',
    products: [
      p('Úvěry na bydlení', 'bank', 'Hypotéka i refinancování'),
      p('Spotřebitelské úvěry', 'coin', 'Na cokoliv, bez zajištění'),
      p('Stavební spoření', 'piggy', 'Úvěr ze stavebního spoření'),
      p('Leasing', 'truck', 'Auto i technika na splátky'),
    ],
  },
  {
    key: 'reality', icon: 'house', t: 'Chci koupit / prodat / pronajmout nemovitost', accent: 'nemovitost', d: 'Realitní služby i nájem bez rizika',
    tema: 'Reality',
    lead: 'Od odhadu ceny po podpis – papírování necháte na nás.',
    products: [
      p('Prodej nemovitosti', 'houseSell', 'Odhad, inzerce i prohlídky'),
      p('Nákup nemovitosti', 'houseSearch', 'Najdeme a prověříme za vás'),
      p('Výkup nemovitosti', 'houseCheck', 'Rychlé peníze bez čekání'),
      p('Nájem bez rizika', 'key', 'Nájem na účtu každý měsíc'),
      p('Aukce', 'gavel', 'Prodej za nejvyšší nabídku'),
      p('Developerské projekty', 'building', 'Nové byty a domy'),
    ],
  },
  {
    key: 'investice', icon: 'chart', t: 'Chci investovat', accent: 'investovat', d: 'Portfolio, spoření i penze',
    tema: 'Investice',
    lead: 'Podle cíle a horizontu – srozumitelně, bez žargonu.',
    products: [
      p('Investice', 'chart', 'Portfolio podle vašeho cíle'),
      p('Penzijní spoření', 'piggy', 'Se státním příspěvkem'),
      p('Stavební spoření', 'bank', 'Jistý výnos, nízké riziko'),
      p('Bankovní produkty', 'card', 'Účty a spořicí produkty'),
      p('Měnové konverze', 'coin', 'Lepší kurz než v bance'),
    ],
  },
  {
    key: 'energie', icon: 'bolt', t: 'Chci levnější energie / mobilní tarify', accent: 'levnější energie / mobilní tarify', d: 'Allrisk EFFECTIVE',
    tema: 'Energie a tarify',
    lead: 'Trvalé úspory na tom, co platíte každý měsíc.',
    products: [
      p('Energie', 'bolt', 'Elektřina a plyn levněji'),
      p('Telekomunikace', 'mobile', 'Mobilní tarify a internet'),
      p('Operativní leasing', 'truck', 'Auto na paušál, vše v ceně'),
    ],
  },
  {
    key: 'auto', icon: 'key', t: 'Chci si půjčit / pronajmout auto', accent: 'auto', d: 'Autopůjčovna a operativní leasing',
    tema: 'Autopůjčovna',
    lead: 'Na pár dní i na roky – s pojištěním i servisem v ceně.',
    products: [
      p('Autopůjčovna', 'key', 'Krátkodobý i náhradní vůz'),
      p('Operativní leasing', 'truck', 'Auto na paušál, vše v ceně'),
      p('Leasing', 'car', 'Financování vlastního vozu'),
    ],
  },
]
