// Klientské profily (archetypy) - JEDEN zdroj pravdy pre tri kontexty:
//   1. landing (/)            - dlaždica profilu + preklik na detail
//   2. /profil/:slug          - archetyp, „Co je dobré mít vyřešeno", situácie ako taby
//   3. produktová stránka     - tá istá situácia, len vstup je produkt a taby sú profily
//
// Kľúčová myšlienka: SITUÁCIA je zdieľaná entita s väzbou (profil × produkt).
// Z profilu ju čítaš cez `p.situations`, z produktu cez `situationsFor(productKey)`.
// `product` je stránka, na ktorú situácia vedie; `sub` je konkrétne krytie, ktoré tú
// škodu reálne zaplatilo („Havarijní pojištění“ na stránke „Pojištění vozidel“) - to je
// to, čo karta v profile ukazuje ako názov. U vozidiel `sub` doslova kopíruje label
// záložky z vehicles.js PRODUCTS, nech obe stránky hovoria to isté; ostatné produkty
// vlastný katalóg podproduktov zatiaľ nemajú, takže je to voľný text.
// Ikony sú KĽÚČE (rovnako ako v menu.js), komponenty k nim mapuje ProfileParts.jsx.
//
// Rovnakú väzbu (profil × produkt) má aj MODEL - konkrétne zadanie, na ktorom produktová
// stránka ukazuje odporúčané krytie a cenu. Preto žije v `p.models[productKey]`, nie
// natvrdo ako „vehicle". Kontrakt modelu:
//   povinné pre každý produkt: img, tagIcon, usage, why, perks[], base, preset[]
//   zvyšok je špecifický pre daný produkt (u vozidiel car/year/engine/mileage/deductible)
// Profil sa na produktovej stránke objaví len vtedy, keď má K TOMU PRODUKTU aj situáciu
// aj model - `modelsFor(productKey)` vracia presne tie dvojice.

import { routeFor, hasRoute } from '../productRoutes.js'

// ---- katalóg produktov, na ktoré sa situácie a „co mít vyřešeno" odkazujú ----
// `label` je zároveň téma pre /kontakt, ak produkt ešte nemá vlastnú stránku.
export const PRODUCTS_META = {
  vozidla: { label: 'Pojištění vozidel', short: 'Vozidla', icon: 'car' },
  nemovitost: { label: 'Pojištění nemovitosti', short: 'Nemovitost', icon: 'home' },
  domacnost: { label: 'Pojištění domácnosti', short: 'Domácnost', icon: 'sofa' },
  odpovednost: { label: 'Pojištění odpovědnosti', short: 'Odpovědnost', icon: 'umbrella' },
  zivot: { label: 'Životní pojištění', short: 'Život', icon: 'heart' },
  prijem: { label: 'Zabezpečení příjmu', short: 'Příjem', icon: 'stethoscope' },
  hypoteka: { label: 'Hypotéka', short: 'Hypotéka', icon: 'key' },
  cesty: { label: 'Cestovní pojištění', short: 'Cesty', icon: 'plane' },
  investice: { label: 'Investice a spoření', short: 'Investice', icon: 'chart' },
  penze: { label: 'Penze a renta', short: 'Penze', icon: 'coin' },
  firma: { label: 'Pojištění majetku firmy', short: 'Majetek firmy', icon: 'warehouse' },
  flotila: { label: 'Flotila vozidel', short: 'Flotila', icon: 'truck' },
  odpovednostFirmy: { label: 'Odpovědnost za škodu firmy', short: 'Odpovědnost firmy', icon: 'license' },
  pravni: { label: 'Právní ochrana', short: 'Právní ochrana', icon: 'scale' },
}

// Kde má produkt reálnu stránku; zvyšok vedie na kontakt s predvyplnenou témou.
export const productHref = (key) => routeFor(PRODUCTS_META[key]?.label || key)
export const productLabel = (key) => PRODUCTS_META[key]?.label || key
// true = produkt má vlastnú stránku (dnes vozidlá a flotily), takže CTA môže sľúbiť produkt
export const productHasPage = (key) => hasRoute(PRODUCTS_META[key]?.label || key)

