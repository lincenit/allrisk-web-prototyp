// Fakty o spoločnosti Allrisk - JEDEN zdroj pre celý web.
//
// POZOR: stránka /o-nas bola 2026-08-10 zrušená. Používajú sa už len NUMBERS
// (cez `numbers(...)`) a PARTNERS. Zvyšok - INTRO, LEADERSHIP, FACTS, PROJECTS,
// OFFICES - je prepis z brožúry, ktorý zatiaľ nemá kde bývať; nechávam ho tu,
// aby sa nemusel prepisovať znova, keď sa preň miesto nájde. Fotky, na ktoré
// odkazuje, ležia v public/o-nas/.
//
// Zdroj: brožúra „Představení společnosti Allrisk a možností spolupráce"
// (InDesign PDF, 2026-08-05).
//
// Pravidlo, ktoré tento súbor drží: ten istý fakt smie byť na viacerých
// stránkach, ale nikdy ten istý odstavec. Čísla sa preto neopisujú do
// stránok - každá si vyberie podmnožinu cez `numbers(...)`, a keď klient
// niektoré zmení, mení sa na jednom mieste.

// POZOR: brožúra si v číslach protirečí sama - úvodný text hovorí
// „více než 250 000 klientů", číselná strana „230 000". Platí 230 000
// (číselná strana aj PDF). Kým to klient nepotvrdí, inde sa neopisuje.
export const NUMBERS = {
  klienti: { value: '230 000', label: 'klientů' },
  poradci: { value: '300+', label: 'poradců' },
  skody: { value: '70 000+', label: 'úspěšně zlikvidovaných škod' },
  pojistne: { value: '1,6 mld. Kč', label: 've spravovaném pojistném' },
  uvery: { value: '8,6 mld. Kč', label: 'v poskytnutých úvěrech' },
  pobocky: { value: '50+', label: 'poboček po ČR a SK' },
  odRoku: { value: '2003', label: 'na trhu již od roku' },
}

// Výber čísel pre konkrétnu stránku. Firmu zaujíma niečo iné než domácnosť:
// na /podnikatele stoja škody a spravované pojistné, na úvode klienti a úvery.
export const numbers = (...keys) => keys.map((k) => NUMBERS[k])

// Pozičný text firmy. Patrí na /o-nas - je publikum-neutrálny a na predajnej
// stránke segmentu by konkuroval jej vlastnému argumentu.
export const INTRO = [
  'Svět financí může být složitý a my v Allrisku jsme tu proto, abyste v něm nikdy nebyli sami. Nejsme jen finanční makléř - jsme partner, který stojí na vaší straně v každé životní situaci.',
  'Jako česká poradenská skupina s více než 20letou tradicí pečujeme o statisíce klientů. Naše práce stojí na důvěře, odbornosti a schopnosti být dostupní, srozumitelní a skutečně nablízku.',
  'Naší silou je unikátní ekosystém odborníků, technologií a partnerských institucí. Ve spolupráci s klíčovými bankami, pojišťovnami a stavebními spořitelnami nabízíme komplexní řešení na míru potřebám našich klientů.',
  'Díky rozsáhlé síti klientských center jsme dostupní v Česku i na Slovensku. Jako registrovaný nezávislý likvidátor pojistných událostí spolupracujeme se specializovanými znalci a právními odborníky, abychom klientům pomohli i v situacích, kdy jde o víc než jen čísla.',
]

// Slovo vedenia. Ide s fotkou zakladateľov - v tlači je to dvojstrana.
export const LEADERSHIP = {
  text: [
    'Allrisk jsou především lidé a jejich životní příběhy, které se díky principům a jedinečným myšlenkám mění k lepšímu. Nepřeberná škála jedinečných produktů, které již mnoho let nejsou jen o pojištění či výhradně finančních produktech, staví značku Allrisk do zcela specifické kategorie firem.',
    'Již od roku 2003 si plníme svůj unikátní československý sen pod značkou Allrisk. I nadále se zavazujeme ze všech sil pomáhat lidem plnit sny a vytvářet tak na našem trhu pozitivní otisk, který nemá na evropském trhu obdoby.',
  ],
  sign: 'Jiří Toman & Ing. Ondřej Polák',
  role: 'zakladatelé společnosti',
  photo: '/o-nas/vedeni.jpg',
}

// Registrové údaje. Jediné miesto na webe, kde majú stáť - na predajnej
// stránke sú to čísla bez publika.
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

export const OFFICES = [
  ['Allrisk, a. s.', 'Komárovská 263/20a, 617 00 Brno'],
  ['Allrisk Slovakia s. r. o.', 'Prievozská 4/B, Apollo Business Center II, 821 09 Bratislava'],
]
