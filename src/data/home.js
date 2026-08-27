/* ============================================================
   Obsah ÚVODNEJ STRÁNKY po publikách (src/segment.js).

   Od 2026-08-11 je publikum prvou úrovňou navigácie a prepnutie záložky
   v hlavičke mení celý web pod ňou, nie len rozcestník. Tento súbor drží to,
   čo sa na úvode mení: filozofia, „Proč Allrisk", banner a časté dotazy.

   Čo sa NEMENÍ a preto tu nie je: reference, blog a kontaktný formulár - to
   sú dôkaz a obsah o firme ako celku.

   Hero sa od 2026-08-18 mení tiež (HERO nižšie): video zostáva retailu, firma
   a obec majú foto-hero. Do toho dňa tu hero nebolo, lebo bolo pre všetkých
   rovnaké - „je to značka, nie argument".

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

/* ---------- hero ----------
   VIDEO JE LEN PRE RETAIL (user, 2026-08-18). Značková slučka je kulisa bez
   tvrdenia a bez CTA - to je v poriadku pre jednotlivcov a rodiny, ktorí na
   úvod prídu bez konkrétneho zadania. Firma ani obec sa na video nepozerá:
   prišli si overiť, či to s nimi niekto vie, a chcú vetu, dôkaz a cestu ďalej.

   `null` = video (rovnaká konvencia ako pri WHY: null znamená
   „nevykresliť tento tvar", nie „doplniť neskôr"). Objekt = foto-hero.

   Tvar foto-hera je ten istý ako na /vozidla a /o-nas - jeden mechanizmus
   .photo-hero pre celý web, stránka rieši len geometriu. Podnikatelia dostali
   späť presne to hero, aké mala zrušená stránka /podnikatele (user, 2026-08-18:
   „daj taky aky sme mali"): tá istá fotka, ten istý titulok aj tá istá veta.

   `points` sú sklenené karty vedľa titulku (.hero-points). JEDEN RIADOK na
   kartu - vysvetľujúca veta pod tvrdením padla 2026-08-16 a neplatí ani tu.
   Sú to tvrdenia, nie odkazy: mieria na sekcie, ktoré úvod má, ale klikať sa
   na ne nedá, lebo karta v hero nie je navigácia.

   `cta` je dvojica - prvé tlačidlo je kotva do sekcie na tej istej stránke,
   druhé vedie na kontakt. Kotva musí existovať v tom publiku: podnikateľom
   `#spoluprace` nesie BizCare, obciam `#rozcestnik` ich trojica zámerov.

   Fotka obcí je LETECKÝ ZÁBER MESTA (2026-08-18). Vzatá z klientovho vlastného
   webu, zo stránky „Pojištění majetku měst a obcí" (allrisk.cz, wp-content
   2024/04/Pojisteni_mest_a_obci_header.jpg) - je to teda ich vlastný obrazový
   materiál k tomu istému publiku, nie náhodný stock. Prekomprimovaná na 239 kB,
   teda do rovnakého pásma ako ostatné heroy (podnikatelia 228 kB, /vozidla 250 kB).
   Pomer 1250×479 sedí na hero takmer presne, takže `cover` skoro nič neoreže.
   Prečo práve pohľad zhora: obec nie je jedna budova ani jeden úradník, je to
   celok - strechy, ulice, škola a park naraz. Portrét starostu by hovoril
   o človeku, tu ide o majetok. Mrakodrapy z /pobocky sme skúšali a nesedia:
   české obce tak nevyzerajú.
   TODO(asset): je to jediná dostupná veľkosť, na 4K displeji bude záber mäkký.
   Keby klient našiel originál vo vyššom rozlíšení, vymeniť. */
/* Text hera pre podobu `classic` (heroVariants.js) - podoba, kde má video okolo
   seba tvrdenie a cestu ďalej, a nie je teda kulisa. Rodiny inak hero text
   nemajú (HERO.rodiny je null), preto stojí zvlášť a nie v HERO: nesmie zapnúť
   foto-hero podľa publika.
   Tlačidlo sa volá presne ako sekcia, do ktorej kotví - kto klikne, musí
   spoznať, že je tam, kam mieril. */
