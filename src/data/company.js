// Fakty o spoločnosti Allrisk - JEDEN zdroj pre celý web.
//
// Stránka `/o-nas` (pages/About.jsx) tento súbor 2026-08-12 opäť oživila. Je
// postavená na druhej brožúre - „Profil společnosti Allrisk" (InDesign PDF,
// 2026-08-06) - a preberá jej poradie: Jsme Allrisk → čísla → ekosystém →
// systém péče → formy komunikace → certifikace → Allrisk pomáhá → certifikáty
// → partneri → developerské projekty. (Mapu pobočiek, ktorou brožúra končí,
// stránka od 2026-08-16 nemá - viď poznámku v About.jsx.) Fotky sú vytiahnuté
// z toho istého PDF do `public/o-nas/`.
//
// Zdroje sú DVE brožúry a nemiešajú sa vo vnútri jedného bloku:
//   - „Představení společnosti Allrisk a možností spolupráce" (2026-08-05)
//     → INTRO, LEADERSHIP, FACTS, PARTNERS, PROJECTS, OFFICES a celé care.js
//   - „Profil společnosti Allrisk" (2026-08-06)
//     → LINES, CARE, CHANNELS, EXAMS, HELP, CERTIFICATES
//
// Pravidlo, ktoré tento súbor drží: ten istý fakt smie byť na viacerých
// stránkach, ale nikdy ten istý odstavec. Čísla sa preto neopisujú do
// stránok - každá si vyberie podmnožinu cez `numbers(...)`, a keď klient
// niektoré zmení, mení sa na jednom mieste.

// POZOR: brožúra si v číslach protirečí sama - úvodný text hovorí
// „více než 250 000 klientů", číselná strana „230 000". Platí 230 000
// (číselná strana aj PDF). Kým to klient nepotvrdí, inde sa neopisuje.
// OSEM DLAŽDÍC, poradie aj znenie od usera (2026-08-27). Dlaždica nesie:
//   pre    riadok NAD číslom („Více než", „Staráme se o více než") - je to
//          predložka vety, ktorú dlaždica zhora nadol vyslovuje. Nemá ju každá.
//   value  samotné číslo
//   label  riadok POD číslom
// Riadok nad hodnotou sa raz zmazal (2026-08-17), lebo z neho v úzkej dlaždici
// bol tretí riadok textu naviac; vracia sa, lebo päť z ôsmich čísel je bez neho
// tvrdenie bez miery („23 let" vs „více než 23 let").
export const NUMBERS = {
  naTrhu: { pre: 'Více než', value: '23 let', label: 'na trhu' },
  klienti: { pre: 'Staráme se o více než', value: '240 000', label: 'klientů' },
  pojistne: { pre: 'Více než', value: '1,7 miliardy', label: 've spravovaném pojistném' },
  uvery: { pre: 'Více než', value: '10 miliard Kč', label: 'v poskytnutých úvěrech' },
  vypujcky: { pre: 'Více než', value: '78 000 výpůjček', label: 'vozů z autopůjčovny Allrisk' },
  poradci: { value: '400+', label: 'poradců' },
  skody: { value: '70 000+', label: 'úspěšně zlikvidovaných pojistných škod' },
  pobocky: { value: '70+', label: 'poboček po ČR a SK' },
}

export const numbers = (...keys) => keys.map((k) => NUMBERS[k])

