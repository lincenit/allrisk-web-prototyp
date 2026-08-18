/* ============================================================
   Obsah ÚVODNEJ STRÁNKY po publikách (src/segment.js).

   Od 2026-08-11 je publikum prvou úrovňou navigácie a prepnutie záložky
   v hlavičke mení celý web pod ňou, nie len rozcestník. Tento súbor drží to,
   čo sa na úvode mení: filozofia, „Proč Allrisk", banner a časté dotazy.

   Čo sa NEMENÍ a preto tu nie je: hero video (je to značková slučka, nie
   argument pre publikum), reference, blog a kontaktný formulár.

   Podnikatelia tu `why` nemajú a mať nebudú: ich argumentom je systém péče
   zo zrušenej stránky /podnikatele (data/care.js PRINCIPLES a STEPS), ktorý
   je oveľa konkrétnejší než tri obecné tvrdenia o firme.

   Ikony sú KĽÚČE, komponenty k nim mapuje stránka - dáta zostávajú bez Reactu.
   Nadpisy nesú `accent`: časť, ktorá sa vysadí modro. Česky sa nedá odvodiť
   pravidlom, ktorá to má byť („ekosystém služeb" vs „vysoutěžíme za vás").
   ============================================================ */

// TODO(asset): města a obce zatiaľ recyklujú tri ilustrácie z verzie pre
// rodiny. Významovo sedí len „likvidace"; zvyšné dve sú zástupné, kým klient
// nevyexportuje vlastnú trojicu z Tabler.io.
const ILL = {
  ecosystem: '/illus/tabler/ecosystem.png',
  products: '/illus/tabler/products.png',
  claims: '/illus/tabler/claims.png',
}

/* ---------- filozofia ----------
   Jedna veta, ktorá sa pri scrollovaní rozsvecuje po slovách. `accent` sú
   slová vysadené modro - porovnávajú sa presne tak, ako vyjdú zo split(' '),
   teda vrátane čiarky na konci.

   LEN pre jednotlivcov a rodiny (user, 2026-08-11). Firma ani obec sa
   nerozhodujú podľa vety o životných situáciách - tam hovorí systém péče,
   respektíve výberové řízení. Ostatné publiká sekciu nemajú vôbec, nedostanú
   jej variantu: `null` znamená „nevykresliť", nie „doplniť neskôr". */
export const PHIL = {
  rodiny: {
    text: 'Neprodáváme produkty. Jsme partner, který poradí, postará se a stojí při vás v každé životní situaci.',
    accent: ['partner,', 'poradí,', 'postará', 'stojí', 'vás'],
  },
  podnikatele: null,
  mesta: null,
}

/* ---------- Proč Allrisk ----------
   Striedavo text a ilustrácia. Tri bloky, nie viac: je to argument pred
   rozhodnutím, nie výpočet služieb - ten je v menu a v ekosystéme. */
export const WHY = {
  rodiny: [
    {
      key: 'ekosystem', ey: 'Vše pod jednou střechou',
      t: 'Unikátní ekosystém služeb', accent: 'ekosystém služeb',
      p: 'Pojištění, reality, finance i energie pod jednou střechou - propojené tak, ať spolu dávají smysl a nikde nevznikají díry.',
      cta: 'Prozkoumat ekosystém', img: ILL.ecosystem, ic: 'globe',
    },
    {
      key: 'produkty', ey: 'Vlastní produkty',
      t: 'Inkasní pojištění, které jinde nedostanete', accent: 'jinde nedostanete',
      p: 'Vyvíjíme vlastní pojistné produkty - řešení šitá na míru situacím, na které běžné pojišťovny nemyslí.',
      cta: 'Naše produkty', img: ILL.products, ic: 'license',
    },
    {
      key: 'likvidace', ey: 'Vlastní likvidace',
      t: 'Škodu vyřešíme za vás', accent: 'vyřešíme za vás',
      p: 'Žádné přehazování mezi pojišťovnami. Škodu likvidujeme interně - jeden kontakt, rychleji a férově.',
      cta: 'Jak to funguje', img: ILL.claims, ic: 'shieldCheck',
    },
  ],
  // Podnikateľom tu nič nepatrí - viď hlavička súboru.
  podnikatele: null,
  mesta: [
    {
      key: 'soutez', ey: 'Výběrové řízení',
      t: 'Pojistný program obce vysoutěžíme za vás', accent: 'vysoutěžíme za vás',
      p: 'Připravíme zadání, oslovíme pojistitele a nabídky porovnáme podle rozsahu krytí, ne jen podle ceny. Výsledek dostanete v podobě, kterou unese jednání zastupitelstva.',
      cta: 'Jak řízení probíhá', img: ILL.products, ic: 'checklist',
    },
    {
      key: 'zastupitele', ey: 'Zastupitelé',
      t: 'Odpovědnost za výkon funkce', accent: 'výkon funkce',
      p: 'Starosta i radní odpovídají za svá rozhodnutí. Pojištění kryje škodu i náklady na obhajobu, když přijde kontrola, audit nebo žaloba - a to i roky po skončení mandátu.',
      cta: 'Co je kryté', img: ILL.ecosystem, ic: 'gavel',
    },
    {
      key: 'likvidace', ey: 'Vlastní likvidace',
      t: 'Škodu na obecním majetku vyřešíme za vás', accent: 'vyřešíme za vás',
      p: 'Strhaná střecha školy nebo vytopená tělocvična. Škodu likvidujeme interně, takže obec na to nepotřebuje vlastního člověka ani externího poradce.',
      cta: 'Jak to funguje', img: ILL.claims, ic: 'shieldCheck',
    },
  ],
}