export const HERO_VIDEO_TX = {
  // Značkové motto (user, 2026-08-19). To isté nesie h1 na /o-nas - je to motto
  // firmy, nie nadpis jednej stránky, takže sa opakovať smie.
  h: 'Pomáháme lidem',
  hb: 'plnit sny',
  p: 'Jeden poradce pro celou rodinu - od auta a bydlení po hypotéku i rezervu na horší časy.',
  cta: { to: '#rozcestnik', label: 'Co právě řešíte' },
  cta2: { to: '/kontakt', label: 'Domluvit setkání' },
  // Fotka pod modrým závojom - ten istý recept .photo-hero, aký má hero firmy
  // aj obce. Rodina na nej je to isté publikum, ktoré túto podobu úvodu vidí.
  // TODO(asset): zdieľa sa s profilom „Rodina v nejlepších letech"; keď klient
  // dodá vlastnú fotku pre úvod, mení sa tento riadok.
  img: '/profily/rodina-v-nejlepsich-letech.jpg',
  // Kým video stojí, karta sa premieta ako prezentácia (user, 2026-08-19: „dal by
  // som tam iba tie obrázky ako prezentaci a by sa iba premietali"). Sú to výrezy
  // zo slučky, nie cudzie fotky - viď public/hero/README.md. Poradie je príbeh:
  // auto → bydlení → reality → servis. Prvý je zároveň `poster` videa.
  stills: ['/hero/still-1.jpg', '/hero/still-2.jpg', '/hero/still-3.jpg', '/hero/still-4.jpg'],
}

export const HERO = {
  rodiny: null,
  podnikatele: {
    img: '/podnikatele/hero.jpg',
    h: 'Pojištění, které posouvá hranice',
    hb: 'vašeho podnikání',
    p: 'Neprodáváme produkty. Díváme se na vaše podnikání v souvislostech, hledáme rizika a zůstáváme u toho i po podpisu smlouvy.',
    cta: { to: '#spoluprace', label: 'Jak s vámi pracujeme' },
    cta2: { to: '/kontakt', label: 'Domluvit setkání' },
    points: [
      { icon: 'shieldCheck', t: 'Vlastní Centrum likvidace registrované u ČNB' },
      { icon: 'partner', t: 'Odborný garant, který zná vaši firmu' },
      { icon: 'car', t: 'Jedna platba za celý vozový park' },
    ],
  },
  mesta: {
    img: '/mesta/hero.jpg',
    // Titulok je zámerne kratší než pri podnikateľoch: „Majetek obce i
    // odpovědnost zastupitelů" sa v hero lámalo na tri riadky a tretí bol
    // jediné slovo. Čo všetko program kryje, hovorí veta pod ním.
    h: 'Celý pojistný program obce',
    hb: 'pod jednou správou',
    p: 'Od majetku a bytového fondu po odpovědnost zastupitelů. Zadání připravíme, program vysoutěžíme a zůstaneme u něj - včetně škod, které vyřídíme za obec.',
    cta: { to: '#rozcestnik', label: 'Co pro obec řešíme' },
    cta2: { to: '/kontakt', label: 'Domluvit setkání' },
    points: [
      { icon: 'checklist', t: 'Výběrové řízení připravíme i vyhodnotíme' },
      { icon: 'gavel', t: 'Krytí zastupitelů i po skončení mandátu' },
      { icon: 'shieldCheck', t: 'Škody řešíme za obec, vlastním centrem' },
    ],
  },
}

/* ZMAZANÉ 2026-08-19 (user): PHIL - jedna veta filozofie („Neprodáváme
   produkty…"), ktorá sa na úvode rozsvecovala po slovách podľa scrollu.
   Sekciu mali len jednotlivci a rodiny, firma ani obec ju nemali vôbec -
   s publikom, ktoré ju nieslo, padla celá. Je v gite. */

/* ---------- Proč Allrisk ----------
   Striedavo text a ilustrácia. Je to argument pred rozhodnutím, nie výpočet
   služieb - ten je v menu a v kolese ekosystému nad touto sekciou.

   ZMAZANÝ 2026-08-27 (user): blok `ekosystem` pre rodiny („Unikátní ekosystém
   služeb" + ilustrácia). Sekciu odteraz otvára samotné koleso ekosystému,
   takže veta s obrázkom hovorila to isté druhýkrát a hneď pod tým. */