// Pozičný text firmy. Patrí na /o-nas - je publikum-neutrálny a na predajnej
// stránke segmentu by konkuroval jej vlastnému argumentu.
//
// DVA ODSTAVCE, nie štyri (user, 2026-08-17). Znenie sa nemenilo, len sa
// spojilo po dvojiciach a delí sa tam, kde sa mení téma: prvý odstavec je
// KTO sme (postoj + rozsah), druhý ČÍM to držíme (ekosystém + dostupnosť).
// Štyri krátke odstavce vedľa vysokej fotky vyzerali ako štyri odrážky.
export const INTRO = [
  'Svět financí může být složitý a my v Allrisku jsme tu proto, abyste v něm nikdy nebyli sami. Nejsme jen finanční makléř - jsme partner, který stojí na vaší straně. Jako česká poradenská skupina s více než 20letou tradicí pečujeme o statisíce klientů. Naše práce stojí na důvěře, odbornosti a schopnosti být skutečně nablízku.',
  'Naší silou je ekosystém odborníků, technologií a partnerských institucí. S klíčovými bankami, pojišťovnami a stavebními spořitelnami hledáme řešení na míru. Díky síti klientských center jsme dostupní v Česku i na Slovensku. Jako registrovaný nezávislý likvidátor pojistných událostí spolupracujeme se znalci a právními odborníky i tam, kde jde o víc než jen čísla.',
]

// Slovo vedenia. Ide s fotkou zakladateľov - v tlači je to dvojstrana.
// Podpis je od 2026-08-17 vlastný súbor KAŽDÉHO zakladateľa (user dodal
// `signature-polak.png` a `signature-toman.png` s alfou), nie jeden spoločný
// výrez z PDF. Mená pod jednotlivými podpismi sa nevykresľujú (user, 2026-08-17):
// pod textom stojí jeden spoločný riadok `sign` + `role` a pod ním sú už len
// dva obrázky. `founders[].name` tu ostáva ako kľúč a popis súboru.
export const LEADERSHIP = {
  text: [
    'Allrisk jsou především lidé a jejich životní příběhy, které se díky principům a jedinečným myšlenkám mění k lepšímu. Nepřeberná škála jedinečných produktů, které již mnoho let nejsou jen o pojištění či výhradně finančních produktech, staví značku Allrisk do zcela specifické kategorie firem.',
    'Již od roku 2003 si plníme svůj unikátní československý sen pod značkou Allrisk. I nadále se zavazujeme ze všech sil pomáhat lidem plnit sny a vytvářet tak na našem trhu pozitivní otisk, který nemá na evropském trhu obdoby.',
  ],
  sign: 'Jiří Toman & Ing. Ondřej Polák',
  role: 'zakladatelé společnosti',
  photo: '/o-nas/vedeni.jpg',
  founders: [
    { name: 'Ing. Ondřej Polák', role: 'zakladatel společnosti', sign: '/o-nas/signature-polak.png' },
    { name: 'Jiří Toman', role: 'zakladatel společnosti', sign: '/o-nas/signature-toman.png' },
  ],
}

// Registrové údaje. NEVYKRESĽUJÚ SA (user, 2026-08-17): stáli ako tiráž pod
// číslami na modrom páse /o-nas a user ich odtiaľ vyhodil - pás nesie čísla,
// ktoré niečo tvrdia, údaje z rejstříku vedľa nich argument neniesli.
// Prepis z tlače tu zostáva, kým sa nenájde tichšie miesto (pätička, tiráž).
export const FACTS = [
  ['Právní forma', 'akciová společnost'],
  ['Základní jmění', '5 000 000 Kč'],
  ['Limit pojištění odpovědnosti', '50 000 000 Kč'],
  ['Statutární orgány', 'Jiří Toman / člen představenstva · Ing. Ondřej Polák / člen představenstva'],
  ['Dozorčí rada', 'Ivan Maršálek'],
]

