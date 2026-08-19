import { numbers } from './company.js'

// Systém péče o klienta - obsah pre segment Podnikatelé.
//
// Zdroj: brožúra „Představení společnosti Allrisk a možností spolupráce"
// (InDesign PDF, 2026-08-05). Texty sú prepisom z tlače, nie parafrázou.
//
// Stránka /podnikatele bola 2026-08-10 zredukovaná na dve sekcie: „Proč si
// vybrat Allrisk" a „Jakým způsobem pracujeme". Dáta k zrušeným sekciám
// (ASSIST, CLAIMS, COVERS, PROOF) zostávajú dole - sú prepísané z brožúry
// a nemá zmysel ich písať znova, keby sa vrátili.

// Sedem tvrdení zo strany 6 brožúry. Prvé je v tlači vysadené inak (je to
// zastrešujúci sľub, nie jeden z radu) - preto `lead: true`. Na webe je z neho
// od 2026-08-16 VETA SEKCIE, nie karta: nadpis, veta pod ním aj tá karta
// hovorili ten istý sľub trikrát za sebou.
// `icon` je kľúč do mapy v BizCare.jsx; ikony nepatria do dát, lebo tie
// isté texty môže použiť aj iná stránka s iným vizuálom.
// DVE ZNENIA POPISU (2026-08-17, user: „skús poskracovať subtexty kartičiek"):
//   desc  - plný prepis z tlače. NEMAZAŤ, je to zdroj a inde sa môže hodiť.
//   short - jedna veta do dlaždice na úvode. V tlači má karta celý odstavec,
//           na webe stojí šesť dlaždíc vedľa seba a šesť odstavcov naraz je
//           stena textu - dlaždica má povedať tvrdenie, nie ho vysvetliť.
// Vypisuje sa `short`; keby chýbal, komponent siahne po `desc`.
// Zastrešujúce tvrdenie (`lead: true`) `short` nemá - na úvode sa nevypisuje
// vôbec (nadpis sekcie hovorí to isté).
export const PRINCIPLES = [
  { key: 'partner', icon: 'partner', lead: true, label: 'Jsme váš osobní partner', desc: 'Máte jednoho odborníka, který zná vaši situaci, mluví srozumitelně a je vám k dispozici, když ho potřebujete.' },
  { key: 'jistota', icon: 'check', label: 'Jistota správného rozhodnutí', short: 'Pojistný program na míru, ne ceník produktů.', desc: 'Neprodáváme produkty, ale pomáháme vám zvolit řešení, která dávají dlouhodobý smysl. Připravíme pojistný program na míru vašemu podnikání.' },
  { key: 'opora', icon: 'opora', label: 'Opora při škodách', short: 'Škodu řešíme s pojistitelem za vás.', desc: 'V krizových situacích stojíme na vaší straně. Zastupujeme vás při likvidaci pojistných událostí a hájíme vaše zájmy.' },
  { key: 'rizika', icon: 'rizika', label: 'Rozpoznání vašich rizik', short: 'Najdeme, co vaše podnikání skutečně ohrožuje.', desc: 'Díváme se na vaše podnikání v souvislostech. Identifikujeme klíčová rizika a navrhneme funkční ochranu, ne jen formální krytí.' },
  { key: 'pece', icon: 'pece', label: 'Dlouhodobá péče', short: 'Smlouvy aktualizujeme, jak se firma mění.', desc: 'Pojištěním spolupráce nekončí. Pravidelně aktualizujeme smlouvy a sledujeme změny trhu i vašeho podnikání.' },
  { key: 'kvalita', icon: 'kvalita', label: 'Kvalita a hodnota', short: 'Ne nejlevnější, ale nejlepší poměr cena/výkon.', desc: 'Prověřujeme stávající smlouvy a hledáme lepší rozsah, podmínky i servis. Nehledáme nejlevnější řešení, ale nejlepší poměr cena/výkon.' },
  { key: 'vyber', icon: 'vyber', label: 'Aktivní výběr řešení', short: 'Před výročím ověříme, jestli je pořád nejlepší.', desc: 'Před výročím smluv ověřujeme, zda je vaše pojištění stále tou nejlepší volbou.' },
]