// ---- archetypy ----
// need: 'nutnost' = bez toho to nedáva zmysel, 'doporuceno' = silne odporúčame, 'zvazit' = podľa situácie
//
// `seg` je publikum (src/segment.js). Od 2026-08-11 mení prepnutie záložky
// v hlavičke celý web, takže sekcia profilov na úvode ukazuje len archetypy
// zvoleného publika - Martin uprostred rodín bol dovtedy jediné miesto, kde
// úvod pre domácnosti hovoril o firme.
//
// Města a obce profily od 2026-08-12 MAJÚ (user). Dovtedy tu stálo, že ich
// nedostanú, lebo obec nie je archetyp človeka - platí to naďalej, a preto sú
// obecné dlaždice bez prekliku a bez situácií: nesú veľkosť a starosti obce,
// nie príbeh jedného človeka. Klikateľné sú len profily jednotlivcov a rodín.
//
// ILUSTRÁCIE: každý profil ju od 2026-08-15 má, ale niektoré sú PREVZATÉ.
// Bezplatná vrstva Tabler.io dáva dokopy desať rôznych kresieb (sedem SVG
// z galérie + tri PNG) a profilov je deväť, k tomu štyri dlaždice v BizCare
// a tri v „Proč Allrisk" - na vlastnú kresbu pre každé miesto to nestačí.
// Pravidlo, ktoré to drží: tá istá kresba smie stáť na dvoch miestach LEN
// vtedy, keď sa nedajú vidieť naraz. Publikum je stav celého webu, takže
// stránka pre rodiny, pre podnikateľov a pre obce sú tri rôzne obrazovky.
// Rozdelenie po obrazovkách (overené proti WHY v home.js a BizCare.jsx):
//   rodiny      singl=kocúr, rodina=nákup, samoživiteľka=fajka, penzia=dvojica
//   podnikatelé podnikatel=žonglér, živnostník=monitor, výroba=žeriav
//               + BizCare: fajka, dvojica, monitor-oprava, kľúč
//   města       malá obec=kocúr, město=žonglér, svazek=nákup
//               + WHY: žeriav, monitor, štít  + BizCare ako vyššie
// Pri pridávaní profilu preto NAJPRV skontroluj, čo už na jeho obrazovke je.
export const PROFILES = [
  {
    key: 'singl', seg: 'rodiny',
    slug: 'sam-za-sebe',
    // foto pod hero (klient doplní do public/profily/); kým chýba, presvitá značkový gradient
    photo: '/profily/sam-za-sebe.jpg',
    ic: 'user',
    // tabler „boy-and-cat" - chlap s mačkou, teda človek, čo bydlí sám
    img: '/illus/tabler/stories/sam-za-sebe.svg',
    ey: 'Sám za sebe',
    t: 'Lukáš, 28 let',
    p: 'Nájem, auto a první vlastní peníze.',
    lead: 'Žádná hypotéka ani rodina, ale taky žádná záchranná síť. Když vypadne jeho příjem, nemá ho kdo nahradit.',
    pts: [
      'Povinné ručení a havarijní pojištění na auto',
      'Zajištění příjmu, když nemá kdo zaskočit',
      'Odpovědnost za škodu v běžném životě',
    ],
    // ---- krátky popis osoby do hera detailnej stránky (/profil/:slug) ----
    intro: 'Bydlí v nájmu, jezdí ojetým autem a poprvé v životě mu na konci měsíce něco zbyde. Nemá co ztratit na majetku - zato všechno stojí na jednom příjmu, který nikdo nenahradí.',
    // ---- „Co je dobré mít vyřešeno" ----
    solved: [
      { product: 'vozidla', need: 'nutnost', note: 'Povinné ručení je ze zákona, zbytek podle stáří vozu. U ojetiny často stačí asistence a skla místo drahé havarijky.' },
      { product: 'odpovednost', need: 'nutnost', note: 'Škoda, kterou způsobíte někomu jinému v běžném životě. Nejlevnější pojistka na trhu a nejčastěji zachrání majlant.' },
      { product: 'prijem', need: 'doporuceno', note: 'Denní dávka při pracovní neschopnosti. Když bydlíte sám, nájem běží dál i tři měsíce na neschopence.' },
      { product: 'domacnost', need: 'doporuceno', note: 'Vaše věci v pronajatém bytě - notebook, kolo, elektronika. Majitelova pojistka kryje jen jeho zdi, ne váš majetek.' },
      { product: 'cesty', need: 'doporuceno', note: 'Léčebné výlohy a zavazadla. Celoroční varianta pokryje i víkendový výjezd, na který se sjednávat nechce.' },
      { product: 'investice', need: 'zvazit', note: 'Pravidelné investování už od pár stovek měsíčně. Nejlevnější složené úročení je to, které začne nejdřív.' },
    ],
    situations: [
      {
        key: 'singl-nehoda', ic: 'crash',
        product: 'vozidla', sub: 'Havarijní pojištění',
        tab: 'Stala se nehoda',
        title: 'Na parkovišti u práce mu někdo urazil zrcátko a ujel',
        story: 'Škoda 14 000 Kč, viník nezjištěn, kamery na parkovišti nic nezachytily. Lukáš má auto z druhé ruky a na opravu z vlastní kapsy nemá.',
        fix: [
          'Havarijní připojištění krylo i škodu od neznámého viníka - povinné ručení tohle nikdy nekryje.',
          'Škodu jsme nahlásili za něj, likvidaci vede přímo oddělení Allrisk.',
          'Opravu odsouhlasil online, do servisu jel jednou a bez zálohy.',
        ],
        outcome: 'Lukáš doplatil spoluúčast 5 000 Kč místo celých 14 000 Kč a auto měl zpátky za čtyři dny.',
      },
      {
        key: 'singl-skoda', ic: 'claim',
        product: 'odpovednost', sub: 'Odpovědnost za škodu v běžném životě',
        tab: 'Způsobil škodu',
        title: 'Při stěhování upustil kamarádovi televizi',
        story: 'Nová 65" OLED za 38 000 Kč, rozbitá při nesení do výtahu. Kamarád nic nechtěl, ale Lukášovi to nedalo - a byla to skoro celá jeho rezerva.',
        fix: [
          'Pojištění odpovědnosti krylo škodu na cizí věci, kterou způsobil neúmyslně.',
          'Stačilo doložit účtenku a fotky, žádný znalecký posudek.',
          'Roční pojistné je nižší, než co by ho stála jedna taková škoda.',
        ],
        outcome: 'Pojišťovna vyplatila 37 000 Kč. Lukáš zaplatil spoluúčast 1 000 Kč a rezervu si nechal.',
      },
      {
        key: 'singl-vypadek', ic: 'injury',
        product: 'prijem', sub: 'Denní dávka při pracovní neschopnosti',
        tab: 'Vypadl příjem',
        title: 'Natržené vazy v koleni po pádu na kole a deset týdnů doma',
        story: 'Nemocenská mu pokryla necelou polovinu čisté mzdy. Nájem 15 500 Kč, splátka auta a energie ale běžely dál a rodiče vypomáhat nemohli.',
        fix: [
          'Denní dávka při pracovní neschopnosti dorovnala rozdíl mezi nemocenskou a jeho běžným příjmem.',
          'Plnění za úraz přišlo jednorázově hned po ukončení léčby.',
          'Nemusel sáhnout na rezervu ani odkládat splátky, takže mu nic nezhoršilo úvěrový registr.',
        ],
        outcome: 'Plnění celkem 68 000 Kč. Deset týdnů bez práce ho nestálo ani korunu z úspor.',
      },
      {
        key: 'singl-cesty', ic: 'firstaid',
        product: 'cesty', sub: 'Připojištění zimních sportů',
        tab: 'Úraz v zahraničí',
        title: 'Zlomený kotník na sjezdovce v Rakousku',
        story: 'Svoz z kopce, rentgen, operace a převoz domů sanitkou. Rakouská klinika vyčíslila péči na 4 200 eur a chtěla zálohu kartou na místě.',
        fix: [
          'Asistenční služba domluvila přímou úhradu s klinikou, Lukáš neplatil nic ze svého.',
          'Připojištění zimních sportů pokrylo i svoz z kopce, který běžné cestovko běžně vylučuje.',
          'Převoz domů zajistila pojišťovna, nemusel řešit dopravu se sádrou přes půl Evropy.',
        ],
        outcome: 'Uhrazeno 4 200 eur (cca 105 000 Kč) za pojistné 890 Kč na celý rok.',
      },
      {
        key: 'singl-vykradeni', ic: 'theft',
        product: 'domacnost', sub: 'Krádež vloupáním',
        tab: 'Vykradli mu byt',
        title: 'Vypáčené dveře v pronajatém bytě, když byl týden na horách',
        story: 'Zmizel notebook, fotoaparát a kolo ze sklepa - dohromady za 74 000 Kč. Majitel bytu má pojištěné zdi, na Lukášovy věci se jeho smlouva nevztahuje.',
        fix: [
          'Pojištění domácnosti krylo vybavení bytu i věci ve sklepě, který k bytu patří.',
          'Elektronika byla pojištěná na novou cenu, ne na tu odepsanou po třech letech používání.',
          'Výměnu zámku a provizorní zabezpečení dveří zaplatila asistenční služba ještě týž den.',
        ],
        outcome: 'Plnění 71 000 Kč. Lukáš doplatil spoluúčast 3 000 Kč a techniku měl zpátky do týdne.',
      },
      {
        key: 'singl-rezerva', ic: 'growth',
        product: 'investice', sub: 'Pravidelné investování',
        tab: 'Začal odkládat',
        title: 'Poprvé mu na konci měsíce zbývalo a nevěděl, kam s tím',
        story: 'Zbývalo kolem 4 000 Kč měsíčně, které se rok a půl vršily na běžném účtu. Nastřádalo se 70 000 Kč, ze kterých inflace tiše ukrajovala.',
        fix: [
          'Tři platy jsme nechali stranou na spořicím účtu - rezerva má být po ruce, ne ve fondech.',
          'Zbytek jde pravidelnou měsíční platbou do dynamického portfolia, horizont je přes dvacet let.',
          'Platba odchází den po výplatě, takže se z rozpočtu neztratí a Lukáš na ni nemusí myslet.',
        ],
        outcome: 'Rezerva 60 000 Kč po ruce a 3 000 Kč měsíčně, které pracují. U složeného úročení je nejdražší chyba začít o pět let později.',
      },
    ],
    // ---- modely pre produktové stránky (kľúč = produkt) ----
    models: {
    vozidla: {
      img: '/cars/trip.svg',
      tagIcon: 'user',
      driver: 'Řidič 28 let · krátká praxe',
      car: 'Ford Focus', year: '2016', engine: '1.5 TDCi · 88 kW',
      mileage: '18 000 km / rok', deductible: '5 000 Kč',
      usage: 'Denně do práce, o víkendu na hory nebo za kamarády. Ojetina, kterou si platí sám a která musí hlavně jezdit.',
      base: 420, preset: ['havarie', 'skla', 'asistence'],
      why: 'Mladý řidič bez dlouhé bezeškodní historie platí za povinné ručení víc. Havarijka u vozu téhle hodnoty ještě dává smysl, náhradní vůz zatím ne.',
      perks: [
        'Krytí i škody od neznámého viníka na parkovišti',
        'Skla jsou u dálničních kilometrů nejčastější škoda vůbec',
        'Asistence 24/7 u auta, které už má nějaké to najeto',
      ],
    },
    },
  },

  {
    key: 'rodina', seg: 'rodiny',
    slug: 'rodina',
    // foto pár ~38 s dvomi školákmi - presne tento zlúčený archetyp
    // (súbor sa volá po pôvodnom profile „rodina v nejlepších letech", obsah sedí)
    photo: '/profily/rodina-v-nejlepsich-letech.jpg',
    ic: 'heart',
    // tabler „shopping" - pár s nákupným vozíkom
    img: '/illus/tabler/stories/rodina.svg',
    ey: 'Rodina',
    t: 'Jana a Tomáš, 38 let',
    p: 'Hypotéka, dvě děti a všechno najednou.',
    lead: 'Byt na hypotéku, dvě děti a jedno auto na všechno. Nejvíc majetku i nejvíc závazků za celý život - a rozpočet, který stojí na dvou příjmech.',
    pts: [
      'Životní pojištění navázané na splátku hypotéky',
      'Pojištění nemovitosti, domácnosti i odpovědnosti',
      'Investice na studium dětí a vlastní rezervu',
    ],
    // ---- krátky popis osoby do hera detailnej stránky (/profil/:slug) ----
    intro: 'Splácejí hypotéku, vozí dvě děti na kroužky a byt mají čerstvě po rekonstrukci. Je to období, kdy mají nejvyšší příjem a největší majetek - a zároveň nejvíc toho, co se může pokazit.',
    // ---- „Co je dobré mít vyřešeno" ----
    solved: [
      { product: 'zivot', need: 'nutnost', note: 'Výplata sjednané částky při úrazu, vážné nemoci nebo úmrtí. Pojistnou částku navážeme na zůstatek hypotéky.' },
      { product: 'hypoteka', need: 'nutnost', note: 'Sazba a podmínky napříč trhem, ne jen u vlastní banky. Refinancování řešíme včas před koncem fixace, ne až když přijde nabídka na prodloužení.' },
      { product: 'nemovitost', need: 'nutnost', note: 'Stavba bytu či domu proti požáru, vodě a živlu - včetně sklepa a garáže. Po rekonstrukci částku přepíšeme na novou cenu.' },
      { product: 'domacnost', need: 'nutnost', note: 'Vybavení, elektronika a osobní věci uvnitř. Kryje i krádež, vytopení a poškozené spotřebiče.' },
      { product: 'vozidla', need: 'nutnost', note: 'Povinné ručení i havarijní pojištění. Všechna auta v rodině na jednom vyúčtování, bonus lze mezi nimi převádět.' },
      { product: 'odpovednost', need: 'doporuceno', note: 'Škoda, kterou způsobíte někomu jinému v běžném životě - vytopený soused i rozbitá věc v cizím bytě.' },
      { product: 'investice', need: 'doporuceno', note: 'Investice a spoření s odlišnou strategií podle horizontu - peníze na školu dětí zvlášť od vlastní rezervy.' },
    ],
    // ---- situácie („Proč je dobré mít toto pojištění") ----
    situations: [
      {
        key: 'rodina-nehoda', ic: 'crash',
        product: 'vozidla', sub: 'Technické asistence',
        tab: 'Stala se nehoda',
        title: 'Na kruhovém objezdu do nich zezadu naboural dodávkař',
        story: 'Jana vezla malou z kontroly. Škoda na zadní části vozu 78 000 Kč, auto nepojízdné, viník uznal zavinění na místě. Rodina má jedno auto a Tomáš jím jezdí do práce 40 km denně.',
        fix: [
          'Škodu jsme nahlásili za ně - likvidaci vede přímo oddělení Allrisk, ne cizí pojišťovna.',
          'Náhradní vůz přistavený do druhého dne, Tomáš nevynechal jedinou směnu.',
          'Vymáhání po viníkově pojišťovně jsme převzali my, Jana neřešila ani jeden telefonát.',
        ],
        outcome: 'Rodina doplatila 0 Kč. Auto se vrátilo ze servisu za 3 týdny, celou dobu jezdili náhradním.',
      },
      {
        key: 'rodina-vytopeni', ic: 'water',
        product: 'domacnost', sub: 'Škoda vodou z vodovodního zařízení',
        tab: 'Vytopili sousedy',
        title: 'Praskla přívodní hadička u pračky, když nikdo nebyl doma',
        story: 'Voda tekla šest hodin. Zničená plovoucí podlaha v novém bytě a promáčený strop u sousedů pod nimi, kteří měli rok starou rekonstrukci koupelny.',
        fix: [
          'Pojištění domácnosti pokrylo podlahu, nábytek a vysoušení jejich bytu.',
          'Pojištění odpovědnosti zaplatilo škodu sousedům - 112 000 Kč, kterou by jinak platili ze svého.',
          'Vysoušeče a firmu na sanaci zařídila asistenční služba, ne oni.',
        ],
        outcome: 'Z celkové škody 190 000 Kč zaplatila rodina spoluúčast 1 000 Kč. Se sousedy zůstali zadobře.',
      },
      {
        key: 'rodina-vypadek', ic: 'injury',
        product: 'zivot', sub: 'Trvalé následky úrazu',
        tab: 'Vypadl příjem',
        title: 'Tomáš si při pádu ze žebříku zlomil nohu na třech místech',
        story: 'Pět měsíců na neschopence. Nemocenská pokryla necelou polovinu jeho čisté mzdy, splátka hypotéky 21 400 Kč přitom běžela dál a Jana pracuje na zkrácený úvazek.',
        fix: [
          'Denní dávka při pracovní neschopnosti dorovnala výpadek od 29. dne.',
          'Plnění za trvalé následky úrazu přišlo jednorázově po ustálení stavu.',
          'Splátky hypotéky ani jednou nevypadly - nemuseli sahat na rezervu ani žádat o odklad.',
        ],
        outcome: 'Za pět měsíců přišlo plnění 168 000 Kč. Rodina neřešila peníze, jen Tomášovu nohu.',
      },
      {
        key: 'rodina-hypoteka', ic: 'newhome',
        product: 'hypoteka', sub: 'Zprostředkování hypotéky',
        tab: 'Kupovali byt',
        title: 'První nabídka z banky nebyla ta, kterou nakonec podepsali',
        story: 'Vlastní banka jim schválila sazbu o 0,4 p. b. vyšší a odhad nemovitosti chtěla za 6 900 Kč. K tomu tlačila balíček pojištění, který se splátkou vůbec nesouvisel.',
        fix: [
          'Srovnali jsme nabídky napříč trhem a vyjednali podmínky u banky, kde nejsou klienty.',
          'Životní pojištění jsme napojili na skutečný zůstatek úvěru, ne na balíček od banky.',
          'Pojištění nemovitosti sjednali u nás - levněji a s vyšší pojistnou částkou než v bankovním balíčku.',
        ],
        outcome: 'Úspora 0,4 p. b. na sazbě znamená za dobu fixace zhruba 94 000 Kč, které zůstaly rodině.',
      },
      {
        key: 'rodina-vichrice', ic: 'storm',
        product: 'nemovitost', sub: 'Živelní pojištění stavby',
        tab: 'Přišla vichřice',
        title: 'Orkán vytrhl okna v posledním patře a voda zatekla až do bytu',
        story: 'Škoda 340 000 Kč na oknech, podlahách a rozvodech. Byt byl po rekonstrukci za 1,4 milionu, ale pojistka pořád běžela na částku z původní smlouvy - 2,6 milionu místo reálných 5 milionů.',
        fix: [
          'Pojistnou částku jsme aktualizovali při revizi devět měsíců před vichřicí - bez toho by pojišťovna plnila zhruba polovinu.',
          'Škodu likvidovalo oddělení Allrisk, zálohu na materiál měli na účtu do deseti dnů.',
          'Provizorní zabednění oken zajistila asistenční služba ještě týž večer.',
        ],
        outcome: 'Plnění v plné výši 335 000 Kč. Bez aktualizované částky by dostali zhruba o 160 000 Kč méně.',
      },
      {
        key: 'rodina-studium', ic: 'school',
        product: 'investice', sub: 'Pravidelné investování',
        tab: 'Děti půjdou na vysokou',
        title: 'Za osm let Praha, podnájem a pět let studia',
        story: 'Podnájem, jídlo a doprava dnes vycházejí na 14 000 Kč měsíčně. Za pět let studia je to zhruba 840 000 Kč na dítě - a doma jsou děti dvě, s odstupem tří let.',
        fix: [
          'Peníze na studium jsme oddělili od rodinné rezervy, aby se z nich neuždibovalo na běžné výdaje.',
          'Horizont je dost dlouhý na dynamické portfolio - ke konci ho postupně překlopíme do konzervativního.',
          'Nastavili jsme pravidelnou platbu, která se z rozpočtu neztratí, ale za osm let udělá rozdíl.',
        ],
        outcome: 'Při dnešní platbě 3 500 Kč měsíčně pokryjí studium obou dětí, aniž by sahali na hypotéku nebo rezervu.',
      },
      {
        key: 'rodina-odpovednost', ic: 'claim',
        product: 'odpovednost', sub: 'Odpovědnost členů domácnosti',
        tab: 'Dítě způsobilo škodu',
        title: 'Syn při fotbale na hřišti rozbil zaparkované auto souseda',
        story: 'Míč trefil čelní sklo a promáčkl bok vozu, oprava 46 000 Kč. Soused chtěl škodu uhradit do měsíce v hotovosti, jinak že to předá právníkovi.',
        fix: [
          'Pojištění odpovědnosti kryje i škody způsobené dětmi - ty za sebe právně neodpovídají, platí rodiče.',
          'Stačilo nahlásit škodu a doložit fotky, s pojišťovnou i se sousedem jednalo oddělení Allrisk.',
          'Rodinná varianta pokrývá oba rodiče, obě děti i psa na jedné smlouvě.',
        ],
        outcome: 'Pojišťovna vyplatila 45 000 Kč, rodina doplatila spoluúčast 1 000 Kč. Se sousedem se nesoudili.',
      },
    ],
    // ---- modely pre produktové stránky (kľúč = produkt) ----
    models: {
    vozidla: {
      // TODO(design): vlastná ilustrácia pre každý profil - zatiaľ 3 existujúce SVG na 4 profily.
      img: '/cars/driver.svg',
      tagIcon: 'users',
      driver: 'Řidiči 38 let · děti v autě',
      car: 'Škoda Fabia', year: '2018', engine: '1.0 TSI · 70 kW',
      mileage: '14 000 km / rok', deductible: '5 000 Kč',
      usage: 'Hlavní auto na všechno - do práce, s dětmi k lékaři a o víkendu za rodiči. Když stojí, stojí celá domácnost.',
      base: 480, preset: ['havarie', 'skla', 'asistence', 'nahradni'],
      why: 'Jediné auto v rodině musí být pojízdné. Havarijka na starší Fabii nestojí moc a náhradní vůz řeší to, co by rodinu položilo nejvíc.',
      perks: [
        'Náhradní vůz do druhého dne, když jde Fabia do servisu',
        'Nižší cena díky krátkému ročnímu nájezdu',
        'Asistence 24/7 i pro cesty s malým dítětem v autě',
      ],
    },
    },
  },

  {
    // Štvrtý archetyp domácností (user, 2026-08-12). Nie je to ďalšia veková
    // priehradka medzi 38 a 63 - tá by opakovala produktovú skladbu rodiny.
    // Samoživiteľka je jediný profil, kde JEDEN príjem drží celú domácnosť,
    // takže „zabezpečení příjmu" a životné poistenie tu nie sú odporúčanie,
    // ale prvá vec v poradí.
    key: 'samozivitelka', seg: 'rodiny',
    slug: 'samozivitelka',
    // foto pod hero (klient doplní do public/profily/); kým chýba, presvitá značkový gradient
    photo: '/profily/samozivitelka.jpg',
    ic: 'parent',
    // Ilustrácia je tá istá kresba, aká stojí na dlaždici „spolupráce" v BizCare
    // (dospelý s dieťaťom a fajkou). Bezplatná galéria Tabler.io je vyčerpaná -
    // overené znovu 2026-08-15, osem použiteľných kusov a všetky sú už v repe -
    // a dvakrát sa zobraziť nemôžu: BizCare beží len MIMO segmentu „rodiny",
    // samoživiteľka len v ňom. Keď sa kúpi platený balík, dostane vlastnú.
    img: '/illus/tabler/stories/samozivitelka.svg',
    ey: 'Samoživitelka',
    t: 'Klára, 35 let',
    p: 'Dvě děti a jeden příjem na všechno.',
    lead: 'Nájem, dvě děti a jedna výplata. Nemá druhý příjem, který by zaskočil, a rezerva vydrží dva měsíce - takže výpadek není nepohodlí, ale problém.',
    pts: [
      'Zabezpečení příjmu jako první, ne jako doplněk',
      'Životní pojištění nastavené kvůli dětem, ne kvůli úvěru',
      'Odpovědnost za škody, které způsobí děti',
    ],
    intro: 'Vychovává dvě děti sama, pracuje na plný úvazek a rozpočet má spočítaný do koruny. Nejde o to, kolik toho má - jde o to, že za ni nikdo nezaskočí. Když vypadne ona, vypadne celá domácnost.',
    solved: [
      { product: 'prijem', need: 'nutnost', note: 'Denní dávka a měsíční renta při pracovní neschopnosti. Nemocenská pokryje zhruba polovinu výplaty, nájem se ale nesnižuje.' },
      { product: 'zivot', need: 'nutnost', note: 'Pojistná částka nastavená podle toho, jak dlouho budou děti závislé na vašem příjmu, ne podle zůstatku úvěru.' },
      { product: 'domacnost', need: 'nutnost', note: 'Vybavení bytu, elektronika a věci dětí. Kryje i vytopení a krádež, na které z jedné výplaty rezerva není.' },
      { product: 'odpovednost', need: 'nutnost', note: 'Za škodu způsobenou dítětem odpovídá rodič. Rodinná varianta pokrývá vás i obě děti na jedné smlouvě.' },
      { product: 'vozidla', need: 'doporuceno', note: 'U staršího auta dává smysl spíš asistence a skla než drahá havarijka. Důležité je, aby auto nikdy nezůstalo stát.' },
      { product: 'investice', need: 'doporuceno', note: 'Nejdřív rezerva na tři měsíce nákladů, teprve pak dlouhodobé peníze. Malá pravidelná částka je lepší než čekání na lepší rok.' },
      { product: 'pravni', need: 'zvazit', note: 'Spory o výživné, s pronajímatelem nebo se zaměstnavatelem. Advokáta i soudní poplatek platí pojištění.' },
    ],
    situations: [
      {
        key: 'samozivitelka-nemoc', ic: 'illness',
        product: 'prijem', sub: 'Denní dávka při pracovní neschopnosti',
        tab: 'Nemohla pracovat',
        title: 'Zánět šlach na obou zápěstích ji vyřadil na čtyři měsíce',
        story: 'Pracuje u pokladny, bez rukou to nejde. Nemocenská jí vyšla na 17 200 Kč měsíčně proti čisté mzdě 31 000 Kč. Samotný nájem je 15 500 Kč a děti chodí na obědy a kroužky.',
        fix: [
          'Denní dávka dorovnala rozdíl od 15. dne neschopnosti, ne až od třicátého.',
          'Plnění chodilo měsíčně na účet, takže nájem ani obědy nikdy nevypadly.',
          'Nesahala na rezervu, kterou má odloženou na havárie v domácnosti.',
        ],
        outcome: 'Za čtyři měsíce přišlo plnění 55 000 Kč. Děti nepoznaly, že se něco dělo.',
      },
      {
        key: 'samozivitelka-vozidlo', ic: 'crash',
        product: 'vozidla', sub: 'Technické asistence',
        tab: 'Auto zůstalo stát',
        title: 'Ráno před školkou nenaskočilo a odtah byl 40 km daleko',
        story: 'Dvanáct let stará Fabia, kterou vozí děti do školy a jezdí na směny. Servis, který jí opravu udělá za rozumnou cenu, je v okresním městě - odtah tam by ji vyšel na 3 800 Kč.',
        fix: [
          'Asistence přijela do hodiny a vůz odtáhla do jejího servisu, ne do nejbližšího.',
          'Náhradní vůz na tři dny, takže nevynechala ani jednu směnu.',
          'Havarijku na dvanáct let staré auto jsme jí nesjednávali - u téhle ceny vozu se nevyplatí.',
        ],
        outcome: 'Zaplatila jen opravu. Odtah, náhradní vůz i dispečink stály 0 Kč.',
      },
      {
        key: 'samozivitelka-skoda', ic: 'claim',
        product: 'odpovednost', sub: 'Odpovědnost členů domácnosti',
        tab: 'Dítě způsobilo škodu',
        title: 'Dcera na koloběžce narazila do zaparkovaného auta',
        story: 'Promáčknuté dveře a škrábanec přes celý bok, oprava 38 000 Kč. Majitel chtěl škodu uhradit do konce měsíce - částku, kterou Klára nemá odloženou.',
        fix: [
          'Za škodu způsobenou dítětem odpovídá rodič, pojištění odpovědnosti ji kryje.',
          'Stačilo nahlásit škodu a doložit fotky, s majitelem i pojišťovnou jednalo oddělení Allrisk.',
          'Rodinná varianta kryje ji i obě děti, bez připojištění za každé zvlášť.',
        ],
        outcome: 'Pojišťovna vyplatila 37 000 Kč, Klára doplatila spoluúčast 1 000 Kč.',
      },
      {
        key: 'samozivitelka-vytopeni', ic: 'water',
        product: 'domacnost', sub: 'Škoda vodou z vodovodního zařízení',
        tab: 'Vytopili je shora',
        title: 'Soused nad nimi nechal téct vodu a promáčel dětský pokoj',
        story: 'Zničená podlaha, postel a psací stůl obou dětí. Byt má v nájmu, takže stavbu řeší majitel - vybavení uvnitř je ale její a nové postele stály 46 000 Kč.',
        fix: [
          'Pojištění domácnosti kryje vybavení i v nájemním bytě, nejen ve vlastním.',
          'Vysoušeče zajistila asistenční služba, nemusela shánět firmu sama.',
          'Nárok na sousedovu pojišťovnu jsme uplatnili my, ona neřešila ani jeden telefonát.',
        ],
        outcome: 'Plnění 44 000 Kč do tří týdnů. Děti spaly ve svém pokoji dřív, než skončily prázdniny.',
      },
      {
        key: 'samozivitelka-rezerva', ic: 'growth',
        product: 'investice', sub: 'Pravidelné investování',
        tab: 'Chtěla začít odkládat',
        title: 'Tisícovka měsíčně, o kterou se rozpočet nerozsype',
        story: 'Po nájmu, jídle a kroužcích jí zbývá kolem 2 500 Kč. Bála se, že investování znamená velké částky a dlouhé závazky, ze kterých se nedá vystoupit.',
        fix: [
          'Nejdřív rezerva na tři měsíce nákladů na spořicím účtu - ta musí být dřív než investice.',
          'Zbytek jde do pravidelné investice, kterou lze kdykoli snížit nebo pozastavit.',
          'Peníze dětí vedeme zvlášť od její vlastní rezervy, aby se z nich neuždibovalo.',
        ],
        outcome: 'Odkládá 1 000 Kč měsíčně a poprvé má rezervu, která pokryje celý nečekaný měsíc.',
      },
    ],
    models: {
    vozidla: {
      // TODO(design): vlastná ilustrácia pre každý profil - zatiaľ 3 existujúce SVG na 5 profilov.
      img: '/cars/bycar.svg',
      tagIcon: 'user',
      driver: 'Řidička 35 let · děti v autě',
      car: 'Škoda Fabia', year: '2012', engine: '1.2 HTP · 51 kW',
      mileage: '11 000 km / rok', deductible: '10 000 Kč',
      usage: 'Do školy, na směny a k babičce. Auto není luxus, je to jediný způsob, jak stihnout ráno školku i práci.',
      // Zámerne BEZ havarijky: u dvanásťročného vozu je jej cena neúmerná
      // hodnote auta a rozpočtu, ktorý má na sebe jeden príjem. Skladba je tým
      // najlacnejšia zo všetkých modelov na /vozidla - a to je tu tá informácia.
      base: 380, preset: ['asistence', 'skla', 'nahradni'],
      why: 'U dvanáct let starého vozu je havarijka dražší, než kolik by kdy vyplatila. Rozhoduje, aby auto nezůstalo stát - proto asistence a náhradní vůz.',
      perks: [
        'Odtah do vlastního servisu, ne jen do nejbližšího',
        'Náhradní vůz po dobu opravy, aby nevypadla směna',
        'Nízký nájezd drží cenu povinného ručení dole',
      ],
    },
    },
  },

  {
    key: 'podnikatel', seg: 'podnikatele',
    slug: 'podnikatel',
    // foto pod hero (klient doplní do public/profily/); kým chýba, presvitá značkový gradient
    photo: '/profily/podnikatel.jpg',
    ic: 'briefcase',
    img: '/illus/tabler/stories/podnikatel.svg',
    ey: 'Podnikatel',
    t: 'Martin, 41 let',
    p: 'Vlastní firma, pár zaměstnanců a sklad.',
    lead: 'Firma vyrostla z jednoho člověka na malý tým se skladem a auty. Potřeboval krýt rizika podnikání, ale neplatit za zbytečná připojištění.',
    pts: [
      'Pojištění majetku firmy a přerušení provozu',
      'Odpovědnost za škodu vůči klientům',
      'Flotila vozidel pod jednou smlouvou',
    ],
    intro: 'Firma vyrostla z jednoho člověka na tým se skladem, auty a šesti zaměstnanci. Má rizika velké firmy, ale nemá její rezervy - a celý provoz i rodina pořád visí na jednom člověku.',
    solved: [
      { product: 'odpovednostFirmy', need: 'nutnost', note: 'Škoda způsobená vaší činností klientovi nebo třetí straně. Kryje i následné škody, nejen tu přímou.' },
      { product: 'firma', need: 'nutnost', note: 'Budovy, zásoby a technika. Součástí je přerušení provozu, které platí režii, když nemůžete vyrábět.' },
      // Zámerne `vozidla`, nie `flotila`: flotila vlastnú stránku nemá, kým ju nedostane,
      // firemné vozy žijú na /vozidla (tam je aj Martinov model - dodávka, viac vodičov).
      // Keby tu stálo `flotila`, prípad „naboural dodávku" by ukazoval na produkt, ktorý
      // nikam nevedie, a Martin by vypadol z prepínača profilov na /vozidla.
      { product: 'vozidla', need: 'nutnost', note: 'Všechna firemní auta na jedné smlouvě a jednom vyúčtování. Přidání vozu bez nové smlouvy.' },
      { product: 'prijem', need: 'doporuceno', note: 'Denní dávka a měsíční renta při pracovní neschopnosti či invaliditě. Příjem běží dál, i když vy nemůžete.' },
      { product: 'pravni', need: 'doporuceno', note: 'Právník, soudní poplatky i náklady protistrany. Spory s odběrateli, dodavateli i zaměstnanci.' },
      { product: 'investice', need: 'zvazit', note: 'Zhodnocení volných prostředků firmy. Provozní rezervu držíme zvlášť od dlouhodobých peněz.' },
    ],
    situations: [
      {
        key: 'podnikatel-nehoda', ic: 'crash',
        product: 'vozidla', sub: 'Havarijní pojištění',
        tab: 'Stala se nehoda',
        title: 'Zaměstnanec naboural firemní dodávku plnou materiálu',
        story: 'Na výjezdu z dvora přehlédl sloup. Škoda na dodávce 143 000 Kč, poškozený materiál na zakázku za 60 000 Kč a montáž u klienta naplánovaná na další den.',
        fix: [
          'Havarijní pojištění pokrylo opravu dodávky včetně odtahu z místa.',
          'Náhradní dodávka ze služby autopůjčovny Allrisk dorazila týž den - montáž u klienta se nezrušila.',
          'Škodu jsme likvidovali interně, Martin ji nahlásil jedním telefonátem a dál se o ni nestaral.',
        ],
        outcome: 'Firma doplatila spoluúčast 5 000 Kč a nepřišla o zakázku ani o klienta.',
      },
      {
        key: 'podnikatel-sklad', ic: 'water',
        product: 'firma', sub: 'Připojištění přerušení provozu',
        tab: 'Vytopilo sklad',
        title: 'V noci prasklo stoupačkové potrubí nad skladem',
        story: 'Ráno našli půl skladu pod vodou. Zničené zásoby za 640 000 Kč, poškozená regálová technika a devět dní, kdy se nedalo expedovat.',
        fix: [
          'Pojištění majetku pokrylo zásoby i technické vybavení skladu.',
          'Připojištění přerušení provozu platilo mzdy a nájem po celou dobu, kdy firma nevydělávala.',
          'Sanační firmu i vysoušení zajistila asistence, sklad byl provozní za devět dní místo tří týdnů.',
        ],
        outcome: 'Plnění 780 000 Kč včetně ušlého zisku. Firma nepropustila nikoho a dodržela smlouvy na další měsíc.',
      },
      {
        key: 'podnikatel-reklamace', ic: 'claim',
        product: 'odpovednostFirmy', sub: 'Odpovědnost za vadné plnění',
        tab: 'Klient chce náhradu',
        title: 'Vadná montáž způsobila škodu na majetku odběratele',
        story: 'Špatně dotažený spoj podmáčel klientovi novou podlahu v provozovně. Klient vyčíslil škodu na 410 000 Kč včetně dvou dnů zavřeného provozu a poslal předžalobní výzvu.',
        fix: [
          'Pojištění odpovědnosti krylo škodu na cizím majetku i následnou škodu z přerušení provozu klienta.',
          'Pojišťovna vedla jednání o výši škody - Martin neplatil vlastního znalce ani advokáta.',
          'Neoprávněnou část nároku pojišťovna odmítla za něj, což je součást krytí.',
        ],
        outcome: 'Uznaná škoda 355 000 Kč šla z pojištění, firma platila spoluúčast 10 000 Kč a udržela si odběratele.',
      },
      {
        key: 'podnikatel-vypadek', ic: 'hospital',
        product: 'prijem', sub: 'Denní dávka pro OSVČ',
        tab: 'Majitel skončil v nemocnici',
        title: 'Akutní operace a sedm týdnů, kdy firmu nikdo neřídil',
        story: 'Martin je jediný, kdo shání zakázky a schvaluje nabídky. Tržby spadly o 60 %, ale mzdy, leasingy a nájem běžely dál.',
        fix: [
          'Denní dávka z pojištění příjmu pokryla jeho výpadek jako OSVČ, kde nemocenská prakticky není.',
          'Plnění za vážné onemocnění přišlo jednorázově a pokrylo provozní díru ve firmě.',
          'Firemní smlouvy jsme na dva měsíce převedli na režim, kde nebylo nutné nic řešit.',
        ],
        outcome: 'Plnění 240 000 Kč. Firma přežila kvartál bez úvěru a bez propouštění.',
      },
      {
        key: 'podnikatel-spor', ic: 'scale',
        product: 'pravni', sub: 'Právní ochrana v podnikání',
        tab: 'Odběratel nezaplatil',
        title: 'Faktura za 380 000 Kč devět měsíců po splatnosti',
        story: 'Odběratel dílo převzal bez výhrad, pak přestal zvedat telefon. Martin měl na výběr odepsat to, nebo jít k soudu a platit advokáta z vlastního.',
        fix: [
          'Právní ochrana zaplatila advokáta, soudní poplatek i znalecký posudek - Martin nedal ze svého nic.',
          'Předžalobní výzva z advokátní kanceláře vyřešila dvě menší faktury ještě před podáním žaloby.',
          'Kdyby spor prohrál, krytí zahrnuje i náklady protistrany - to je ta část, která podnikatele obvykle položí.',
        ],
        outcome: 'Soud přiznal 380 000 Kč i s úroky. Právní náklady 92 000 Kč šly z pojištění, ne ze zisku.',
      },
      {
        key: 'podnikatel-rezerva', ic: 'growth',
        product: 'investice', sub: 'Zhodnocení volných prostředků firmy',
        tab: 'Firmě ležely peníze',
        title: 'Milion na běžném účtu, který jen čekal na daně',
        story: 'Na firemním účtu trvale leželo kolem 1 200 000 Kč - provozní rezerva a peníze odložené na DPH a daň z příjmu. Banka je úročila prakticky nulou.',
        fix: [
          'Provozní rezervu na tři měsíce nákladů jsme nechali okamžitě dostupnou, ne v investicích.',
          'Peníze s pevným termínem (daně, leasing) jdou do konzervativních nástrojů se splatností přesně na ten termín.',
          'Až zbytek má horizont nad pět let a snese dynamičtější složení.',
        ],
        outcome: 'Firma má stejnou likviditu jako dřív a peníze, které předtím jen ležely, konečně něco nesou.',
      },
    ],
    models: {
    vozidla: {
      img: '/cars/bycar.svg',
      tagIcon: 'community',
      driver: 'Firemní vůz · více řidičů',
      car: 'VW Transporter', year: '2022', engine: '2.0 TDI · 110 kW',
      mileage: '35 000 km / rok', deductible: '5 000 Kč',
      usage: 'Rozvoz materiálu a montáže po celé republice. Za volantem se střídají tři zaměstnanci, vůz vozí drahý náklad.',
      base: 640, preset: ['havarie', 'odcizeni', 'asistence', 'nahradni', 'skla'],
      why: 'Když stojí dodávka, stojí zakázka. Plné krytí včetně odcizení a náhradního vozu se vrátí jednou jedinou nepojízdnou dodávkou.',
      perks: [
        'Celá flotila na jedné smlouvě a jednom vyúčtování',
        'Náhradní vozidlo tentýž den, ať montáž nepadne',
        'Krytí odcizení u vozu, který parkuje mimo firemní dvůr',
      ],
    },
    },
  },

  {
    key: 'zivnostnik', seg: 'podnikatele',
    slug: 'zivnostnik',
    // foto pod hero (klient doplní do public/profily/); kým chýba, presvitá značkový gradient
    photo: '/profily/zivnostnik.jpg',
    ic: 'tools',
    // Kresba so ženou pri monitore - jeden človek, ktorý si vedie celú agendu
    // sám. Prevzatá z bezplatnej vrstvy Tabler.io (viď poznámku pri PROFILES).
    img: '/illus/tabler/stories/zivnostnik.png',
    ey: 'Živnostník',
    t: 'Petra, 34 let',
    p: 'Pracuje sama na sebe, bez zaměstnanců.',
    lead: 'Nemá firmu ani tým - má IČO, klienty a vlastní ruce. Když nemůže pracovat ona, nepracuje nikdo a příjem je na nule.',
    pts: [
      'Zabezpečení příjmu, když OSVČ nemá nemocenskou',
      'Odpovědnost za škodu způsobenou vlastní prací',
      'Právní ochrana na nezaplacené faktury',
    ],
    intro: 'Živí se sama na sebe pátým rokem a jde jí to. Za ni ale nikdo nezaskočí, za chybu ručí osobním majetkem a stát jí na důchod odvádí minimum - tři díry, o kterých se v dobrých měsících nepřemýšlí.',
    solved: [
      { product: 'prijem', need: 'nutnost', note: 'Nemocenská pro OSVČ prakticky neexistuje. Denní dávka a renta drží příjem, když nemůžete pracovat vy osobně.' },
      { product: 'odpovednostFirmy', need: 'nutnost', note: 'Škoda, kterou způsobíte klientovi svou prací. U živnostníka jde nárok rovnou na osobní majetek, firma mezi tím nestojí.' },
      { product: 'pravni', need: 'doporuceno', note: 'Nezaplacené faktury a spory se zákazníky. Advokáta, soudní poplatek i posudek platí pojištění, ne vy z rezervy.' },
      { product: 'penze', need: 'doporuceno', note: 'Za OSVČ odvádí stát minimum. Bez vlastního spoření je důchod zlomek toho, na co jste dnes zvyklá.' },
      { product: 'domacnost', need: 'doporuceno', note: 'Vybavení, se kterým pracujete, bývá doma. Běžná domácnost ho kryje jen do limitu a podnikání z ní často vypadává.' },
      { product: 'investice', need: 'zvazit', note: 'Nepravidelný příjem chce nejdřív rezervu na tři měsíce nákladů. Teprve to, co zbude nad ní, má smysl investovat.' },
    ],
    situations: [
      {
        key: 'zivnostnik-chyba', ic: 'claim',
        product: 'odpovednostFirmy', sub: 'Odpovědnost za škodu z podnikání',
        tab: 'Chyba v zakázce',
        title: 'Špatný podklad, který klient stihl vytisknout v nákladu 20 000 kusů',
        story: 'Chyba v datech šla do tisku a přišla se na ni až po dodání. Klient vyčíslil zmařený náklad na 186 000 Kč a chtěl ho po Petře - ta má IČO, ne firmu, takže ručí vším, co má.',
        fix: [
          'Pojištění odpovědnosti krylo škodu způsobenou vadným plněním, včetně nákladů na nový tisk.',
          'O výši škody jednala pojišťovna, Petra neplatila vlastního znalce ani advokáta.',
          'Část nároku za ušlý zisk byla neoprávněná a pojišťovna ji odmítla za ni.',
        ],
        outcome: 'Uznaná škoda 162 000 Kč šla z pojištění, Petra doplatila spoluúčast 5 000 Kč a klienta si udržela.',
      },
      {
        key: 'zivnostnik-nemoc', ic: 'illness',
        product: 'prijem', sub: 'Denní dávka pro OSVČ',
        tab: 'Nemohla pracovat',
        title: 'Zánět šlach v zápěstí a jedenáct týdnů bez jediné odevzdané zakázky',
        story: 'Diagnóza z přetížení, fixace a rehabilitace. Petra si neplatila dobrovolné nemocenské, takže jí ze systému nepřišla ani koruna - ale nájem ateliéru, záloha na zdravotní a leasing běžely dál.',
        fix: [
          'Denní dávka z pojištění příjmu naskočila od 15. dne a běžela po celou dobu léčby.',
          'Krytí platí pro OSVČ, kde se plnění neváže na potvrzení od zaměstnavatele.',
          'Stálé náklady jsme s ní na dva měsíce přenastavili, aby plnění stačilo pokrýt i je.',
        ],
        outcome: 'Plnění 148 000 Kč. Petra nemusela sáhnout na rezervu ani vzít úvěr a vrátila se ke klientům, které si udržela.',
      },
      {
        key: 'zivnostnik-faktura', ic: 'scale',
        product: 'pravni', sub: 'Právní ochrana v podnikání',
        tab: 'Zákazník nezaplatil',
        title: 'Dvě faktury za 94 000 Kč a klient, který přestal odpovídat',
        story: 'Dílo převzal bez výhrad, pak se odmlčel. Advokát za vymáhání chtěl zálohu 25 000 Kč, což je u téhle částky skoro třetina - Petra to málem odepsala.',
        fix: [
          'Právní ochrana zaplatila advokáta i soudní poplatek, Petra nedala ze svého nic.',
          'Předžalobní výzva z advokátní kanceláře vyřešila menší z faktur ještě před podáním žaloby.',
          'Krytí zahrnuje i náklady protistrany pro případ, že by spor prohrála.',
        ],
        outcome: 'Zaplaceno 94 000 Kč i s úroky z prodlení. Právní náklady 31 000 Kč šly z pojištění.',
      },
      {
        key: 'zivnostnik-penze', ic: 'growth',
        product: 'penze', sub: 'Penzijní spoření pro OSVČ',
        tab: 'Odvádí minimum',
        title: 'Deset let na minimálních zálohách a důchod kolem 13 000 Kč',
        story: 'Petra odvádí minimum, protože „daňově se to vyplatí". Propočet ale ukázal, co to znamená za třicet let: státní důchod na úrovni třetiny dnešního příjmu a nic dalšího.',
        fix: [
          'Penzijní spoření se státním příspěvkem jako základ, který se u OSVČ vyplatí i daňově.',
          'Nad ním pravidelná investice s horizontem nad dvacet let, kde nevadí výkyv.',
          'Částku jsme navázali na fakturaci, ne na pevný měsíční odvod - v slabém měsíci se sníží.',
        ],
        outcome: 'Petra odkládá v průměru 6 200 Kč měsíčně a rozdíl proti minimálním odvodům je za třicet let víc než dvojnásobek důchodu.',
      },
    ],
  },

  {
    key: 'vyrobni', seg: 'podnikatele',
    slug: 'vyrobni-firma',
    // foto pod hero (klient doplní do public/profily/); kým chýba, presvitá značkový gradient
    photo: '/profily/vyrobni-firma.jpg',
    ic: 'factory',
    // Žeriav a stavebné kocky - jediná kresba v celej zásobe, ktorá hovorí
    // o výrobe. Sem sedí lepšie než kamkoľvek inam.
    img: '/illus/tabler/stories/vyrobni-firma.png',
    ey: 'Výrobní firma',
    t: 'Zdeněk, 52 let',
    p: 'Hala, dvacet lidí a export do Německa.',
    lead: 'Majetek v desítkách milionů, linka, která nesmí stát, a odběratelé v zahraničí. Rizika velké firmy, rozpočet střední.',
    pts: [
      'Majetek a přerušení provozu, když stojí linka',
      'Odpovědnost za vadný výrobek i mimo ČR',
      'Flotila dodávek a vysokozdvižných vozíků',
    ],
    intro: 'Vyrábí kovové komponenty pro německé odběratele. Hala, lisy a zásoby dělají desítky milionů, ale nejdražší položkou není majetek - je to týden, kdy linka stojí a odběratel čeká.',
    solved: [
      { product: 'firma', need: 'nutnost', note: 'Hala, stroje a zásoby. Součástí je přerušení provozu, které platí mzdy a režii, když se nevyrábí.' },
      { product: 'odpovednostFirmy', need: 'nutnost', note: 'Vadný výrobek u odběratele včetně následné škody. Krytí musí platit i tam, kam dodáváte, ne jen v ČR.' },
      { product: 'flotila', need: 'nutnost', note: 'Dodávky, vozíky i osobní vozy na jedné smlouvě a jednom vyúčtování. Přidání vozu bez nové smlouvy.' },
      { product: 'zivot', need: 'doporuceno', note: 'Úrazové pojištění lidí ve výrobě. U rizikových profesí je to zároveň argument, proč u vás zůstat.' },
      { product: 'pravni', need: 'doporuceno', note: 'Spory s odběrateli, dodavateli i zaměstnanci. U exportu se řeší podle cizího práva a to je bez pojištění drahé.' },
      { product: 'investice', need: 'zvazit', note: 'Provozní rezerva zvlášť, peníze s pevným termínem zvlášť. Investuje se až to, co má horizont nad pět let.' },
    ],
    situations: [
      {
        key: 'vyrobni-linka', ic: 'storm',
        product: 'firma', sub: 'Připojištění přerušení provozu',
        tab: 'Stála výroba',
        title: 'Přepětí po bouřce spálilo řídicí jednotku lisu',
        story: 'Zásah do trafostanice, přepětí v rozvodech a spálená elektronika hlavního lisu. Náhradní díl z Itálie s dodáním tři týdny a odběratel, který má v objednávce sankci za zpoždění.',
        fix: [
          'Pojištění majetku pokrylo opravu lisu i poškozené rozvody a čidla po celé hale.',
          'Přerušení provozu platilo mzdy, nájem a fixní režii po celou dobu, kdy linka stála.',
          'Asistence sehnala náhradní díl přes servisní síť za devět dní místo tří týdnů.',
        ],
        outcome: 'Plnění 1 940 000 Kč včetně ušlého zisku. Firma dodala se skluzem pěti dní a sankci od odběratele nezaplatila.',
      },
      {
        key: 'vyrobni-vada', ic: 'claim',
        product: 'odpovednostFirmy', sub: 'Odpovědnost za vadný výrobek',
        tab: 'Reklamace ze zahraničí',
        title: 'Vadná série komponentů zastavila montážní linku odběratele v Bavorsku',
        story: 'Nedodržená tolerance u 4 200 kusů se projevila až v montáži. Odběratel zastavil linku na dva dny, vyčíslil škodu na 218 000 eur a nárok uplatnil podle německého práva.',
        fix: [
          'Odpovědnost za vadný výrobek kryla nejen výměnu dílů, ale i následnou škodu z přerušení výroby odběratele.',
          'Územní platnost smlouvy zahrnuje EU - bez toho by nárok podle německého práva zůstal celý na firmě.',
          'Pojišťovna zajistila německého právního zástupce i posouzení nároku na místě.',
        ],
        outcome: 'Uznaná škoda 173 000 eur šla z pojištění. Firma zaplatila spoluúčast a zakázku si udržela i na další rok.',
      },
      {
        key: 'vyrobni-uraz', ic: 'firstaid',
        product: 'zivot', sub: 'Úrazové pojištění zaměstnanců',
        tab: 'Úraz ve výrobě',
        title: 'Přiskřípnutá ruka u lisu a devět měsíců mimo provoz',
        story: 'Zkušený obsluhovač, chvíle nepozornosti, tři operace a trvalé omezení hybnosti prstů. Zákonné pojištění zaměstnavatele pokrylo část, zbytek by firma řešila z vlastního - a hlavně by přišla o člověka.',
        fix: [
          'Skupinové úrazové pojištění vyplatilo za trvalé následky nad rámec zákonného pojištění.',
          'Denní odškodné běželo po celou dobu léčby, takže rodině nespadl příjem.',
          'Firma po návratu přeřadila zaměstnance na kontrolu kvality a nemusela hledat nikoho nového.',
        ],
        outcome: 'Plnění 620 000 Kč zaměstnanci. Firma si udržela člověka, kterého zaučovala čtyři roky.',
      },
      {
        key: 'vyrobni-flotila', ic: 'crash',
        product: 'flotila', sub: 'Flotilové pojištění',
        tab: 'Nabourala dodávka',
        title: 'Šestý vůz ve flotile a šestá smlouva s jiným výročím',
        story: 'Každý vůz měl vlastní smlouvu, jiné výročí a jiný variabilní symbol. Když jeden naboural, hledala účetní půl dne, u koho vlastně je - a přidání sedmého vozu znamenalo celé kolo znovu.',
        fix: [
          'Celou flotilu jsme převedli na jednu smlouvu s jedním vyúčtováním a jedním výročím.',
          'Přidání i odebrání vozu je dnes jeden e-mail, ne nová smlouva a nové sjednávání.',
          'Náhradní vozidlo po nehodě je v základu až na 20 dní, takže rozvoz nestojí.',
        ],
        outcome: 'Administrativa flotily klesla z půl dne měsíčně na pár minut a pojistné je o 14 % níž než součet původních šesti smluv.',
      },
    ],
  },

  {
    key: 'pred-penzi', seg: 'rodiny',
    slug: 'pred-penzi',
    // foto pod hero (klient doplní do public/profily/); kým chýba, presvitá značkový gradient
    photo: '/profily/pred-penzi.jpg',
    ic: 'coin',
    img: '/illus/tabler/stories/pred-penzi.svg',
    ey: 'Klient před penzí',
    t: 'Pavel, 63 let',
    p: 'Blíží se konec kariéry a otázka, co dál.',
    lead: 'Za dva roky odchází do důchodu. Chtěl vědět, z čeho bude žít, co dělají jeho staré smlouvy a co jednou předá dětem.',
    pts: [
      'Přehled příjmů v penzi z penzijka i investic',
      'Zrušení smluv, které už nic nekryjí',
      'Nastavení majetku pro předání dětem',
    ],
    intro: 'Za dva roky odchází do důchodu. Hypotéka je splacená a děti odrostlé, ale staré pojistky pořád běží a kryjí rizika, která už dávno nehrozí - zatímco příjem brzy klesne na polovinu.',
    solved: [
      { product: 'penze', need: 'nutnost', note: 'Penzijní spoření se státním příspěvkem a výplata renty. Spočítáme, kolik měsíčně reálně přijde.' },
      { product: 'zivot', need: 'doporuceno', note: 'Výplata sjednané částky při vážné nemoci, úrazu nebo úmrtí. Rozsah rizik doladíme na váš věk.' },
      { product: 'investice', need: 'doporuceno', note: 'Investice ve výplatní fázi - portfolio, které místo růstu posílá peníze každý měsíc.' },
      { product: 'nemovitost', need: 'nutnost', note: 'Stavba domu proti požáru, vodě a živlu. Pojistnou částku nastavíme na dnešní cenu, ne na tu z původní smlouvy.' },
      { product: 'pravni', need: 'zvazit', note: 'Právník, soudní poplatky i náklady protistrany. Převody majetku, darovací smlouvy a věcná břemena.' },
      { product: 'vozidla', need: 'doporuceno', note: 'Povinné ručení i havarijní pojištění. U staršího vozu a nízkého nájezdu rozsah i cenu přizpůsobíme.' },
    ],
    situations: [
      {
        key: 'penze-nemoc', ic: 'illness',
        product: 'zivot', sub: 'Připojištění vážných onemocnění',
        tab: 'Přišla vážná nemoc',
        title: 'Diagnóza, operace a půl roku léčby v 63 letech',
        story: 'Onkologická diagnóza při preventivní prohlídce. Léčba, doplatky na léky, doprava do fakultní nemocnice a osm měsíců mimo práci dva roky před penzí.',
        fix: [
          'Připojištění vážných onemocnění vyplatilo sjednanou částku jednorázově, hned po stanovení diagnózy.',
          'Peníze pokryly doplatky, cesty do nemocnice i výpadek příjmu, aniž by sahal na penzijko.',
          'Staré smlouvy jsme rok předtím při revizi zrušili a rozdíl v ceně dali právě do krytí nemocí.',
        ],
        outcome: 'Plnění 400 000 Kč. Pavel nemusel předčasně vybrat penzijní spoření ani prodat část investic.',
      },
      {
        key: 'penze-prijem', ic: 'income',
        product: 'penze', sub: 'Renta z penzijního spoření',
        tab: 'Skončil příjem z práce',
        title: 'Ze 48 000 Kč čistého na státní důchod 21 300 Kč',
        story: 'Rozdíl 27 000 Kč měsíčně. Náklady na dům přitom zůstaly stejné a Pavel chtěl vědět, jestli si může dovolit zůstat bydlet tam, kde je.',
        fix: [
          'Sestavili jsme reálný výplatní plán: státní důchod + renta z penzijka + pravidelný výběr z portfolia.',
          'Penzijko jsme dva roky předem přesunuli do konzervativní strategie, aby ho nepodrazil propad trhu.',
          'Nastavili jsme měsíční výplatu z investic tak, aby portfolio vydrželo přes dvacet let.',
        ],
        outcome: 'Měsíční příjem v penzi 38 600 Kč místo 21 300 Kč. Dům si nechal.',
      },
      {
        key: 'penze-kotelna', ic: 'frost',
        product: 'nemovitost', sub: 'Škoda vodou z prasklého potrubí',
        tab: 'Zamrzla voda v domě',
        title: 'Prasklé rozvody a vytopený suterén po lednových mrazech',
        story: 'Byli u dcery přes svátky. Zamrzlo a prasklo potrubí v nevytápěné části domu, voda tekla několik dní. Škoda 380 000 Kč na rozvodech, podlaze a technice v suterénu.',
        fix: [
          'Pojistnou částku jsme při revizi zvedli na reálnou hodnotu domu - původní byla z roku 2009.',
          'Krytí zahrnuje i škody vodou z prasklého potrubí, což v původní smlouvě chybělo.',
          'Havarijní službu a vysoušeče poslala asistence ještě před jejich návratem domů.',
        ],
        outcome: 'Plnění 370 000 Kč. Ze staré smlouvy by dostal necelou třetinu.',
      },
      {
        key: 'penze-auto', ic: 'garage',
        product: 'vozidla', sub: 'Technické asistence',
        tab: 'Stará auta a nízký nájezd',
        title: 'Platil havarijku na patnáct let starý vůz',
        story: 'Golf z roku 2012 s nájezdem 8 000 km ročně. Havarijní pojištění stálo 420 Kč měsíčně, přitom obecná cena vozu klesla pod 90 000 Kč.',
        fix: [
          'Havarijku jsme zrušili - u vozu téhle hodnoty se spoluúčastí už nedává smysl.',
          'Ušetřené peníze šly do kvalitní asistence, která u staršího auta zasáhne mnohem častěji.',
          'Bonus za bezeškodní průběh jsme převedli, takže povinné ručení kleslo ještě víc.',
        ],
        outcome: 'Úspora 4 100 Kč ročně a lepší krytí přesně tam, kde ho starší vůz opravdu potřebuje.',
      },
      {
        key: 'penze-portfolio', ic: 'growth',
        product: 'investice', sub: 'Výplatní fáze portfolia',
        tab: 'Trhy spadly před penzí',
        title: 'Propad o 22 % rok a půl před plánovaným odchodem do penze',
        story: 'V portfoliu měl 3,4 milionu a chystal se z nich vyplácet. Prodávat v propadu hned v prvních letech výběru je přesně to, po čem peníze nevydrží tak dlouho, jak mají.',
        fix: [
          'Dva roky výběrů jsme drželi mimo trh, takže Pavel nemusel prodat ani jednu akcii v propadu.',
          'Portfolio jsme překlápěli do konzervativního podle plánu, ne podle nálady na trhu.',
          'Rebalancování po propadu nakoupilo levněji - bez něj by se návrat protáhl o roky.',
        ],
        outcome: 'Portfolio se vrátilo na původní hodnotu za 14 měsíců a výplatní plán se nemusel měnit ani o korunu.',
      },
      {
        key: 'penze-prevod', ic: 'scale',
        product: 'pravni', sub: 'Právní ochrana v rodinných vztazích',
        tab: 'Převáděl dům na dceru',
        title: 'Dům na dceru, ale s právem dožití pro sebe i manželku',
        story: 'Chtěl to vyřešit za života, ne nechat dědické řízení na dětech. Zároveň potřeboval jistotu, že v domě oba dožijí, i kdyby se dceřina situace změnila.',
        fix: [
          'Darovací smlouvu i věcné břemeno dožití sepsal advokát z krytí právní ochrany.',
          'Návrh na vklad do katastru a poplatky šly z pojištění, ne z jejich úspor.',
          'Ošetřili jsme i případ rozvodu dcery, aby dům nespadl do vypořádání společného jmění.',
        ],
        outcome: 'Převod je hotový, právo dožití zapsané v katastru. Právní služby za 34 000 Kč zaplatilo pojištění.',
      },
    ],
    models: {
    vozidla: {
      img: '/cars/bycar.svg',
      tagIcon: 'user',
      driver: 'Řidič 63 let · bez nehody 18 let',
      car: 'Volkswagen Golf', year: '2012', engine: '1.6 TDI · 77 kW',
      mileage: '8 000 km / rok', deductible: '10 000 Kč',
      usage: 'Nákupy, chalupa a cesty za vnoučaty. Nízký nájezd, ale vůz musí spolehlivě nastartovat pokaždé.',
      base: 320, preset: ['asistence', 'skla'],
      why: 'Starší vůz s nízkou hodnotou. Havarijku už nemá smysl platit - vyplatí se spolehlivá asistence a maximální bonus.',
      perks: [
        'Levné a férové krytí podle skutečné hodnoty vozu',
        'Žádné přeplácení za připojištění, které nedává smysl',
        'Odtah a oprava na místě, kdyby vůz nenastartoval',
      ],
    },
    },
  },

  /* ---- města a obce ----
     Do 2026-08-12 tu obce archetypy NEMALI (viď poznámku nad PROFILES). User to
     otočil: rad dlaždíc ukáže, čím sa obec od obce líši, aj keď za ním zatiaľ
     nie je detailná stránka. Preto tieto tri NEMAJÚ `slug` - ProfileCards ich
     vykreslí bez prekliku a bez „Zobrazit profil", takže nesľubujú stránku,
     ktorá neexistuje. Chýba im aj `solved` a `models`: oboje číta len detail
     a produktová stránka, kam sa obec zatiaľ nedostane.
     `situations: []` tam byť MUSÍ - `situationsFor()` prechádza všetky profily
     a bez poľa by na produktovej stránke spadlo. */
  {
    // POZOR na trojicu obcí: kresby sú tu čisto zástupné. V celej bezplatnej
    // zásobe Tabler.io nie je NIČ, čo by hovorilo o obci alebo o úrade, takže
    // dlaždice nesú kocúra, žongléra a nákupný vozík - vyplnené miesto, nie
    // význam. Toto je prvé, čo sa má vymeniť, keď pribudne platený balík.
    key: 'mala-obec', seg: 'mesta',
    ic: 'village',
    img: '/illus/tabler/stories/mala-obec.svg',
    ey: 'Malá obec',
    t: 'Do 1 000 obyvatel',
    p: 'Úřad, hasičárna a starosta na půl úvazku.',
    situations: [],
  },
  {
    key: 'mesto', seg: 'mesta',
    ic: 'townhall',
    img: '/illus/tabler/stories/mesto.svg',
    ey: 'Město',
    t: 'Nad 5 000 obyvatel',
    p: 'Školy, bytový fond a vlastní technické služby.',
    situations: [],
  },
  {
    key: 'svazek-obci', seg: 'mesta',
    ic: 'town',
    img: '/illus/tabler/stories/svazek-obci.svg',
    ey: 'Svazek obcí',
    t: 'Několik obcí společně',
    p: 'Společný majetek, vodovod a jedno výběrové řízení.',
    situations: [],
  },
]

