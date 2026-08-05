// Klientské profily (archetypy) – JEDEN zdroj pravdy pre tri kontexty:
//   1. landing (/)            – dlaždica profilu + preklik na detail
//   2. /profil/:slug          – archetyp, „Co je dobré mít vyřešeno", situácie ako taby
//   3. produktová stránka     – tá istá situácia, len vstup je produkt a taby sú profily
//
// Kľúčová myšlienka: SITUÁCIA je zdieľaná entita s väzbou (profil × produkt).
// Z profilu ju čítaš cez `p.situations`, z produktu cez `situationsFor(productKey)`.
// Ikony sú KĽÚČE (rovnako ako v menu.js), komponenty k nim mapuje ProfileParts.jsx.
//
// Rovnakú väzbu (profil × produkt) má aj MODEL – konkrétne zadanie, na ktorom produktová
// stránka ukazuje odporúčané krytie a cenu. Preto žije v `p.models[productKey]`, nie
// natvrdo ako „vehicle". Kontrakt modelu:
//   povinné pre každý produkt: img, tagIcon, usage, why, perks[], base, preset[]
//   zvyšok je špecifický pre daný produkt (u vozidiel car/year/engine/mileage/deductible)
// Profil sa na produktovej stránke objaví len vtedy, keď má K TOMU PRODUKTU aj situáciu
// aj model – `modelsFor(productKey)` vracia presne tie dvojice.

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

