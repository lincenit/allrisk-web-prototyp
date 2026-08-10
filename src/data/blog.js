// Blog (/blog) - JEDEN zdroj pravdy pre tri kontexty:
//   1. /blog               - výpis článkov, rubriky ako filter
//   2. /blog/:slug         - detail článku
//   3. produktová stránka  - tie isté články, len filtrované cez `product`
//
// Názvoslovie: „blog" je táto živá sekcia, „Allrisk Magazín" je tlačená ročenka
// v PDF (PRINT nižšie). Sú to dve rôzne veci a nesmú si prehodiť názvy.
//
// Väzba článok × produkt je zámerne rovnaká ako väzba situácia × produkt v profiles.js:
// `product` je kľúč do PRODUCTS_META a `sub` je konkrétny podprodukt (doslova label
// záložky na produktovej stránke), aby karta článku pod produktom hovorila tým istým
// jazykom ako záložky nad ňou. Vďaka tomu sa článok nikam „nepridáva ručne" - stačí
// mu dať `product` a objaví sa na stránke daného produktu.
//
// `author` je slug poradcu z branches.js - článok tak vždy vedie na konkrétneho človeka
// (/poradce/:slug), nie na anonymnú redakciu.
// Ikony sú KĽÚČE (rovnako ako v menu.js), komponenty k nim mapuje ArticleParts.jsx.

// Dočasné fotky z Unsplashe (Unsplash License - voľné aj komerčne, bez povinnej
// atribúcie), rovnaký spôsob ako fotky pobočiek v branches.js. Až budú vlastné
// fotky Allrisku, nahradí sa jediný riadok v článku.
const photo = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

// Foto pod hlavičkou /blog. Nie je viazané na článok, preto stojí zvlášť.
export const HERO_PHOTO = photo('1521737604893-d14cc237f11d', 1800)

// ---- rubriky = tri obchodné línie + zákulisie firmy ----
// Držia sa CATS z menu.js, aby človek nemusel prekladať názvy medzi menu a blogom.
export const RUBRICS = [
  { key: 'pojisteni', label: 'Pojištění', icon: 'shield' },
  { key: 'reality', label: 'Reality', icon: 'building' },
  { key: 'finance', label: 'Finance', icon: 'chart' },
  { key: 'firma', label: 'Ze života Allrisku', icon: 'users' },
]

export const rubricLabel = (key) => RUBRICS.find((r) => r.key === key)?.label || key
export const rubricIconKey = (key) => RUBRICS.find((r) => r.key === key)?.icon || 'shield'

// ---- stavebné bloky textu ----
// Telo článku je dáta, nie JSX - rovnako ako všetko ostatné v src/data/.
// Vykresľuje ich ArticleBody v components/ArticleParts.jsx.
const p = (x) => ({ t: 'p', x })
const h = (x) => ({ t: 'h', x })
const ul = (...x) => ({ t: 'ul', x })
const num = (...x) => ({ t: 'num', x })
const quote = (x, who) => ({ t: 'quote', x, who })
const note = (title, x) => ({ t: 'note', title, x })