// Partneri presne podľa brožúry (s. 18), v jej poradí.
// TODO(loga): v tlači sú to logá. Kým klient nedodá súbory, ide o mená -
// vymýšľať logá alebo dopĺňať partnerov, ktorí v brožúre nie sú, sa nesmie.
export const PARTNERS = [
  'KB Pojišťovna', 'Česká spořitelna', 'ČSOB', 'UniCredit Bank', 'Raiffeisen Bank',
  'mBank', 'J&T Banka', 'Generali Česká pojišťovna', 'Kooperativa', 'Allianz',
  'ČPP', 'UNIQA', 'Direct pojišťovna', 'AXA', 'AP Agra pojišťovna', 'Atradius',
  'CEE Specialty', 'Colonnade', 'Hasičská vzájemná pojišťovna', 'HDI',
  'Inter Partner Assistance', 'MetLife', 'Pillow', 'PVZP', 'Slavia pojišťovna',
  'youplus', 'ARVAL', 'Investona', 'Conseq', 'Cyrrus', 'Modrá pyramida',
  'NN', 'UniLeasing',
]

// Developerské projekty. Je to Reality, nie pojištění - preto na /o-nas
// (dôkaz rozsahu firmy) a neskôr na realitnú stránku, nie na /podnikatele.
//
// ZMAZANÉ 2026-08-17 (user): `PROJECTS_INTRO`, sprievodný text z brožúry (s. 15).
// Boli to tri odstavce, ktoré tvrdili to isté („robíme viac než sprostredkovanie,
// vedieme celý projekt"), v dvoch krokoch z nich nezostal ani jeden. Tvrdenie
// nesie lead sekcie, rozsah projektov ukazujú dlaždice pod ním - výpočet fáz
// medzi tým bol tretí popis toho istého.
export const PROJECTS = [
  {
    key: 'meridiem',
    label: 'Polyfunkční objekt Allrisk MERIDIEM',
    place: 'Brno',
    img: '/o-nas/meridiem.jpg',
  },
  {
    key: 'veselka',
    label: 'Obchodní park Allrisk VESELKA',
    place: 'Troubsko u Brna',
    img: '/o-nas/veselka.jpg',
  },
]

// Adresy centrál. Rovnako ako FACTS sa od 2026-08-17 nevykresľujú - brnianska
// centrála žije aj v branches.js (a teda na /kontakt), bratislavská nikde inde.
export const OFFICES = [
  ['Allrisk, a. s.', 'Komárovská 263/20a, 617 00 Brno'],
  ['Allrisk Slovakia s. r. o.', 'Prievozská 4/B, Apollo Business Center II, 821 09 Bratislava'],
]

/* ============================================================
   „Profil společnosti Allrisk" (2026-08-06) - časti, ktoré prvá
   brožúra nemala. Texty sú prepis z tlače, nie parafráza.
   ============================================================ */