// Päť krokov spolupráce (brožúra s. 8). Poradie je záväzné, čísla sa
// vypisujú z indexu - v tlači sú „1." až „5." súčasťou nadpisu.
// Texty sú plné znenia z tlače, nie skratky.
export const STEPS = [
  { key: 'setkani', label: 'Úvodní setkání', desc: 'Na začátku spolupráce si ujasníme vaše potřeby a očekávání. Dohodneme rámec spolupráce a na základě plné moci vás můžeme zastupovat při jednání s pojistiteli, od získání nabídek až po správu pojistných událostí.' },
  { key: 'analyza', label: 'Analýza potřeb', desc: 'Prověříme váš stávající pojistný program a posoudíme rizika v kontextu vašeho podnikání. U složitějších případů nebo vyšších hodnot majetku provádíme i rizikovou prohlídku.' },
  { key: 'vyber', label: 'Výběr nejlepšího řešení', desc: 'Zahajujeme výběrové řízení na pojistném trhu a jednotlivé varianty porovnáváme podle rozsahu krytí, kvality podmínek a vašich skutečných potřeb. Výsledky vždy prezentujeme srozumitelně a s jasným doporučením.' },
  { key: 'realizace', label: 'Realizace', desc: 'Po výběru optimální varianty zajistíme sjednání nebo úpravu pojistných smluv. Administrativu přebíráme za vás a komunikaci přizpůsobujeme vašim preferencím.' },
  { key: 'pece', label: 'Následná péče', desc: 'Zůstáváme vaším partnerem i po sjednání pojištění. Zajišťujeme dlouhodobý servis, pravidelnou aktualizaci smluv a aktivní pomoc při pojistných událostech.' },
]

/* ============================================================
   ZAPARKOVANÉ - patrí k sekciám, ktoré boli zo stránky odstránené
   2026-08-10. Nemazať bez dohody: je to prepis z brožúry.
   ============================================================ */

// Tri veci, ktoré brožúra stavia ako konkurenčnú výhodu, nie ako produkt.
//   tag   - štítok nad názvom v obsahu stránky
//   short - veta do sklenenej karty v hero (tam je pod názvom veta, nie štítok,
//           rovnako ako na /vozidla - je to ten istý prvok)
// „Plná asistence" je v tlači postavená proti trhovému štandardu (základní
// asistence) - to porovnanie patrí na stránku, do panelu ide len tvrdenie.
export const PILLARS = [
  {
    key: 'likvidace',
    label: 'Centrum likvidace pojistných událostí',
    desc: 'Vlastní centrum, registrované u ČNB. Na plnou moc vás provedeme celou likvidací - nejen připravíme podklady.',
    tag: 'Plná asistence',
    short: 'Na plnou moc vás provedeme celou likvidací.',
  },
  {
    key: 'garant',
    label: 'Váš odborný garant',
    desc: 'Jeden člověk, který zná vaši firmu, je hlavním kontaktem a dohlíží, aby pojištění odpovídalo aktuální situaci.',
    tag: 'Následná péče',
    short: 'Jeden člověk, který zná vaši firmu.',
  },
  {
    key: 'flotily',
    label: 'Vozový park pod kontrolou',
    desc: 'Jedna platba za všechny vozy bez limitu, náhradní vozidlo po nehodě až na 20 dní a asistence v základu.',
    tag: 'Autopojištění Allrisk',
    short: 'Jedna platba za všechny vozy bez limitu.',
  },
]

// Dve úrovne asistencie pri škode. V brožúre je to porovnanie postavené ako
// hlavná konkurenčná výhoda: `market: true` = čo je bežný štandard u makléřov,
// druhá úroveň je to, čo robí Allrisk navyše a zdarma.
export const ASSIST = [
  {
    key: 'zakladni', label: 'Základní asistence', market: true,
    desc: 'Pomůžeme s přípravou podkladů a konzultací.',
    note: 'Standard na trhu',
  },
  {
    key: 'plna', label: 'Plná asistence', market: false,
    desc: 'Na plnou moc zastupujeme klienta a provedeme ho celým procesem likvidace.',
    note: 'Allrisk, zdarma',
  },
]

// Čo pre klienta zaisťuje vlastné Centrum likvidace (brožúra s. 15).
// Prvá položka nesie to, čo do 2026-08-16 stálo ako veta nad zoznamom (rozdiel
// oproti trhovému štandardu). User ju chcel v zozname, nie zvlášť - preto je
// o niečo dlhšia než zvyšok. Položky sú JEDEN riadok, bez podtextu.
export const CLAIMS = [
  'Vlastní Centrum likvidace, ne jen základní asistence makléře',
  'Konzultace ještě před nahlášením události',
  'Vysvětlení postupu a přehled dokladů',
  'Oznámení pojistiteli na plnou moc',
  'Dohled nad zákonnými lhůtami',
  'Kontrola výše pojistného plnění',
  'Odvolání proti stanovisku pojistitele',
  'Návrh úprav rizik a pojistných částek',
  'Zachování mobility podle smluvních podmínek',
]