// ---- články ----
// Zoradené od najnovšieho - výpis ich berie v tomto poradí.
export const ARTICLES = [
  {
    slug: 'podpojisteni-vozidla',
    rubric: 'pojisteni',
    product: 'vozidla',
    sub: 'Havarijní pojištění',
    title: 'Podpojištění vozidla: proč pojišťovna vyplatí míň, než čekáte',
    perex: 'Auto máte pojištěné na cenu, za kterou jste ho kupovali. Škoda se ale počítá z ceny dnešní - a ten rozdíl doplácíte vy. Ukazujeme, kde vzniká a jak ho za deset minut odstranit.',
    img: photo('1503376780353-7e6692767b70'),
    author: 'petr-svoboda',
    date: '2026-07-28',
    read: 6,
    body: [
      p('Podpojištění je nejtišší chyba v celém autopojištění. Nic se neděje, smlouva běží, platíte každý měsíc - a přijde se na to až ve chvíli, kdy pojišťovna počítá škodu. Tedy přesně tehdy, kdy s tím už nejde nic udělat.'),
      h('Kde vzniká'),
      p('Pojistná částka u havarijního pojištění má odpovídat obvyklé ceně vozu. Tu jste ale nastavili v den sjednání a od té doby se nezměnila. Vůz mezitím stárne - a naopak: u některých ročníků a modelů ceny ojetin v posledních letech vyrostly, takže i tříleté auto může mít dnes vyšší cenu než v den, kdy jste smlouvu podepisovali.'),
      p('Druhý zdroj je výbava. Tažné zařízení, zimní sada kol, nadstandardní audio nebo dodatečně montovaná nástavba se do pojistné částky nedostanou samy. Pokud je do smlouvy nikdo nepřipsal, pojištěné nejsou.'),
      note('Příklad z praxe', 'Vůz pojištěný na 480 000 Kč, obvyklá cena v době škody 600 000 Kč. Podpojištění je 20 %. Po nárazu do svodidel vyčíslí servis opravu na 180 000 Kč - pojišťovna krátí o stejných 20 % a vyplatí 144 000 Kč. Rozdíl 36 000 Kč platíte vy, přestože jste pojistné hradili řádně celou dobu.'),
      h('Proč to nezachytí ani roční přehled'),
      p('Výroční dopis od pojišťovny obvykle oznamuje jen novou výši pojistného, ne to, jestli pojistná částka pořád sedí. Kontrola je na vás - nebo na poradci, který smlouvu vede.'),
      quote('Klienti se nejčastěji diví u aut starých čtyři až šest let. Do té doby to nikdo neřeší a zrovna v téhle době se rozdíl mezi smlouvou a realitou rozjede nejvíc.', 'petr-svoboda'),
      h('Jak to opravit'),
      num(
        'Zjistěte obvyklou cenu vozu k dnešnímu dni - stačí inzerce srovnatelných kusů se stejným rokem výroby a nájezdem.',
        'Porovnejte ji s pojistnou částkou ve smlouvě. Rozdíl nad 10 % už stojí za změnu.',
        'Doplňte výbavu, která ve smlouvě chybí - tažné, kola, nástavbu, vestavěnou techniku.',
        'Zkontrolujte spoluúčast. Nižší pojistná částka bývá výsledkem snahy zlevnit; často je levnější sáhnout na spoluúčast než na krytí.',
      ),
      p('Změna pojistné částky je dodatek ke smlouvě, ne nová smlouva - nepřicházíte o bonus ani o délku pojištění. U nás ji vyřeší poradce na jednom telefonátu.'),
      h('Co si z toho odnést'),
      ul(
        'Podpojištění se neprojeví na ceně, jen na výplatě.',
        'Krátí se poměrem, takže bolí i u drobných oprav, ne až u totální škody.',
        'Revize jednou ročně stačí - u vozů starších čtyř let je to prakticky povinnost.',
      ),
    ],
  },
  {
    slug: 'havarijni-nebo-povinne-ruceni',
    rubric: 'pojisteni',
    product: 'vozidla',
    sub: 'Povinné ručení',
    title: 'Havarijní pojištění, nebo stačí povinné ručení? Rozhodněte se podle tří otázek',
    perex: 'Nejčastější dotaz na pobočkách nemá univerzální odpověď. Má ale tři otázky, po kterých je odpověď během chvíle jasná.',
    img: photo('1494976388531-d1058494cdd8'),
    author: 'eva-pospisilova',
    date: '2026-07-14',
    read: 5,
    body: [
      p('Povinné ručení kryje to, co způsobíte druhým. Havarijní pojištění kryje váš vlastní vůz - a to i tehdy, když za škodu nikdo jiný nemůže. To je celý rozdíl. Otázka tedy nezní „co je lepší", ale „unesu škodu na svém autě sám?".'),
      h('1. Kolik by vás stálo nahradit auto zítra'),
      p('Ne opravit - nahradit. Pokud je odpověď „musel bych si půjčit" nebo „nedal bych to z rezervy", havarijní pojištění dává smysl bez ohledu na stáří vozu. Pokud je vůz v hodnotě jedné výplaty a máte druhé auto, odpověď je jiná.'),
      h('2. Kde vůz parkuje a kolik s ním najezdíte'),
      p('Rozhoduje expozice, ne cena vozu. Auto stojící přes noc v ulici ve velkém městě a 30 000 km ročně po dálnicích je jiný případ než vůz v garáži a 6 000 km ročně po okrese.'),
      note('Nezapomeňte na to, co není nehoda', 'Většina škod na havarijním pojištění není srážka dvou aut. Je to krupobití, spadlý strom, sražená zvěř, vandalismus a odcizení. Přesně to jsou situace, kde vám povinné ručení nepomůže, protože viník neexistuje nebo se nenajde.'),
      h('3. Máte úvěr nebo leasing?'),
      p('Pokud vůz ještě není váš, havarijní pojištění po vás bude chtít financující strana - a bude mít i podmínky na výši spoluúčasti. Tady se rozhodovat nedá, jen se dá vybírat mezi nabídkami.'),
      h('Střední cesta, o které se moc nemluví'),
      p('Mezi „jen povinné ručení" a plným havarijním pojištěním je celá řada dílčích krytí: čelní sklo, živel, odcizení, střet se zvěří. Za zlomek ceny plného havarijního pojištění pokryjí právě ty škody, které statisticky přijdou nejčastěji. Pro starší vůz to bývá nejrozumnější kombinace.'),
      quote('U aut nad deset let řešíme s klienty nejčastěji sklo a živel. Plné havarijní pojištění by u nich už nedávalo poměr, ale nechat je úplně bez krytí taky ne.', 'eva-pospisilova'),
    ],
  },
  {
    slug: 'co-delat-po-nehode',
    rubric: 'pojisteni',
    product: 'vozidla',
    sub: 'Asistenční služby',
    title: 'Co dělat po nehodě: šest kroků, které rozhodnou o výplatě',
    perex: 'První hodina po nehodě rozhoduje o tom, jak rychle a jestli vůbec dostanete zaplaceno. Tady je pořadí, ve kterém postupovat.',
    img: photo('1449965408869-eaa3f722e40d'),
    author: 'petr-svoboda',
    date: '2026-06-30',
    read: 4,
    body: [
      p('Nehoda je stres a stres škrtá paměť. Proto tenhle postup - projděte ho jednou teď a v tu chvíli se vám vybaví sám.'),
      h('1. Zabezpečte místo'),
      p('Výstražná světla, vesta, trojúhelník. Až potom se řeší papíry. Zdraví a další kolize mají přednost před vším ostatním.'),
      h('2. Rozhodněte, jestli volat policii'),
      p('Policii volejte vždy při zranění, při škodě nad 200 000 Kč, při poškození majetku třetí osoby nebo když se neshodnete na viníkovi. Ve všech ostatních případech stačí záznam o dopravní nehodě, podepsaný oběma stranami.'),
      h('3. Foťte dřív, než s auty pohnete'),
      p('Celkový pohled na postavení vozů, pak detaily poškození, SPZ obou vozidel, stav vozovky a dopravní značení. Radši dvacet fotek navíc - dodělat je zpětně nejde.'),
      note('Nejčastější chyba', 'Auta se odklidí ze silnice dřív, než vznikne jediná fotka. Bez záznamu polohy se pak viník dokazuje těžko a likvidace se protáhne o týdny.'),
      h('4. Sepište záznam o nehodě'),
      p('Údaje z dokladů, číslo pojistky protistrany, popis situace a nákres. Formulář má obě strany - vyplňuje se společně, ne každý zvlášť doma.'),
      h('5. Zavolejte asistenci'),
      p('Odtah, náhradní vůz, ubytování, návrat domů. Asistenci má v základu i povinné ručení a v našich balíčcích je nad jeho rámec ještě rozšířená - zdarma. Volejte ji na místě, ne až druhý den, kdy si vůz odtáhnete na vlastní náklady.'),
      h('6. Nahlaste škodu'),
      p('U nás vyřizuje škodu vlastní oddělení likvidace, ne pojišťovna. Jeden kontakt, jeden člověk, který vás celým případem provede - včetně komunikace s pojišťovnou protistrany.'),
      ul(
        'Nahlaste do několika dnů, ne až po opravě.',
        'Do opravy nezasahujte, dokud škodu neprohlédne technik.',
        'Schovejte si všechny účtenky - odtah, úschovné, náhradní dopravu.',
      ),
    ],
  },
  {
    slug: 'nahradni-vuz-zdarma',
    rubric: 'pojisteni',
    product: 'vozidla',
    sub: 'Asistenční služby',
    title: 'Náhradní vůz až na 20 dní zdarma: kdy na něj skutečně máte nárok',
    perex: 'Nejčastěji využívaná služba z balíčku a zároveň ta, u které je nejvíc nedorozumění. Shrnujeme, co platí.',
    img: photo('1560518883-ce09059eeffa'),
    author: 'radek-vesely',
    date: '2026-06-12',
    read: 3,
    body: [
      p('Auto v servisu neznamená jen opravu. Znamená taky, že se někdo nedostane do práce a někdo jiný do školy. Náhradní vůz je proto v našich balíčcích v základu, ne za příplatek.'),
      h('Na co se vztahuje'),
      ul(
        'Nehoda - zaviněná i nezaviněná.',
        'Odcizení vozidla po celou dobu šetření.',
        'Živelní škoda a vandalismus.',
        'Porucha, která znehybní vůz na cestě.',
      ),
      h('Jak dlouho'),
      p('Až 20 dní, což pokryje i opravy s čekáním na díly. Rozhoduje reálná doba opravy podle servisu, ne paušál.'),
      note('Na co si dát pozor', 'Vůz si vyzvedněte přes asistenční linku, ne vlastní domluvou s půjčovnou. Zpětné proplacení účtenky z půjčovny bývá to, co likvidaci nejvíc komplikuje.'),
      h('Vlastní autopůjčovna'),
      p('Provozujeme vlastní půjčovnu, takže na náhradní vůz nečekáte na dostupnost partnera. Ve větších městech ho přistavíme až k servisu.'),
    ],
  },
  {
    slug: 'podpojisteni-nemovitosti',
    rubric: 'pojisteni',
    product: 'nemovitost',
    sub: 'Pojištění stavby',
    title: 'Podpojištění nemovitosti: dům z roku 2015 dnes nepostavíte za tehdejší cenu',
    perex: 'Ceny stavebních prací a materiálu se za deset let zásadně změnily. Pojistné částky ve smlouvách většinou ne.',
    img: photo('1568605114967-8130f3a36994'),
    author: 'simona-kucerova',
    date: '2026-05-26',
    read: 5,
    body: [
      p('U nemovitosti platí stejný mechanismus jako u aut, jen v jiném řádu. Pojistná částka má odpovídat nákladům na znovupostavení domu - ne tomu, za kolik jste ho koupili, a ani tomu, za kolik byste ho dnes prodali.'),
      h('Tři různá čísla, která si lidé pletou'),
      ul(
        'Kupní cena - co jste zaplatili, včetně pozemku a lokality.',
        'Tržní cena - za kolik byste dnes prodali.',
        'Nová cena - kolik stojí postavit stejný dům znovu. Jen tohle číslo patří do smlouvy.',
      ),
      h('Proč rozdíl roste sám od sebe'),
      p('Rekonstrukce, přístavba, zateplení, nová střecha nebo fotovoltaika hodnotu stavby zvednou. Do smlouvy se ale nedostanou, dokud je tam někdo nenapíše.'),
      note('Indexace není samozřejmost', 'Část smluv má automatickou indexaci pojistné částky podle stavebních indexů, část ne. Zjistit, do které skupiny patří ta vaše, trvá jeden telefonát - a je to nejlevnější kontrola, jakou můžete udělat.'),
      h('Co s tím'),
      p('Revize jednou za dva až tři roky, a vždy po větší investici do domu. Navýšení pojistné částky bývá otázkou stovek korun ročně; krácení plnění o 30 % je otázkou statisíců.'),
    ],
  },
  {
    slug: 'hypoteka-2026-sazby',
    rubric: 'finance',
    product: 'hypoteka',
    sub: 'Úvěry na bydlení',
    title: 'Hypotéka v roce 2026: co čekat od sazeb a kdy má smysl refixovat',
    perex: 'Jak číst nabídku banky, co dnes rozhoduje o sazbě víc než výše úvěru a proč se refix začíná řešit půl roku předem.',
    img: photo('1554224155-6726b3ff858f'),
    author: 'lucie-novakova',
    date: '2026-05-05',
    read: 7,
    body: [
      p('Sazba na letáku a sazba, kterou nakonec dostanete, jsou dvě různá čísla. Rozdíl mezi nimi tvoří parametry, které se dají ovlivnit - a je jich víc, než se čeká.'),
      h('Co dnes rozhoduje o sazbě'),
      ul(
        'LTV, tedy poměr úvěru k hodnotě nemovitosti. Hranice 80 % je nejtvrdší zlom.',
        'Délka fixace - nejdelší není automaticky nejdražší.',
        'Doložení příjmu a jeho typ, u OSVČ způsob výpočtu.',
        'Aktivní účet, pojištění a další produkty banky.',
      ),
      h('Refix se řeší dřív, než přijde dopis'),
      p('Nabídku na refixaci posílá banka obvykle pár týdnů před koncem fixace. To je pozdě na to, aby šlo srovnat trh a případně přejít jinam - refinancování má vlastní lhůty a odhad nemovitosti trvá. Ideální je otevřít to šest měsíců předem.'),
      note('Počítejte celkovou cenu, ne měsíční splátku', 'Nižší splátka bývá výsledkem delší splatnosti, ne lepší sazby. Srovnávejte, kolik zaplatíte za celou dobu fixace včetně poplatků za odhad, čerpání a vedení.'),
      h('Kde bývá největší rezerva'),
      p('U klientů, kteří mají hypotéku déle než pět let a od té doby nesrovnávali. Nemovitost mezitím zdražila, LTV kleslo - a s ním by měla klesnout i sazba. Sama od sebe se ale nezmění.'),
    ],
  },
  {
    slug: 'investice-do-realit',
    rubric: 'reality',
    product: 'investice',
    sub: 'Investice',
    title: 'Investice do realit: kdy dávají smysl a kdy je lepší zůstat u fondu',
    perex: 'Byt na pronájem není pasivní příjem. Je to podnikání s vlastní administrativou, riziky a náklady, které se do výnosu často nepočítají.',
    img: photo('1570129477492-45c003edd2be'),
    author: 'katerina-horakova',
    date: '2026-04-16',
    read: 6,
    body: [
      p('Na papíře to vypadá jednoduše: koupím byt, pronajmu ho, nájem platí splátku. V realitě se do výnosu musí započítat věci, které se v tabulce často ztratí.'),
      h('Co do výnosu patří, i když se na to zapomíná'),
      ul(
        'Neobsazenost - i jeden prázdný měsíc ročně je 8 % z ročního nájmu.',
        'Fond oprav, daně a pojištění.',
        'Údržba a obměna vybavení mezi nájemníky.',
        'Váš čas - hledání nájemníka, prohlídky, reklamace.',
      ),
      h('Kdy dává byt smysl'),
      p('Když máte vlastní zdroje aspoň na čtvrtinu ceny, počítáte v horizontu deseti let a lokalitu opravdu znáte. Reality odměňují dlouhou držbu a lokální znalost, ne rychlý obrat.'),
      h('Kdy je lepší fond'),
      p('Když chcete vstoupit menší částkou, potřebujete likviditu nebo nechcete řešit nájemníky. Realitní fond dá expozici do stejné třídy aktiv bez provozu.'),
      note('Třetí cesta', 'Nájem bez rizika - nemovitost pronajímáme za vás, garantujeme platbu i stav bytu a přebíráme celou administrativu. Výnos je nižší než u přímého pronájmu, práce s ním nulová.'),
    ],
  },
  {
    slug: 'rozhovor-rodinne-podnikani',
    rubric: 'firma',
    product: null,
    title: 'Rozhovor: jak se z rodinné firmy stane síť poboček po celé republice',
    perex: 'O začátcích v jedné kanceláři v Brně, o tom, proč jsme si postavili vlastní likvidaci škod, a co znamená růst, když si chcete udržet jméno.',
    img: photo('1552664730-d307ca884978'),
    author: 'tomas-marek',
    date: '2026-03-24',
    read: 9,
    body: [
      p('Allrisk vznikl jako rodinná firma a rodinnou firmou zůstal i s několika sty lidmi a pobočkami od Chebu po Ostravu. Povídali jsme si o tom, jak se to dá udržet.'),
      h('Začátky'),
      p('První kancelář byla v Brně a první produkt byl inkasní systém, který v roce 2005 na českém trhu nikdo jiný neměl. Nešlo o to prodat víc smluv, ale poskládat z produktů více pojišťoven balíček, který dává smysl jako celek.'),
      quote('Nechtěli jsme být další zprostředkovatel. Chtěli jsme, aby klient měl jedno místo, kde se o něj někdo postará - i když se něco stane.', 'tomas-marek'),
      h('Proč vlastní likvidace'),
      p('Protože právě ve chvíli škody se ukáže, jestli je pojištění služba, nebo jen papír. Přehazování klienta mezi pojišťovnami byl důvod, proč jsme si postavili vlastní oddělení likvidace - dnes je to nejsilnější věc, kterou máme.'),
      h('Růst bez ztráty jména'),
      p('Pobočka není franšíza. Každá má vedoucího, který je za ni odpovědný, a stejné standardy jako centrála. Když se něco pokazí, řeší se to jménem, ne procesem.'),
    ],
  },
  {
    slug: 'allrisk-meridiem',
    rubric: 'reality',
    product: null,
    title: 'Allrisk MERIDIEM: co vzniká na místě, kde Brno končilo',
    perex: 'Projekt, který propojuje kanceláře, obchod i služby pod jednou střechou. Reportáž ze stavby a čísla, která za ním stojí.',
    img: photo('1580587771525-78b9dba3b914'),
    author: 'michal-prochazka',
    date: '2026-03-02',
    read: 5,
    body: [
      p('MERIDIEM není jen budova pro nás. Je to test toho, jestli má smysl stavět místo, kde se pracuje, nakupuje i bydlí, aniž by se muselo přejíždět.'),
      h('Co v něm bude'),
      ul(
        'Kanceláře pro centrálu i nájemce.',
        'Obchodní parter s kavárnou a službami.',
        'Parkování a nabíjecí infrastruktura.',
      ),
      h('Harmonogram'),
      p('Hrubá stavba je hotová, dokončovací práce běží. První nájemci se stěhují v průběhu příštího roku.'),
      note('Zajímá vás pronájem?', 'Volné plochy i podmínky vám ukáže realitní tým na pobočce Brno.'),
    ],
  },
  {
    slug: 'elektronicke-podpisy-ve-financich',
    rubric: 'finance',
    product: null,
    title: 'Elektronická budoucnost ve financích: co už dnes podepíšete z gauče',
    perex: 'Smlouvy, změny, hlášení škody i identifikace klienta. Přehled toho, co jde online, a toho, kde má papír pořád navrch.',
    img: photo('1498050108023-c5249f4df085'),
    author: 'filip-benes',
    date: '2026-02-11',
    read: 4,
    body: [
      p('Za poslední tři roky se přesunula online většina úkonů, kvůli kterým se dřív jezdilo na pobočku. Ne všechny - a je dobré vědět, které.'),
      h('Co zvládnete z domova'),
      ul(
        'Sjednání i změnu pojistné smlouvy s podpisem přes SMS kód.',
        'Hlášení škody včetně fotodokumentace.',
        'Přehled smluv a plateb v klientském portálu mujallrisk.cz.',
      ),
      h('Kde pořád pomůže osobní schůzka'),
      p('U hypotéky, u složitějších firemních rizik a všude tam, kde se rozhoduje o velkých částkách. Ne kvůli papíru, ale kvůli tomu, že se dá zeptat.'),
      note('Bezpečnost', 'Přihlášení do portálu i každá změna běží přes SMS heslo vázané na registrované telefonní číslo. Bez přístupu k telefonu se do smluv nedostane nikdo.'),
    ],
  },
]