// Ucelený unikátní ekosystém Allrisk (s. 6-7) - CELÝ, tak ako ho vidí ktokoľvek.
// JEDINÝ zdroj sekcie (2026-08-19): firemný rez tých istých línií (`ECOSYSTEM`
// v care.js, kratšie zoznamy) je zmazaný spolu s mriežkou kariet na úvode -
// obe miesta kreslí komponent nad týmto výpočtom z tlače.
//
// `img` sú kolečka z tlače (`public/o-nas/eko-*.jpg`, ~560 px štvorec).
// Ikonu ani názov nenahrádzajú - z výrezov sa nedá poznať, ktorá línia to je,
// takže nesú náladu, nie informáciu. V podobe `foto` sú PODKLADOM kolieska
// a vybranej karty, teda presne tou náladou; menovku nesie ikona a text.
//
// `short` je názov NA KRUŽNICI - do kolieska sa „Pojištění právní ochrany"
// nezmestí a skratka sa aj tak číta vedľa ikony. Plné meno nesie panel vedľa.
// `icon` je kľúč do ECO_ICONS v components/Ecosystem.jsx.
export const LINES = [
  {
    key: 'pojisteni', label: 'Pojištění', short: 'Pojištění', icon: 'shield', img: '/o-nas/eko-pojisteni.jpg',
    desc: 'Komplexní, rychlé a cenově dostupné pojistné služby pro rodiny, podnikatele a firmy.',
    items: ['autopojištění', 'pojištění majetku a odpovědnosti občanů', 'životní a úrazové pojištění',
      'pojištění průmyslu a podnikatelů', 'zemědělské pojištění', 'pojištění měst a obcí'],
  },
  {
    key: 'reality', label: 'Realitní služby', short: 'Reality', icon: 'estate', img: '/o-nas/eko-reality.jpg',
    desc: 'Profesionální a rychlé služby realitní kanceláře pro rodiny a podnikatele.',
    items: ['prodej bytů, domů', 'prodej rekreačních objektů', 'prodej pozemků',
      'prodej komerčních a jiných objektů', 'pronájem bytů, rodinných domů',
      'pronájem komerčních prostor', 'nákup nemovitostí', 'zpětný leasing nemovitostí',
      'developerské projekty'],
  },
  {
    key: 'finance', label: 'Finanční služby', short: 'Finance', icon: 'coins', img: '/o-nas/eko-finance.jpg',
    desc: 'Nabídka variant financování vašich potřeb s maximálně flexibilním a finančně příznivým řešením.',
    items: ['úvěry na bydlení', 'spotřebitelské úvěry', 'investice a vkladové produkty',
      'podnikatelské úvěry', 'stavební spoření', 'doplňkové penzijní spoření',
      'měnové konverze', 'privátní bankovnictví'],
  },
  {
    key: 'servis', label: 'Klientský servis', short: 'Servis', icon: 'help', img: '/o-nas/eko-servis.jpg',
    desc: 'Komfortní služby asistované likvidace pojistných událostí a autopůjčovny poskytované všem našim klientům.',
    items: ['asistovaná likvidace pojistných událostí', 'odborné posudky a poradenství ke škodám',
      'poskytnutí náhradního vozidla při dopravní nehodě i zaviněné a nezaviněné nehodě', 'autopůjčovna'],
  },
  {
    key: 'pravni', label: 'Pojištění právní ochrany', short: 'Právní ochrana', icon: 'scale', img: '/o-nas/eko-pravni.jpg',
    desc: 'Ucelená řada moderních produktů „pojištění právní ochrany" poskytujících NONSTOP právní, poradenské a asistenční služby po celé Evropě.',
    items: ['rodinný právník', 'pojištění právní ochrany motorových vozidel',
      'pojištění právní ochrany domů, bytů, domácností', 'pojištění právní ochrany na cestách',
      'telefonická služba právních informací', 'administrativně právní asistence'],
  },
  {
    key: 'effective', label: 'EFFECTIVE', short: 'EFFECTIVE', icon: 'club', img: '/o-nas/eko-effective.jpg',
    desc: 'Klubový projekt pro naše klienty, který zajišťuje efektivní cestu ke střednědobým a dlouhodobým prostředkům bez navýšení domácího rozpočtu.',
    items: ['extrémně levné telefonování', 'více než operativní leasing',
      'úspora a dlouhodobá péče v oblasti energií'],
  },
]

// Systém péče o klienta (s. 5) - štyri kroky. Nezamieňať s `STEPS` v care.js:
// to je päť krokov spolupráce s FIRMOU z prvej brožúry (plná moc, výberové
// konanie, riziková prehliadka). Toto je publikum-neutrálny cyklus pre každého.
// V tlači ide o stúpajúcu klikatú stuhu v značkovom prechode, preto `tone` -
// odtieň kroku sa berie z tej istej štvorice farieb ako gradient „Line".
export const CARE = [
  { key: 'zjisteni', label: 'Zjištění informací', desc: 'Aktuální stav, možnosti, potřeby, cíle, zkušenosti', tone: 'dark' },
  { key: 'vyhodnoceni', label: 'Vyhodnocení', desc: 'Analýza informací, srovnání možností, volba řešení', tone: 'cyan' },
  { key: 'reseni', label: 'Řešení', desc: 'Návrh optimální varianty a její realizace', tone: 'purple' },
  { key: 'pece', label: 'Následná péče', desc: 'Dlouhodobý servis', tone: 'violet' },
]