export const WHY = {
  rodiny: [
    {
      key: 'produkty', ey: 'Vlastní produkty',
      t: 'Inkasní pojištění, které jinde nedostanete', accent: 'jinde nedostanete',
      // Znenie z podkladov (user, 2026-08-27). DVA ODSTAVCE, tak ako prišli:
      // prvý je AKO produkty staviame, druhý ČÍM prevyšujú trh. `p` preto smie
      // byť aj pole - blok ich vysadí pod seba (viď Wireframe.jsx).
      // Odstavec smie byť veta alebo `{ t, b }`, kde `b` je jeho tučný začiatok
      // (user, 2026-08-27). Tučné je vždy PODREŤAZEC `t`, nie druhé znenie -
      // zvýraznenie sa tým nemôže rozísť s vetou, ktorú zvýrazňuje. Je to ten
      // istý mechanizmus ako `accent` pri nadpise, len na odstavci.
      p: [
        { t: 'Naše produkty jsou navrženy s využitím dlouholetých zkušeností z trhu a pečlivým výběrem jednotlivých řešení. Každý produkt připravujeme s důrazem na kvalitu, kterou bychom očekávali i my sami.', b: 'Naše produkty jsou navrženy' },
        { t: 'Nabízíme vám řešení, která svým rozsahem převyšují běžné standardy na českém trhu. Naše produkty představují kombinaci toho nejlepšího, co je aktuálně dostupné na pojistném trhu.', b: 'Nabízíme vám řešení' },
      ],
      cta: 'Naše produkty', img: ILL.products, ic: 'license',
    },
    {
      key: 'likvidace', ey: 'Vlastní likvidace',
      // Znenie z brožúry (user, 2026-08-27): nadpis je plný názov útvaru
      // a text stavia našu plnú asistenciu proti trhovému štandardu.
      t: 'Centrum likvidace pojistných událostí Allrisk', accent: 'pojistných událostí Allrisk',
      p: 'Zatímco standardem na trhu je základní asistence ze strany makléře, Allrisk klientům poskytuje plnou asistenci prostřednictvím vlastního Centra likvidace pojistných událostí. Právě tato služba je jednou z našich klíčových konkurenčních výhod a důvodem, proč mají naši klienti jistotu, že v krizových situacích nezůstanou sami.',
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
   LEN PRE RETAIL (user, 2026-08-18). Sekcia zostáva jednotlivcom a rodinám,
   firma ani obec ju už nemá - `null` znamená „nevykresliť", rovnako ako pri
   HERO.

   Prečo to sedí. Archetyp je pomôcka pre toho, kto sa v ponuke nevyzná a hľadá
   niekoho, kto je na tom podobne: singl, rodina, samoživiteľka, před penzí.
   Firma svoju veľkostnú kategóriu pozná a nepotrebuje sa v nej „nájsť" - a obec
   už vôbec, tam bol archetyp len iný názov pre počet obyvateľov. Podnikateľom
   navyše to isté miesto obsluhuje systém péče, ktorý je konkrétnejší než tri
   typové firmy.

   Titulok si stránka skladá sama, lebo v ňom je počet profilov (data/profiles.js).
   `pre` je začiatok vety pred zvýraznenou časťou.

   ZAPARKOVANÉ, NIE ZMAZANÉ: tri firemné profily (podnikatel, zivnostnik,
   vyrobni) aj tri obecné zostávajú v data/profiles.js. Firemné majú vlastné
   stránky /profil/:slug s modelovými situáciami a maticou „co mít vyřešeno" -
   je to hotový obsah, ktorý dnes nemá na úvode odkaz. Keby sa mal zmazať aj on,
   musí to byť samostatné rozhodnutie. */
export const PROFILES_HEAD = {
  rodiny: {
    ey: 'Klientské profily',
    pre: 'Najděte se v',
    lead: 'Vyberte typ klienta, který je vám nejblíž. Ukážeme, co je v jeho situaci dobré mít vyřešeno a co se stane, když to chybí.',
  },
  podnikatele: null,
  mesta: null,
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