/* ---------- banner ----------
   Nadpis je len háčik, celé tvrdenie ide do textu. `saving` je priemerná
   úspora, ktorú banner vysadí tučne uprostred vety.
   TODO(obchod): doplniť reálne čísla z dát Allrisku - zatiaľ placeholdery. */
export const BANNER = {
  rodiny: {
    h: 'Věděli jste, že…?',
    claim: 'Pravidelnou revizí smluv ušetříte v průměru XY 000 Kč ročně.',
    p: 'Projdeme je s vámi a ukážeme, kde platíte zbytečně a kde chybí krytí. Zdarma a bez závazku.',
    cta: 'Jak revize probíhá',
    tema: 'Revize smluv',
  },
  podnikatele: {
    h: 'Věděli jste, že…?',
    claim: 'Většina firem má v pojistce limity, které dnešní hodnotě majetku už neodpovídají.',
    p: 'Prověříme stávající program a ukážeme, kde by plnění nestačilo. Zdarma a bez závazku, i když nakonec zůstanete u svého pojistitele.',
    cta: 'Jak revize probíhá',
    tema: 'Revize pojistného programu firmy',
  },
  mesta: {
    h: 'Věděli jste, že…?',
    claim: 'Obce běžně pojišťují majetek na hodnoty staré deset i více let.',
    p: 'Projdeme pojistný program obce a spočítáme, co by při větší škodě zůstalo na rozpočtu. Zdarma a bez závazku.',
    cta: 'Jak revize probíhá',
    tema: 'Revize pojistného programu obce',
  },
}

/* ---------- klientské profily ----------
   Hlavička sekcie. Titulok si stránka skladá sama, lebo v ňom je počet
   profilov a ten sa mení podľa publika (data/profiles.js).
   Města a obce sekciu nemajú: obec nie je archetyp človeka a tri vymyslené
   „profily obce" by boli len iný názov pre veľkostnú kategóriu. */
// `pre` je začiatok vety pred zvýraznenou časťou. Nie je to len iné slovo:
// „Najděte se v jednom ze tří profilů firem" je krkolomné, firmu hľadá človek,
// nie seba - preto sa mení sloveso, nie podstatné meno na konci.
export const PROFILES_HEAD = {
  rodiny: {
    ey: 'Klientské profily',
    pre: 'Najděte se v',
    lead: 'Vyberte typ klienta, který je vám nejblíž. Ukážeme, co je v jeho situaci dobré mít vyřešeno a co se stane, když to chybí.',
  },
  podnikatele: {
    ey: 'Firemní profily',
    pre: 'Najděte svou firmu v',
    lead: 'Vyberte typ firmy, který je vaší nejblíž. Ukážeme, co je v její situaci dobré mít vyřešeno a co se stane, když to chybí.',
  },
  // Obce od 2026-08-12 sekciu majú (user), ale ich dlaždice nikam nevedú -
  // popis preto nesľubuje „ukážeme, co je dobré mít vyřešeno" ako u ostatných
  // dvoch publík, len pomenuje, čím sa obec od obce líši.
  mesta: {
    ey: 'Profily obcí',
    pre: 'Najděte svou obec v',
    lead: 'Jinak vypadá pojistný program vesnice s hasičárnou a jinak města se školami a bytovým fondem. Vyberte, co je vám nejblíž - podle toho se liší rozsah krytí i cesta k němu.',
  },
}

