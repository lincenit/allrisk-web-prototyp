// Pobočky + poradci (wireframe dáta). Vzťah: poradce.branch -> pobocka.slug;
// pobocka.team = pole poradce.slug. Avatar = iniciály (žiadne fotky -> nič sa nerozbije).

export const REGIONS = [
  { key: 'all', label: 'Celá ČR' },
  { key: 'praha', label: 'Praha' },
  { key: 'cechy', label: 'Čechy' },
  { key: 'morava', label: 'Morava' },
]

// otváracie hodiny – spoločné pre väčšinu pobočiek
const HOURS = [
  ['Po–Čt', '8:00–17:00'],
  ['Pá', '8:00–15:00'],
  ['So–Ne', 'zavřeno'],
]

// foto pobočky (zatiaľ Unsplash placeholdery budov/kanceláří – neskôr reálne fotky)
const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=480&q=70`
// map = približná poloha pinu na štylizovanej mape ČR [left %, top %]

export const BRANCHES = [
  {
    slug: 'brno', city: 'Brno', region: 'morava', hq: true,
    name: 'Centrála Brno',
    street: 'Komárovská 263/20a', zip: '617 00', cityFull: 'Brno-Komárov',
    phone: '+420 545 110 341', email: 'allrisk@allrisk.cz',
    hours: HOURS, team: ['petr-svoboda', 'lucie-novakova', 'martin-dolezal', 'jana-kralova'],
    note: 'Sídlo společnosti – kompletní servis pojištění, realit i financí.',
    img: photo('1568992687947-868a62a9f521'), map: [56, 64],
  },
  {
    slug: 'praha', city: 'Praha', region: 'praha',
    name: 'Pobočka Praha',
    street: 'Karolinská 661/4', zip: '186 00', cityFull: 'Praha 8 – Karlín',
    phone: '+420 730 100 110', email: 'praha@allrisk.cz',
    hours: HOURS, team: ['tomas-marek', 'eva-pospisilova'],
    img: photo('1497366811353-6870744d04b2'), map: [29, 28],
  },
  {
    slug: 'ostrava', city: 'Ostrava', region: 'morava',
    name: 'Pobočka Ostrava',
    street: 'Nádražní 545/166', zip: '702 00', cityFull: 'Ostrava – Moravská Ostrava',
    phone: '+420 730 100 120', email: 'ostrava@allrisk.cz',
    hours: HOURS, team: ['radek-vesely', 'katerina-horakova'],
    img: photo('1577495508048-b635879837f1'), map: [82, 44],
  },
  {
    slug: 'olomouc', city: 'Olomouc', region: 'morava',
    name: 'Pobočka Olomouc',
    street: 'Horní náměstí 12', zip: '779 00', cityFull: 'Olomouc',
    phone: '+420 730 100 130', email: 'olomouc@allrisk.cz',
    hours: HOURS, team: ['michal-prochazka'],
    img: photo('1486406146926-c627a92ad1ab'), map: [70, 52],
  },
  {
    slug: 'ceske-budejovice', city: 'České Budějovice', region: 'cechy',
    name: 'Pobočka České Budějovice',
    street: 'Lannova třída 16', zip: '370 01', cityFull: 'České Budějovice',
    phone: '+420 730 100 140', email: 'budejovice@allrisk.cz',
    hours: HOURS, team: ['veronika-bartosova'],
    img: photo('1431540015161-0bf868a2d407'), map: [33, 74],
  },
  {
    slug: 'hradec-kralove', city: 'Hradec Králové', region: 'cechy',
    name: 'Pobočka Hradec Králové',
    street: 'Gočárova třída 504', zip: '500 02', cityFull: 'Hradec Králové',
    phone: '+420 730 100 150', email: 'hradec@allrisk.cz',
    hours: HOURS, team: ['filip-benes'],
    img: photo('1545324418-cc1a3fa10c00'), map: [49, 33],
  },
  {
    slug: 'breclav', city: 'Břeclav', region: 'morava',
    name: 'Pobočka Břeclav',
    street: 'náměstí T. G. Masaryka 38', zip: '690 02', cityFull: 'Břeclav',
    phone: '+420 730 100 160', email: 'breclav@allrisk.cz',
    hours: HOURS, team: ['simona-kucerova'],
    img: photo('1524758631624-e2822e304c36'), map: [61, 76],
  },
  {
    slug: 'trebic', city: 'Třebíč', region: 'morava',
    name: 'Pobočka Třebíč',
    street: 'Karlovo nám. 30', zip: '674 01', cityFull: 'Třebíč',
    phone: '+420 730 100 170', email: 'trebic@allrisk.cz',
    hours: HOURS, team: ['ondrej-fiala'],
    img: photo('1497215728101-856f4ea42174'), map: [50, 60],
  },
]

// regióny, v ktorých reálne máme pobočky (pre zoskupený zoznam)
export const regionLabel = (key) => (REGIONS.find((r) => r.key === key)?.label || key)

export const ADVISORS = [
  {
    slug: 'petr-svoboda', name: 'Petr Svoboda', role: 'Vedoucí pobočky · pojištění',
    branch: 'brno', phone: '+420 602 111 222', email: 'p.svoboda@allrisk.cz',
    tags: ['Vozidla', 'Nemovitost', 'Firmy'], langs: ['Čeština', 'Angličtina'], since: 2009,
    bio: 'Patnáct let pomáhám rodinám i firmám poskládat pojištění tak, aby nikde nevznikaly díry. Specializuji se na majetek a odpovědnost.',
  },
  {
    slug: 'lucie-novakova', name: 'Lucie Nováková', role: 'Poradce · reality & finance',
    branch: 'brno', phone: '+420 602 111 223', email: 'l.novakova@allrisk.cz',
    tags: ['Hypotéky', 'Prodej nemovitostí', 'Investice'], langs: ['Čeština'], since: 2015,
    bio: 'Provedu vás celým prodejem nebo koupí nemovitosti – od ocenění přes financování až po pojištění, vše pod jednou střechou.',
  },
  {
    slug: 'martin-dolezal', name: 'Martin Doležal', role: 'Specialista · firemní rizika',
    branch: 'brno', phone: '+420 602 111 224', email: 'm.dolezal@allrisk.cz',
    tags: ['Průmysl', 'D&O', 'Flotily'], langs: ['Čeština', 'Němčina'], since: 2012,
    bio: 'Řeším pojištění výrobních firem a flotil. Sednu si s vámi nad reálná rizika provozu a navrhnu krytí na míru.',
  },
  {
    slug: 'jana-kralova', name: 'Jana Králová', role: 'Poradce · život a úraz',
    branch: 'brno', phone: '+420 602 111 225', email: 'j.kralova@allrisk.cz',
    tags: ['Život', 'Úraz', 'Penze'], langs: ['Čeština'], since: 2018,
    bio: 'Zaměřuji se na zajištění příjmu rodiny – život, úraz a dlouhodobé spoření. Vysvětlím srozumitelně, bez pojišťováckého žargonu.',
  },
  {
    slug: 'tomas-marek', name: 'Tomáš Marek', role: 'Vedoucí pobočky Praha',
    branch: 'praha', phone: '+420 602 222 333', email: 't.marek@allrisk.cz',
    tags: ['Firmy', 'Nemovitost', 'Investice'], langs: ['Čeština', 'Angličtina'], since: 2011,
    bio: 'Vedu pražský tým. Nejvíc mě baví komplexní případy, kde se potkává pojištění, financování i reality.',
  },
  {
    slug: 'eva-pospisilova', name: 'Eva Pospíšilová', role: 'Poradce · pojištění',
    branch: 'praha', phone: '+420 602 222 334', email: 'e.pospisilova@allrisk.cz',
    tags: ['Vozidla', 'Cestovní', 'Domácnost'], langs: ['Čeština', 'Angličtina'], since: 2019,
    bio: 'Pomůžu vám rychle vyřešit běžné životní pojištění – auto, cestování, domácnost. Reaguji obratem.',
  },
  {
    slug: 'radek-vesely', name: 'Radek Veselý', role: 'Vedoucí pobočky Ostrava',
    branch: 'ostrava', phone: '+420 602 333 444', email: 'r.vesely@allrisk.cz',
    tags: ['Firmy', 'Vozidla', 'Likvidace'], langs: ['Čeština', 'Polština'], since: 2010,
    bio: 'Region znám jako svoje boty. Postarám se i o likvidaci škody – jeden kontakt, žádné přehazování.',
  },
  {
    slug: 'katerina-horakova', name: 'Kateřina Horáková', role: 'Poradce · reality',
    branch: 'ostrava', phone: '+420 602 333 445', email: 'k.horakova@allrisk.cz',
    tags: ['Prodej nemovitostí', 'Nájem', 'Hypotéky'], langs: ['Čeština'], since: 2017,
    bio: 'Prodej i pronájem nemovitostí beru osobně – vaši nabídku posunu tak, aby oslovila ty správné zájemce.',
  },
  {
    slug: 'michal-prochazka', name: 'Michal Procházka', role: 'Vedoucí pobočky Olomouc',
    branch: 'olomouc', phone: '+420 602 444 555', email: 'm.prochazka@allrisk.cz',
    tags: ['Pojištění', 'Finance', 'Zemědělství'], langs: ['Čeština'], since: 2013,
    bio: 'Na Hané řeším od rodinného pojištění po zemědělské provozy. Vždy hledám řešení, které dává smysl i za pět let.',
  },
  {
    slug: 'veronika-bartosova', name: 'Veronika Bartošová', role: 'Vedoucí pobočky Č. Budějovice',
    branch: 'ceske-budejovice', phone: '+420 602 555 666', email: 'v.bartosova@allrisk.cz',
    tags: ['Nemovitost', 'Hypotéky', 'Život'], langs: ['Čeština', 'Němčina'], since: 2014,
    bio: 'Jižní Čechy a jejich lidé jsou moje srdcovka. Provedu vás financováním bydlení od první schůzky po klíče.',
  },
  {
    slug: 'filip-benes', name: 'Filip Beneš', role: 'Vedoucí pobočky Hradec Králové',
    branch: 'hradec-kralove', phone: '+420 602 666 777', email: 'f.benes@allrisk.cz',
    tags: ['Vozidla', 'Firmy', 'Investice'], langs: ['Čeština', 'Angličtina'], since: 2016,
    bio: 'Mám rád jasná čísla a férové podmínky. Porovnám pro vás varianty a doporučím tu, kterou bych zvolil sám.',
  },
  {
    slug: 'simona-kucerova', name: 'Simona Kučerová', role: 'Poradce · pojištění a finance',
    branch: 'breclav', phone: '+420 602 777 888', email: 's.kucerova@allrisk.cz',
    tags: ['Domácnost', 'Život', 'Spoření'], langs: ['Čeština'], since: 2020,
    bio: 'Pomáhám rodinám na Břeclavsku zorientovat se v pojištění i spoření. Klidně i u vás doma.',
  },
  {
    slug: 'ondrej-fiala', name: 'Ondřej Fiala', role: 'Vedoucí pobočky Třebíč',
    branch: 'trebic', phone: '+420 602 888 999', email: 'o.fiala@allrisk.cz',
    tags: ['Pojištění', 'Reality', 'Hypotéky'], langs: ['Čeština'], since: 2015,
    bio: 'Na Vysočině jsem doma. Vyřeším pojištění, prodej nemovitosti i hypotéku, ať nemusíte obíhat víc firem.',
  },
]

// pomocné lookupy
export const branchBySlug = (slug) => BRANCHES.find((b) => b.slug === slug)
export const advisorBySlug = (slug) => ADVISORS.find((a) => a.slug === slug)
export const advisorsForBranch = (slug) => ADVISORS.filter((a) => a.branch === slug)
export const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