// Formy moderní komunikace (s. 4). Klient si vyberá, kde sa stretnutie odohrá -
// preto sú to tri rovnocenné možnosti, nie rebríček.
export const CHANNELS = [
  { key: 'doma', icon: 'home', label: 'U vás doma', desc: 'Osobní kontakt u vás doma nebo v práci.' },
  { key: 'centrum', icon: 'office', label: 'U nás na klientském centru Allrisk', desc: 'Návštěva v klientském centru nebo obchodní kanceláři.' },
  { key: 'video', icon: 'video', label: 'On-line videohovor', desc: 'Pomocí videohovoru z vašeho oblíbeného místa.' },
]

// Certifikace v oboru (s. 8) - odborné skúšky, ktorými poradcovia disponujú.
//
// POZOR na tlačovú chybu: v brožúre sú DVA bloky nadpísané „Realitní
// zprostředkování", pričom druhý z nich vymenúva skúšky na spotřebitelské
// úvěry (zákon č. 257/2016 Sb.), nie realitné. Web ho preto pomenúva podľa
// obsahu. Kým to klient nepotvrdí, v tlači to zostáva chyba - nedopĺňať ju
// späť podľa PDF.
export const EXAMS = [
  {
    key: 'pojisteni', label: 'Pojištění', items: [
      'Životní pojištění',
      'Pojištění motorových vozidel',
      'Neživotní občanské pojištění',
      'Neživotní pojištění podnikatelů',
      'Pojištění velkých pojistných rizik',
      'Pojištění motorových vozidel a životní pojištění (1. + 2.)',
      'Neživotní občanské pojištění a životní pojištění (1. + 3.)',
      'Neživotní pojištění podnikatelů a životní pojištění (1. + 4.)',
      'Pojištění velkých pojistných rizik a životního pojištění - souhrnná zkouška (1.-5.)',
    ],
  },
  {
    key: 'uvery', label: 'Spotřebitelské úvěry', items: [
      'Spotřebitelské úvěry jiné než na bydlení',
      'Vázané spotřebitelské úvěry',
      'Spotřebitelské úvěry na bydlení',
      'Spotřebitelské úvěry jiné než na bydlení a spotřebitelské úvěry na bydlení',
    ],
  },
  { key: 'investice', label: 'Investice', items: ['Kapitálový trh I.', 'Kapitálový trh II.'] },
  { key: 'penze', label: 'Doplňkové penzijní spoření', items: ['Doplňkové penzijní spoření'] },
  { key: 'reality', label: 'Realitní zprostředkování', items: ['Zkouška odborné způsobilosti - realitní zprostředkovatel'] },
]

// Allrisk pomáhá (s. 9). Tri projekty, ktoré firma podporuje.
//
// TVAR PODĽA TLAČE (user, 2026-08-17). Nadpis je v brožúre dvojriadkový:
// veľký názov a pod ním menší dovetok - `label` je ten veľký riadok, `note`
// ten menší, a spolu dávajú celé meno projektu („Fond" + „ohrožených dětí").
// Preto sa `note` nesmie prepísať na popis služby; ten riadok je časť názvu.
// Pod ním stojí `desc` - SKRÁTENÉ znenie z tlače (user, 2026-08-17): pôvodné
// odstavce mali štyri až šesť riadkov na kartu a z malej sekcie robili stenu
// textu. Plné znenie je v brožúre, tu má stáť podstata.
// Všetko troje sedí v tej istej modrej dlaždici ako logo, pod ním - logá sú
// výrezy z PDF a majú modrú zapečenú v obrázku, takže karta na ňu nadväzuje.
export const HELP = [
  {
    key: 'uptodate', label: 'UpToDate', note: 'Znalostní systém pro lékařskou praxi',
    img: '/o-nas/pomaha-uptodate.jpg',
    desc: 'Sponzorujeme online systém ověřených klinických odpovědí. Pomáhá lékařům v praxi, fakultám při výuce i v celoživotním vzdělávání.',
  },
  {
    key: 'fod', label: 'Fond', note: 'ohrožených dětí',
    img: '/o-nas/pomaha-fod.jpg',
    desc: 'Podporujeme ho tím, co umíme nejlépe: auditem pojistných smluv a vyjednáváním podmínek s pojišťovnami. K tomu přidáváme finanční podporu.',
  },
  {
    key: 'krtek', label: 'Nadační fond', note: 'dětské onkologie KRTEK',
    img: '/o-nas/pomaha-krtek.jpg',
    desc: 'Zajistili jsme pojištění všech účastníků letního tábora. Fond se stará o onkologicky nemocné děti během léčby i po ní.',
  },
]