// ---- lookupy ----
export const profileBySlug = (slug) => PROFILES.find((p) => p.slug === slug)
export const profileByKey = (key) => PROFILES.find((p) => p.key === key)

// Archetypy jedného publika. Prázdny výsledok je platná odpoveď, nie chyba -
// stránka podľa neho vie, že sekciu profilov nemá vôbec vykresliť. Preto tu
// NIE JE fallback na rodiny.
export const profilesFor = (seg) => PROFILES.filter((p) => p.seg === seg)

// Situácia pre dvojicu (profil, produkt) - vstup z produktovej stránky.
export const situationFor = (profileKey, productKey) =>
  profileByKey(profileKey)?.situations.find((s) => s.product === productKey)

// Všetky situácie k jednému produktu, v poradí profilov - taby na produktovej stránke.
// `seg` zužuje výber na jedno publikum. Produkt JE scopovaný na publikum (user,
// 2026-08-12): stránka /vozidla je produkt pre jednotlivcov a rodiny, firemné vozy
// sú samostatná „Flotila vozidel", ktorá stránku zatiaľ nemá. Bez tohto filtra
// stál Martin so skladom a dodávkou medzi štyrmi domácnosťami a produkt tvrdil,
// že je pre všetkých - čo nie je.
export const situationsFor = (productKey, seg) =>
  PROFILES.map((p) => {
    if (seg && p.seg !== seg) return null
    const s = p.situations.find((x) => x.product === productKey)
    return s ? { profile: p, situation: s } : null
  }).filter(Boolean)