// ---- 4 archetypy ----
// need: 'nutnost' = bez toho to nedáva zmysel, 'doporuceno' = silne odporúčame, 'zvazit' = podľa situácie
export const PROFILES = [
  {
    key: 'singl',
    slug: 'sam-za-sebe',
    // foto pod hero (klient doplní do public/profily/); kým chýba, presvitá značkový gradient
    photo: '/profily/sam-za-sebe.jpg',
    ic: 'user',
    // tabler „boy-and-cat" – chlap s mačkou, teda človek, čo bydlí sám
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
    intro: 'Bydlí v nájmu, jezdí ojetým autem a poprvé v životě mu na konci měsíce něco zbyde. Nemá co ztratit na majetku – zato všechno stojí na jednom příjmu, který nikdo nenahradí.',
    // ---- „Co je dobré mít vyřešeno" ----
    solved: [
      { product: 'vozidla', need: 'nutnost', note: 'Povinné ručení je ze zákona, zbytek podle stáří vozu. U ojetiny často stačí asistence a skla místo drahé havarijky.' },
      { product: 'odpovednost', need: 'nutnost', note: 'Škoda, kterou způsobíte někomu jinému v běžném životě. Nejlevnější pojistka na trhu a nejčastěji zachrání majlant.' },
      { product: 'prijem', need: 'doporuceno', note: 'Denní dávka při pracovní neschopnosti. Když bydlíte sám, nájem běží dál i tři měsíce na neschopence.' },
      { product: 'domacnost', need: 'doporuceno', note: 'Vaše věci v pronajatém bytě – notebook, kolo, elektronika. Majitelova pojistka kryje jen jeho zdi, ne váš majetek.' },
      { product: 'cesty', need: 'doporuceno', note: 'Léčebné výlohy a zavazadla. Celoroční varianta pokryje i víkendový výjezd, na který se sjednávat nechce.' },
      { product: 'investice', need: 'zvazit', note: 'Pravidelné investování už od pár stovek měsíčně. Nejlevnější složené úročení je to, které začne nejdřív.' },
    ],
    situations: [
      {
        key: 'singl-nehoda', ic: 'crash',
        product: 'vozidla',
        tab: 'Stala se nehoda',
        title: 'Na parkovišti u práce mu někdo urazil zrcátko a ujel',
        story: 'Škoda 14 000 Kč, viník nezjištěn, kamery na parkovišti nic nezachytily. Lukáš má auto z druhé ruky a na opravu z vlastní kapsy nemá.',
        fix: [
          'Havarijní připojištění krylo i škodu od neznámého viníka – povinné ručení tohle nikdy nekryje.',
          'Škodu jsme nahlásili za něj, likvidaci vede přímo oddělení Allrisk.',
          'Opravu odsouhlasil online, do servisu jel jednou a bez zálohy.',
        ],
        outcome: 'Lukáš doplatil spoluúčast 5 000 Kč místo celých 14 000 Kč a auto měl zpátky za čtyři dny.',
      },
      {
        key: 'singl-skoda', ic: 'claim',
        product: 'odpovednost',
        tab: 'Způsobil škodu',
        title: 'Při stěhování upustil kamarádovi televizi',
        story: 'Nová 65" OLED za 38 000 Kč, rozbitá při nesení do výtahu. Kamarád nic nechtěl, ale Lukášovi to nedalo – a byla to skoro celá jeho rezerva.',
        fix: [
          'Pojištění odpovědnosti krylo škodu na cizí věci, kterou způsobil neúmyslně.',
          'Stačilo doložit účtenku a fotky, žádný znalecký posudek.',
          'Roční pojistné je nižší, než co by ho stála jedna taková škoda.',
        ],
        outcome: 'Pojišťovna vyplatila 37 000 Kč. Lukáš zaplatil spoluúčast 1 000 Kč a rezervu si nechal.',
      },
      {
        key: 'singl-vypadek', ic: 'injury',
        product: 'prijem',
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
        product: 'cesty',
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
    key: 'rodina',
    slug: 'rodina',
    // foto pár ~38 s dvomi školákmi – presne tento zlúčený archetyp
    // (súbor sa volá po pôvodnom profile „rodina v nejlepších letech", obsah sedí)
    photo: '/profily/rodina-v-nejlepsich-letech.jpg',
    ic: 'heart',
    // tabler „shopping" – pár s nákupným vozíkom
    img: '/illus/tabler/stories/rodina.svg',
    ey: 'Rodina',
    t: 'Jana a Tomáš, 38 let',
    p: 'Hypotéka, dvě děti a všechno najednou.',
    lead: 'Byt na hypotéku, dvě děti a jedno auto na všechno. Nejvíc majetku i nejvíc závazků za celý život – a rozpočet, který stojí na dvou příjmech.',
    pts: [
      'Životní pojištění navázané na splátku hypotéky',
      'Pojištění nemovitosti, domácnosti i odpovědnosti',
      'Investice na studium dětí a vlastní rezervu',
    ],
    // ---- krátky popis osoby do hera detailnej stránky (/profil/:slug) ----
    intro: 'Splácejí hypotéku, vozí dvě děti na kroužky a byt mají čerstvě po rekonstrukci. Je to období, kdy mají nejvyšší příjem a největší majetek – a zároveň nejvíc toho, co se může pokazit.',
    // ---- „Co je dobré mít vyřešeno" ----
    solved: [
      { product: 'zivot', need: 'nutnost', note: 'Výplata sjednané částky při úrazu, vážné nemoci nebo úmrtí. Pojistnou částku navážeme na zůstatek hypotéky.' },
      { product: 'nemovitost', need: 'nutnost', note: 'Stavba bytu či domu proti požáru, vodě a živlu – včetně sklepa a garáže. Po rekonstrukci částku přepíšeme na novou cenu.' },
      { product: 'domacnost', need: 'nutnost', note: 'Vybavení, elektronika a osobní věci uvnitř. Kryje i krádež, vytopení a poškozené spotřebiče.' },
      { product: 'vozidla', need: 'nutnost', note: 'Povinné ručení i havarijní pojištění. Všechna auta v rodině na jednom vyúčtování, bonus lze mezi nimi převádět.' },
      { product: 'odpovednost', need: 'doporuceno', note: 'Škoda, kterou způsobíte někomu jinému v běžném životě – vytopený soused i rozbitá věc v cizím bytě.' },
      { product: 'investice', need: 'doporuceno', note: 'Investice a spoření s odlišnou strategií podle horizontu – peníze na školu dětí zvlášť od vlastní rezervy.' },
    ],
    // ---- situácie („Proč je dobré mít toto pojištění") ----
    situations: [
      {
        key: 'rodina-nehoda', ic: 'crash',
        product: 'vozidla',
        tab: 'Stala se nehoda',
        title: 'Na kruhovém objezdu do nich zezadu naboural dodávkař',
        story: 'Jana vezla malou z kontroly. Škoda na zadní části vozu 78 000 Kč, auto nepojízdné, viník uznal zavinění na místě. Rodina má jedno auto a Tomáš jím jezdí do práce 40 km denně.',
        fix: [
          'Škodu jsme nahlásili za ně – likvidaci vede přímo oddělení Allrisk, ne cizí pojišťovna.',
          'Náhradní vůz přistavený do druhého dne, Tomáš nevynechal jedinou směnu.',
          'Vymáhání po viníkově pojišťovně jsme převzali my, Jana neřešila ani jeden telefonát.',
        ],
        outcome: 'Rodina doplatila 0 Kč. Auto se vrátilo ze servisu za 3 týdny, celou dobu jezdili náhradním.',
      },
      {
        key: 'rodina-vytopeni', ic: 'water',
        product: 'domacnost',
        tab: 'Vytopili sousedy',
        title: 'Praskla přívodní hadička u pračky, když nikdo nebyl doma',
        story: 'Voda tekla šest hodin. Zničená plovoucí podlaha v novém bytě a promáčený strop u sousedů pod nimi, kteří měli rok starou rekonstrukci koupelny.',
        fix: [
          'Pojištění domácnosti pokrylo podlahu, nábytek a vysoušení jejich bytu.',
          'Pojištění odpovědnosti zaplatilo škodu sousedům – 112 000 Kč, kterou by jinak platili ze svého.',
          'Vysoušeče a firmu na sanaci zařídila asistenční služba, ne oni.',
        ],
        outcome: 'Z celkové škody 190 000 Kč zaplatila rodina spoluúčast 1 000 Kč. Se sousedy zůstali zadobře.',
      },
      {
        key: 'rodina-vypadek', ic: 'injury',
        product: 'zivot',
        tab: 'Vypadl příjem',
        title: 'Tomáš si při pádu ze žebříku zlomil nohu na třech místech',
        story: 'Pět měsíců na neschopence. Nemocenská pokryla necelou polovinu jeho čisté mzdy, splátka hypotéky 21 400 Kč přitom běžela dál a Jana pracuje na zkrácený úvazek.',
        fix: [
          'Denní dávka při pracovní neschopnosti dorovnala výpadek od 29. dne.',
          'Plnění za trvalé následky úrazu přišlo jednorázově po ustálení stavu.',
          'Splátky hypotéky ani jednou nevypadly – nemuseli sahat na rezervu ani žádat o odklad.',
        ],
        outcome: 'Za pět měsíců přišlo plnění 168 000 Kč. Rodina neřešila peníze, jen Tomášovu nohu.',
      },
      {
        key: 'rodina-hypoteka', ic: 'newhome',
        product: 'hypoteka',
        tab: 'Kupovali byt',
        title: 'První nabídka z banky nebyla ta, kterou nakonec podepsali',
        story: 'Vlastní banka jim schválila sazbu o 0,4 p. b. vyšší a odhad nemovitosti chtěla za 6 900 Kč. K tomu tlačila balíček pojištění, který se splátkou vůbec nesouvisel.',
        fix: [
          'Srovnali jsme nabídky napříč trhem a vyjednali podmínky u banky, kde nejsou klienty.',
          'Životní pojištění jsme napojili na skutečný zůstatek úvěru, ne na balíček od banky.',
          'Pojištění nemovitosti sjednali u nás – levněji a s vyšší pojistnou částkou než v bankovním balíčku.',
        ],
        outcome: 'Úspora 0,4 p. b. na sazbě znamená za dobu fixace zhruba 94 000 Kč, které zůstaly rodině.',
      },
      {
        key: 'rodina-vichrice', ic: 'storm',
        product: 'nemovitost',
        tab: 'Přišla vichřice',
        title: 'Orkán vytrhl okna v posledním patře a voda zatekla až do bytu',
        story: 'Škoda 340 000 Kč na oknech, podlahách a rozvodech. Byt byl po rekonstrukci za 1,4 milionu, ale pojistka pořád běžela na částku z původní smlouvy – 2,6 milionu místo reálných 5 milionů.',
        fix: [
          'Pojistnou částku jsme aktualizovali při revizi devět měsíců před vichřicí – bez toho by pojišťovna plnila zhruba polovinu.',
          'Škodu likvidovalo oddělení Allrisk, zálohu na materiál měli na účtu do deseti dnů.',
          'Provizorní zabednění oken zajistila asistenční služba ještě týž večer.',
        ],
        outcome: 'Plnění v plné výši 335 000 Kč. Bez aktualizované částky by dostali zhruba o 160 000 Kč méně.',
      },
      {
        key: 'rodina-studium', ic: 'school',
        product: 'investice',
        tab: 'Děti půjdou na vysokou',
        title: 'Za osm let Praha, podnájem a pět let studia',
        story: 'Podnájem, jídlo a doprava dnes vycházejí na 14 000 Kč měsíčně. Za pět let studia je to zhruba 840 000 Kč na dítě – a doma jsou děti dvě, s odstupem tří let.',
        fix: [
          'Peníze na studium jsme oddělili od rodinné rezervy, aby se z nich neuždibovalo na běžné výdaje.',
          'Horizont je dost dlouhý na dynamické portfolio – ke konci ho postupně překlopíme do konzervativního.',
          'Nastavili jsme pravidelnou platbu, která se z rozpočtu neztratí, ale za osm let udělá rozdíl.',
        ],
        outcome: 'Při dnešní platbě 3 500 Kč měsíčně pokryjí studium obou dětí, aniž by sahali na hypotéku nebo rezervu.',
      },
    ],
    // ---- modely pre produktové stránky (kľúč = produkt) ----
    models: {
    vozidla: {
      // TODO(design): vlastná ilustrácia pre každý profil – zatiaľ 3 existujúce SVG na 4 profily.
      img: '/cars/driver.svg',
      tagIcon: 'users',
      driver: 'Řidiči 38 let · děti v autě',
      car: 'Škoda Fabia', year: '2018', engine: '1.0 TSI · 70 kW',
      mileage: '14 000 km / rok', deductible: '5 000 Kč',
      usage: 'Hlavní auto na všechno – do práce, s dětmi k lékaři a o víkendu za rodiči. Když stojí, stojí celá domácnost.',
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
    key: 'podnikatel',
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
    intro: 'Firma vyrostla z jednoho člověka na tým se skladem, auty a šesti zaměstnanci. Má rizika velké firmy, ale nemá její rezervy – a celý provoz i rodina pořád visí na jednom člověku.',
    solved: [
      { product: 'odpovednostFirmy', need: 'nutnost', note: 'Škoda způsobená vaší činností klientovi nebo třetí straně. Kryje i následné škody, nejen tu přímou.' },
      { product: 'firma', need: 'nutnost', note: 'Budovy, zásoby a technika. Součástí je přerušení provozu, které platí režii, když nemůžete vyrábět.' },
      { product: 'flotila', need: 'nutnost', note: 'Všechna firemní auta na jedné smlouvě a jednom vyúčtování. Přidání vozu bez nové smlouvy.' },
      { product: 'prijem', need: 'doporuceno', note: 'Denní dávka a měsíční renta při pracovní neschopnosti či invaliditě. Příjem běží dál, i když vy nemůžete.' },
      { product: 'pravni', need: 'doporuceno', note: 'Právník, soudní poplatky i náklady protistrany. Spory s odběrateli, dodavateli i zaměstnanci.' },
      { product: 'investice', need: 'zvazit', note: 'Zhodnocení volných prostředků firmy. Provozní rezervu držíme zvlášť od dlouhodobých peněz.' },
    ],
    situations: [
      {
        key: 'podnikatel-nehoda', ic: 'crash',
        product: 'vozidla',
        tab: 'Stala se nehoda',
        title: 'Zaměstnanec naboural firemní dodávku plnou materiálu',
        story: 'Na výjezdu z dvora přehlédl sloup. Škoda na dodávce 143 000 Kč, poškozený materiál na zakázku za 60 000 Kč a montáž u klienta naplánovaná na další den.',
        fix: [
          'Havarijní pojištění pokrylo opravu dodávky včetně odtahu z místa.',
          'Náhradní dodávka ze služby autopůjčovny Allrisk dorazila týž den – montáž u klienta se nezrušila.',
          'Škodu jsme likvidovali interně, Martin ji nahlásil jedním telefonátem a dál se o ni nestaral.',
        ],
        outcome: 'Firma doplatila spoluúčast 5 000 Kč a nepřišla o zakázku ani o klienta.',
      },
      {
        key: 'podnikatel-sklad', ic: 'water',
        product: 'firma',
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
        product: 'odpovednostFirmy',
        tab: 'Klient chce náhradu',
        title: 'Vadná montáž způsobila škodu na majetku odběratele',
        story: 'Špatně dotažený spoj podmáčel klientovi novou podlahu v provozovně. Klient vyčíslil škodu na 410 000 Kč včetně dvou dnů zavřeného provozu a poslal předžalobní výzvu.',
        fix: [
          'Pojištění odpovědnosti krylo škodu na cizím majetku i následnou škodu z přerušení provozu klienta.',
          'Pojišťovna vedla jednání o výši škody – Martin neplatil vlastního znalce ani advokáta.',
          'Neoprávněnou část nároku pojišťovna odmítla za něj, což je součást krytí.',
        ],
        outcome: 'Uznaná škoda 355 000 Kč šla z pojištění, firma platila spoluúčast 10 000 Kč a udržela si odběratele.',
      },
      {
        key: 'podnikatel-vypadek', ic: 'hospital',
        product: 'prijem',
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
    key: 'pred-penzi',
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
    intro: 'Za dva roky odchází do důchodu. Hypotéka je splacená a děti odrostlé, ale staré pojistky pořád běží a kryjí rizika, která už dávno nehrozí – zatímco příjem brzy klesne na polovinu.',
    solved: [
      { product: 'penze', need: 'nutnost', note: 'Penzijní spoření se státním příspěvkem a výplata renty. Spočítáme, kolik měsíčně reálně přijde.' },
      { product: 'zivot', need: 'doporuceno', note: 'Výplata sjednané částky při vážné nemoci, úrazu nebo úmrtí. Rozsah rizik doladíme na váš věk.' },
      { product: 'investice', need: 'doporuceno', note: 'Investice ve výplatní fázi – portfolio, které místo růstu posílá peníze každý měsíc.' },
      { product: 'nemovitost', need: 'nutnost', note: 'Stavba domu proti požáru, vodě a živlu. Pojistnou částku nastavíme na dnešní cenu, ne na tu z původní smlouvy.' },
      { product: 'pravni', need: 'zvazit', note: 'Právník, soudní poplatky i náklady protistrany. Převody majetku, darovací smlouvy a věcná břemena.' },
      { product: 'vozidla', need: 'doporuceno', note: 'Povinné ručení i havarijní pojištění. U staršího vozu a nízkého nájezdu rozsah i cenu přizpůsobíme.' },
    ],
    situations: [
      {
        key: 'penze-nemoc', ic: 'illness',
        product: 'zivot',
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
        product: 'penze',
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
        product: 'nemovitost',
        tab: 'Zamrzla voda v domě',
        title: 'Prasklé rozvody a vytopený suterén po lednových mrazech',
        story: 'Byli u dcery přes svátky. Zamrzlo a prasklo potrubí v nevytápěné části domu, voda tekla několik dní. Škoda 380 000 Kč na rozvodech, podlaze a technice v suterénu.',
        fix: [
          'Pojistnou částku jsme při revizi zvedli na reálnou hodnotu domu – původní byla z roku 2009.',
          'Krytí zahrnuje i škody vodou z prasklého potrubí, což v původní smlouvě chybělo.',
          'Havarijní službu a vysoušeče poslala asistence ještě před jejich návratem domů.',
        ],
        outcome: 'Plnění 370 000 Kč. Ze staré smlouvy by dostal necelou třetinu.',
      },
      {
        key: 'penze-auto', ic: 'garage',
        product: 'vozidla',
        tab: 'Stará auta a nízký nájezd',
        title: 'Platil havarijku na patnáct let starý vůz',
        story: 'Golf z roku 2012 s nájezdem 8 000 km ročně. Havarijní pojištění stálo 420 Kč měsíčně, přitom obecná cena vozu klesla pod 90 000 Kč.',
        fix: [
          'Havarijku jsme zrušili – u vozu téhle hodnoty se spoluúčastí už nedává smysl.',
          'Ušetřené peníze šly do kvalitní asistence, která u staršího auta zasáhne mnohem častěji.',
          'Bonus za bezeškodní průběh jsme převedli, takže povinné ručení kleslo ještě víc.',
        ],
        outcome: 'Úspora 4 100 Kč ročně a lepší krytí přesně tam, kde ho starší vůz opravdu potřebuje.',
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
      why: 'Starší vůz s nízkou hodnotou. Havarijku už nemá smysl platit – vyplatí se spolehlivá asistence a maximální bonus.',
      perks: [
        'Levné a férové krytí podle skutečné hodnoty vozu',
        'Žádné přeplácení za připojištění, které nedává smysl',
        'Odtah a oprava na místě, kdyby vůz nenastartoval',
      ],
    },
    },
  },
]

// ---- lookupy ----
export const profileBySlug = (slug) => PROFILES.find((p) => p.slug === slug)
export const profileByKey = (key) => PROFILES.find((p) => p.key === key)

// Situácia pre dvojicu (profil, produkt) – vstup z produktovej stránky.
export const situationFor = (profileKey, productKey) =>
  profileByKey(profileKey)?.situations.find((s) => s.product === productKey)

// Všetky situácie k jednému produktu, v poradí profilov – taby na produktovej stránke.
export const situationsFor = (productKey) =>
  PROFILES.map((p) => {
    const s = p.situations.find((x) => x.product === productKey)
    return s ? { profile: p, situation: s } : null
  }).filter(Boolean)

// Modelové zadanie pre dvojicu (profil, produkt).
export const modelFor = (profileKey, productKey) =>
  profileByKey(profileKey)?.models?.[productKey]

// Vstup pre sekciu „Najděte se v jednom ze čtyř profilů" na produktovej stránke.
// Vracia iba profily, ktoré majú k produktu OBOJE – situáciu aj model – takže
// prepínač nikdy neponúkne dlaždicu, pod ktorou by nebolo čo vykresliť.
export const modelsFor = (productKey) =>
  situationsFor(productKey)
    .map((x) => ({ ...x, model: x.profile.models?.[productKey] }))
    .filter((x) => x.model)

// Genitív pre nadpis „jednom ze <…> profilů" – počet sa mení podľa produktu.
const COUNT_GEN = { 2: 'dvou', 3: 'tří', 4: 'čtyř', 5: 'pěti', 6: 'šesti', 7: 'sedmi' }
export const countGen = (n) => COUNT_GEN[n] || String(n)

// „Čtyři situace" / „Pět situací" – česky sa s číslovkou 5+ mení aj pád podstatného mena,
// preto to vracia celú frázu, nie len číslovku. Počet situácií je per profil.
const COUNT_NOM = { 1: 'Jedna', 2: 'Dvě', 3: 'Tři', 4: 'Čtyři', 5: 'Pět', 6: 'Šest', 7: 'Sedm' }
export const situationCount = (n) =>
  `${COUNT_NOM[n] || n} ${n === 1 ? 'situace' : n <= 4 ? 'situace' : 'situací'}`

// Štítky naliehavosti pre „Co je dobré mít vyřešeno"
export const NEED_LABEL = {
  nutnost: 'Nutnost',
  doporuceno: 'Doporučujeme',
  zvazit: 'Zvážit',
}
// Poradie naliehavosti – zoznam sa ním triedi, nutnosti idú navrch.
export const NEED_ORDER = ['nutnost', 'doporuceno', 'zvazit']
export const needRank = (need) => {
  const i = NEED_ORDER.indexOf(need)
  return i === -1 ? NEED_ORDER.length : i
}