// Certifikáty (s. 12-13). Od 2026-08-17 sú to súbory dodané userom
// (`certificate-aaa.png`, `award.png`), nie výrezy z PDF - preto aj čistejšie
// hrany a skutočný pomer strán namiesto orezu tlačovej strany.
//
// POZOR: v tlači sú texty oboch ocenení PREHODENÉ - pod nadpisom o skóringu
// stojí popis súťaže Zaměstnavatel regionu a naopak. Web ich páruje správne
// (skóring = Dun & Bradstreet AAA, striebro = Zaměstnavatel regionu 2020).
// Hlásené klientovi 2026-08-12, do potvrdenia sa späť podľa PDF neprehadzuje.
// Každý certifikát je vlastná sekcia na /o-nas: štítok, nadpis (`title` je
// nábeh, `titleB` tučný koniec), text, u skóringu aj rad rokov - a proti nemu
// obrázok certifikátu (u prvého vpravo, u druhého vľavo).
export const CERTIFICATES = [
  {
    key: 'aaa',
    ey: 'Certifikáty',
    title: 'Devětkrát za sebou to nejvyšší',
    titleB: 'skóringové ocenění pro Allrisk',
    img: '/o-nas/certificate-aaa.png',
    alt: 'Certifikát Dun & Bradstreet: Allrisk, a.s. - hodnocení nejvyšší důvěryhodnosti AAA',
    years: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    text: [
      'Certifikát potvrzuje spolehlivost, důvěryhodnost a minimální rizikovost spolupráce s naší společností. Hodnocení CZECH Stability Award AAA vyjadřuje současný stav a finanční situaci včetně predikce budoucího rizika a zároveň poskytuje nezávislý pohled na finanční a nefinanční bonitu firmy.',
      'Nejvyšší ocenění AAA je udělováno na základě silného a nezávislého ratingu firem, jehož historie sahá až do roku 1908.',
    ],
  },
  {
    key: 'zamestnavatel',
    ey: 'Ocenění',
    title: 'Allrisk.',
    titleB: 'Zaměstnavatel se stříbrným oceněním',
    img: '/o-nas/award.png',
    alt: 'Certifikát Zaměstnavatel regionu 2020: Allrisk, a. s., 2. místo v kategorii do 500 zaměstnanců',
    text: [
      'Hodnocení Zaměstnavatel regionu se od roku 2003 zaměřuje na společnosti v České republice z pohledu lidských zdrojů. Smyslem soutěže je lidem přiblížit společnosti s výborným přístupem ke svým zaměstnancům, a to nejen celostátně, ale i v jednotlivých regionech.',
      'Hodnocení probíhá metodikou Saratoga od mezinárodně uznávané společnosti PricewaterhouseCoopers, která nejprve porovnává firmy ve třech hlavních oblastech - HR, produktivitě a financích - a následně v dalších 14 ukazatelích. Druhé místo v regionálním kole Jihomoravského kraje v kategorii do 500 zaměstnanců potvrzuje stabilitu a čestnost Allrisku jako zaměstnavatele.',
    ],
  },
]