// Modelové zadanie pre dvojicu (profil, produkt).
export const modelFor = (profileKey, productKey) =>
  profileByKey(profileKey)?.models?.[productKey]

// Vstup pre sekciu „Najděte se v jednom ze čtyř profilů" na produktovej stránke.
// Vracia iba profily, ktoré majú k produktu OBOJE - situáciu aj model - takže
// prepínač nikdy neponúkne dlaždicu, pod ktorou by nebolo čo vykresliť.
export const modelsFor = (productKey) =>
  situationsFor(productKey)
    .map((x) => ({ ...x, model: x.profile.models?.[productKey] }))
    .filter((x) => x.model)

// Genitív pre nadpis „jednom ze <…> profilů" - počet sa mení podľa produktu.
const COUNT_GEN = { 2: 'dvou', 3: 'tří', 4: 'čtyř', 5: 'pěti', 6: 'šesti', 7: 'sedmi' }
export const countGen = (n) => COUNT_GEN[n] || String(n)

// „Čtyři situace" / „Pět situací" - česky sa s číslovkou 5+ mení aj pád podstatného mena,
// preto to vracia celú frázu, nie len číslovku. Počet situácií je per profil.
const COUNT_NOM = { 1: 'Jedna', 2: 'Dvě', 3: 'Tři', 4: 'Čtyři', 5: 'Pět', 6: 'Šest', 7: 'Sedm' }
export const situationCount = (n) =>
  `${COUNT_NOM[n] || n} ${n === 1 ? 'situace' : n <= 4 ? 'situace' : 'situací'}`