// Čo firmám pojišťujeme - zámerne skupiny, nie 12 samostatných pojištění.
// Zoznam produktov zostáva v menu.js a panel naň odkazuje jedným riadkom.
// `to` mieri na existujúcu položku katalógu, aby odkaz nebol slepý.
export const COVERS = [
  { label: 'Majetek a odpovědnost', to: 'Odpovědnost za škodu' },
  { label: 'Průmyslová a technická rizika', to: 'Průmyslová nebezpečí' },
  { label: 'Vozidla a flotily', to: 'Vozidla / flotily' },
  { label: 'Lidé ve firmě', to: 'Život a úraz' },
  { label: 'Kybernetická rizika', to: 'Kybernetická rizika' },
  { label: 'Přeprava a zemědělství', to: 'Přepravní pojištění' },
]

// Dôkazová vrstva. Čísla NEŽIJÚ tu - sú v data/company.js, aby sa neopisovali
// na každej stránke zvlášť. Tu je len výber, ktorý dáva zmysel firme:
// vyriešené škody a spravované pojistné hovoria B2B, počet klientov a úvery
// na bydlení patria skôr na úvod pre domácnosti.
export const PROOF = numbers('skody', 'pojistne', 'poradci', 'odRoku')

/* ============================================================
   Zvyšné štyri strany brožúry, ktoré patria podnikateľom.
   Texty sú prepis z tlače, nie parafráza.
   ============================================================ */

// Následná péče (brožúra s. 12). Garant je hlavný argument, päť bodov je,
// čo pre klienta reálne robí.
// Garant je od 2026-08-16 PRVÁ POLOŽKA zoznamu, nie veta nad ním (user):
// obsah tej vety sa presunul sem, aby sekcia nehovorila to isté dvakrát. Preto
// je dlhšia než zvyšok. Položky sú JEDEN riadok, bez podtextu.
export const AFTERCARE = [
  'Přidělený odborný garant, který hlídá, aby pojištění odpovídalo situaci firmy',
  'Servisní schůzky a aktualizace smluv podle vývoje firmy',
  'Posouzení návazností dalších pojištění a doporučení úprav',
  'Průběžná analýza podmínek proti reálným potřebám',
  'Vyhodnocování škodního průběhu s návrhem opatření',
  'Poptávkové řízení před výročím smluv',
]

// Autopojištění Allrisk (brožúra s. 16). Desať krytí, ktoré sú inde za
// príplatok. `note` je podmienka z tlače, nie marketingový dovetok.
export const FLEET = [
  { icon: 'car', label: 'Náhradní vozidlo', note: 'Po nehodě až na 20 dní zdarma' },
  { icon: 'tow', label: 'Odtah a vyproštění', note: 'V rámci ČR po nehodě, bez limitu' },
  { icon: 'help', label: 'Asistence při likvidaci', note: 'Pomoc s vyřízením od A do Z' },
  { icon: 'animal', label: 'Střet se zvěří', note: 'Bez spoluúčasti' },
  { icon: 'tyre', label: 'Pneumatiky', note: 'Proti defektu nebo proražení' },
  { icon: 'disc', label: 'Zničení disků', note: 'Po špatné vozovce, bez spoluúčasti' },
  { icon: 'cable', label: 'Kabeláž poškozená zvířetem', note: 'Bez spoluúčasti' },
  { icon: 'trailer', label: 'Přívěs', note: 'Asistence pro přívěs do 750 kg' },
  { icon: 'law', label: 'Právní ochrana', note: 'Základní balíček zdarma' },
  { icon: 'storm', label: 'Živel a vandalismus', note: 'Asistence již v základním programu' },
]

// ZMAZANÉ 2026-08-19 (user: „necháj label a title, zvyšok vymeň za to, čo je na
// about"): ECOSYSTEM - firemný rez šiestich línií z brožúry s. 10. Sekciu na
// úvode aj na /o-nas nesie teraz jeden komponent (components/Ecosystem.jsx) nad
// LINES z data/company.js, takže druhý text k tým istým líniám už nemá kto
// vypísať. Je v gite.