// ---- Allrisk Magazín (tištěné vydání) ----
// Dnešný allrisk.cz/magazin je ročenka v PDF - tú neruším. Na /blog stojí hneď
// hore ako vlastný pás: je to jedna vec do roka, nie ďalší článok, a odkazy na
// ňu musia mať kam viesť.
export const PRINT = {
  title: 'Allrisk Magazín 2026',
  lead: 'Jednou ročně shrneme to podstatné do tištěného vydání - rozhovory s klienty, čísla za rokem a projekty, které stavíme. Vyjde v tištěné podobě na pobočkách a celé si ho tady můžete stáhnout v PDF.',
  pdf: '/blog/allrisk-magazin-2026.pdf',
  year: '2026',
  // ročníky pre budúcu stránku archívu; pás na /blog na ňu odkazuje tlačidlom
  archive: ['2025', '2024', '2023'],
}

// ---- odvodené zoznamy ----
export const articleBySlug = (slug) => ARTICLES.find((a) => a.slug === slug)
export const articlesInRubric = (key) => ARTICLES.filter((a) => a.rubric === key)
// Články k produktu - vstup je kľúč z PRODUCTS_META, rovnako ako pri situáciách.
export const articlesFor = (productKey) => ARTICLES.filter((a) => a.product === productKey)

// Súvisiace články: najprv ten istý produkt, potom tá istá rubrika, nakoniec zvyšok -
// aby sa pod článkom o autopojištění neobjavil rozhovor o realitách skôr než druhý
// článok o autě.
export const relatedArticles = (a, n = 3) => {
  const rank = (x) => (x.product && x.product === a.product ? 0 : x.rubric === a.rubric ? 1 : 2)
  return ARTICLES.filter((x) => x.slug !== a.slug)
    .sort((x, y) => rank(x) - rank(y))
    .slice(0, n)
}

// ---- formátovanie ----
const MONTHS = ['ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince']

// „28. července 2026" - dlhý tvar do detailu článku
export const formatDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d}. ${MONTHS[m - 1]} ${y}`
}
// „28. 7. 2026" - krátky tvar do karty, kde súperí o miesto s dobou čítania
export const formatDateShort = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d}. ${m}. ${y}`
}
export const readLabel = (n) => `${n} min čtení`

// Kotva nadpisu v obsahu článku. Zámerne z poradia, nie z textu: české nadpisy
// s diakritikou a interpunkciou by dali škaredé a nestabilné id.
export const headingId = (i) => `cast-${i + 1}`