/* ---------- časté dotazy ----------
   Päť otázok na publikum. Nie sú to varianty tých istých otázok inými slovy -
   obec sa nepýta, jestli je poradenství zdarma, ale jestli to projde
   kontrolou. */
export const FAQ = {
  rodiny: [
    ['Kolik mě poradenství stojí?', 'Nic. Poradce vám sjedná pojištění i finance zdarma - naši práci platí pojišťovny a partneři, ne vy. Vy platíte jen samotnou smlouvu, kterou si vyberete.'],
    ['Jsem vázaný na jednu pojišťovnu?', 'Ne. Spolupracujeme s desítkami pojišťoven a partnerů, takže porovnáme nabídky napříč trhem a vybereme tu, která vám sedne nejlépe - cenou i krytím.'],
    ['Jak probíhá řešení škody?', 'Škodu likvidujeme interně, vlastním týmem. Stačí jeden kontakt - nepřehazujeme vás mezi pojišťovnami a celý proces hlídáme za vás, rychleji a férově.'],
    ['Můžu mít poradce nablízku?', 'Ano. Máme širokou síť poboček po celé ČR, takže vždy najdete poradce ve svém okolí. Schůzku zvládneme osobně i online - jak vám to vyhovuje.'],
    ['Co když už pojištění mám?', 'Rádi vám ho zdarma zrevidujeme. Projdeme stávající smlouvy, ukážeme, kde platíte zbytečně moc nebo kde máte díry v krytí, a navrhneme řešení - bez závazku.'],
  ],
  podnikatele: [
    ['Kolik nás spolupráce stojí?', 'Nic navíc. Naši práci platí pojistitelé z provize, kterou by jinak dostal jejich vlastní obchodník. Firma platí pojistné, ne poradenství.'],
    ['Musíme kvůli tomu měnit pojišťovnu?', 'Ne. Nejdřív prověříme, co máte. Když je stávající program v pořádku, řekneme to - a převezmeme jeho správu. Výběrové řízení dává smysl jen tam, kde přinese lepší krytí nebo cenu.'],
    ['Co znamená, že nás zastupujete?', 'Na základě plné moci jednáme s pojistiteli za vás - od poptávky přes sjednání až po škody. Nemusíte volat na infolinku ani dohledávat, komu jste co poslali.'],
    ['Jak to funguje při škodě?', 'Máme vlastní Centrum likvidace registrované u ČNB. Nahlásíte škodu nám, my ji oznámíme pojistiteli, hlídáme lhůty a kontrolujeme výši plnění. Když je stanovisko špatně, podáme odvolání.'],
    ['Kdo se o nás bude starat dlouhodobě?', 'Podle rozsahu služeb dostanete odborného garanta - jednoho člověka, který zná vaši firmu, aktualizuje smlouvy podle jejího vývoje a před výročím ověří, jestli je program pořád nejlepší volbou.'],
  ],
  mesta: [
    ['Projde spolupráce s makléřem kontrolou?', 'Ano. Obec za naše služby neplatí, odměnu hradí vybraný pojistitel z pojistného, takže nejde o veřejnou zakázku na poradenství. Celý průběh výběru dokumentujeme, aby byl doložitelný.'],
    ['Jak vybíráte pojistitele?', 'Připravíme zadání podle skutečného majetku obce a oslovíme pojistitele na trhu. Nabídky porovnáme podle rozsahu krytí, výluk a spoluúčastí, ne jen podle ceny - a předložíme je s jasným doporučením.'],
    ['Za co ručí zastupitelé osobně?', 'Za škodu způsobenou při výkonu funkce, typicky nehospodárným rozhodnutím. Pojištění odpovědnosti kryje jak samotnou škodu, tak náklady na právní obhajobu, a to i po skončení mandátu.'],
    ['Umíte pojistit i bytový fond obce?', 'Ano. Bytové domy jsou samostatná část programu - živel, odpovědnost vlastníka i škody způsobené nájemníky. U nájmů nabízíme i službu Nájem bez rizika.'],
    ['Kdo řeší škodu, když se něco stane?', 'My. Máme vlastní Centrum likvidace, takže obec nepotřebuje mít člověka, který bude hlídat lhůty a dohadovat se s pojišťovnou o výši plnění. Stačí nám škodu nahlásit.'],
  ],
}

// Bezpečné čítanie - kľúč publika môže prísť z localStorage z minulej
// návštevy a úvod by potom padol na `.text` z undefined.
export const homeFor = (map, seg) => (seg in map ? map[seg] : map.rodiny)