// Hlavička úrovne v maticovom rozložení. `hint` je jednoveršový preklad štítku do
// bežnej reči - samotné „Zvážit" nepovie, podľa čoho sa má človek rozhodnúť.
// Ikony sú KĽÚČE, komponenty k nim mapuje ProfileParts.jsx (rovnako ako pri produktoch).
export const NEED_META = {
  nutnost: { label: 'Nutnost', hint: 'Bez tohohle to nedává smysl', ic: 'need-must' },
  doporuceno: { label: 'Doporučujeme', hint: 'Chybí to nejčastěji ze všeho', ic: 'need-rec' },
  zvazit: { label: 'Zvážit', hint: 'Podle toho, jak na tom jste', ic: 'need-opt' },
}
// Poradie naliehavosti - zoznam sa ním triedi, nutnosti idú navrch.
export const NEED_ORDER = ['nutnost', 'doporuceno', 'zvazit']
export const needRank = (need) => {
  const i = NEED_ORDER.indexOf(need)
  return i === -1 ? NEED_ORDER.length : i
}

// Položky zoskupené po úrovniach pre maticové rozloženie.
// Prázdne úrovne VYPADNÚ - rodina nemá ani jedno „Zvážit" a pevné tri stĺpce by
// tam nechali prázdne miesto, ktoré vyzerá ako chyba. Počet skupín preto určuje
// aj počet stĺpcov (viď --sgrp-n v profile.css).
export const groupByNeed = (items) =>
  NEED_ORDER
    .map((need) => ({ need, items: items.filter((it) => it.need === need) }))
    .filter((g) => g.items.length)
