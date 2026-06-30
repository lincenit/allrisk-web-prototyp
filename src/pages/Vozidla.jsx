import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import './vozidla.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import {
  IconShield, IconCarCrash, IconWindow, IconTool, IconRoute,
  IconCircleCheck, IconArrowRight,
  IconChevronRight, IconCar, IconUser, IconUsers,
  IconBuildingCommunity, IconPaw, IconLock, IconBulb, IconHeadset,
  IconMotorbike, IconCaravan, IconTractor,
} from '@tabler/icons-react'

// kategórie vozidiel, ktoré vieme poistiť
const VEHICLE_CATS = [
  { code: 'L', icon: IconMotorbike, desc: 'Motorky, tříkolky' },
  { code: 'M', icon: IconCar, desc: 'Osobní vozidla' },
  { code: 'O', icon: IconCaravan, desc: 'Přípojná vozidla' },
  { code: 'R', icon: IconTractor, desc: 'Ostatní vozidla' },
]


// 5 produktov = záložky (ako přepínátko u Directu) -----------------------
const TABS = [
  {
    key: 'povinne',
    icon: IconShield,
    label: 'Povinné ručení',
    tag: 'Ze zákona povinné',
    lead: 'Pojištění odpovědnosti z provozu vozidla, které musí ze zákona mít každý provozovatel vozidla. V případě nehody, kterou zaviníte, se postará o úhradu způsobených škod na zdraví a majetku třetích osob.',
    covers: ['Škody na zdraví třetích osob', 'Škody na cizím majetku', 'Asistenční služby v základu', 'Zelená karta pro cesty do zahraničí'],
    note: 'Limit krytí volíte vy – od zákonných 50 mil. Kč přes 100 mil. až po 1 miliardu Kč. Povinné ručení ale nekryje škody na vašem vlastním voze ani jeho odcizení – na to slouží havarijní pojištění.',
  },
  {
    key: 'havarijni',
    icon: IconCarCrash,
    label: 'Havarijní pojištění',
    tag: 'Chrání vaše auto',
    lead: 'Ochranný štít pro vaše vozidlo pro případ nehody, poškození i odcizení. Pokryje veškeré náklady na váš vůz – opravy, nové díly, odtah i zapůjčení náhradního vozu po dobu opravy v servisu.',
    covers: ['Poškození vlastního vozu při nehodě', 'Odcizení vozidla', 'Vandalismus a živelní události', 'Náhradní vůz po dobu opravy'],
    note: 'Při sjednání si pohlídejte územní platnost, výši pojistné částky a spoluúčasti – některé pojišťovny zlevňují produkt právě omezováním těchto parametrů.',
  },
  {
    key: 'skla',
    icon: IconWindow,
    label: 'Pojištění skel',
    tag: 'Připojištění',
    lead: 'Oprava nebo výměna čelního i ostatních skel bez velkých výdajů. Drobné prasklinky vyřešíme rychle a často bez vlivu na vaše ostatní pojištění.',
    covers: ['Čelní sklo', 'Boční a zadní skla', 'Oprava často bez spoluúčasti'],
    note: 'Drobná prasklina = rychlá oprava na počkání, často bez vlivu na bonus.',
  },
  {
    key: 'asistence',
    icon: IconTool,
    label: 'Technické asistence',
    tag: 'Připojištění',
    lead: 'Pomoc na cestě 24/7, 365 dní v roce – v ČR i v zahraničí. Odtah do servisu, oprava na místě, náhradní vozidlo i ubytování, když se vůz porouchá daleko od domova.',
    covers: ['Odtah a vyproštění vozidla', 'Oprava na místě – baterie, palivo, odemčení', 'Náhradní vozidlo nebo ubytování', 'Non-stop dispečink a právní pomoc'],
    note: 'Limit asistence můžete zvýšit nálepkou Allrisk – nalepíte ji na vůz, pošlete foto se SPZ a do 5 pracovních dnů ji aktivujeme zdarma.',
  },
  {
    key: 'cesty',
    icon: IconRoute,
    label: 'Ochrana na cestách',
    tag: 'Připojištění',
    lead: 'Až 80 % vozidel nemá dostatečné limity technické asistence. Ochrana na cestách je zvýší přesně na dobu, kdy je potřebujete – na výlet i dovolenou autem, doma i v zahraničí.',
    covers: ['Vyšší limity asistence – 10 000 Kč v ČR, 40 000 Kč v zahraničí', 'Ubytování i doprava posádky na cestě', 'Delší uskladnění a odtah vozidla', 'Asistence při odcizení vozu'],
    note: 'Pro klienty s autopojištěním Allrisk aktivujete na 20 dní za 199 Kč přímo v portálu mujallrisk.cz – klidně i dopředu na plánovanou cestu.',
  },
]

// ---- ceník modulů (pro výpočet doporučené skladby u modelů) ----
const MODULES = [
  { key: 'povinne', icon: IconShield, name: 'Povinné ručení', desc: 'Škody způsobené provozem jiným', price: 0, base: true },
  { key: 'havarie', icon: IconCarCrash, name: 'Havarijní pojištění', desc: 'Havárie, vandalismus, živel', price: 420 },
  { key: 'zver', icon: IconPaw, name: 'Střet se zvěří', desc: 'Srážka se zvířetem na silnici', price: 90 },
  { key: 'odcizeni', icon: IconLock, name: 'Odcizení vozidla', desc: 'Krádež celého auta', price: 140 },
  { key: 'skla', icon: IconWindow, name: 'Pojištění skel', desc: 'Čelní i boční skla', price: 110 },
  { key: 'asistence', icon: IconTool, name: 'Technické asistence', desc: 'Odtah, oprava, dispečink 24/7', price: 60 },
  { key: 'cesty', icon: IconRoute, name: 'Ochrana na cestách', desc: 'Úraz posádky, zavazadla', price: 80 },
  { key: 'nahradni', icon: IconCar, name: 'Náhradní vozidlo', desc: 'Auto po dobu opravy', price: 70 },
]

// 3 modely – klient se v jednom z nich pozná. Preklik mezi nimi, žádný vyklikávač.
const PROFILES = [
  {
    key: 'mlady', tagIcon: IconUser, tag: 'Mladý řidič',
    img: '/cars/driver.svg',
    driver: 'Řidič 26 let · 3 roky za volantem',
    car: 'Škoda Fabia', year: '2018', engine: '1.0 TSI · 70 kW', mileage: '12 000 km / rok', deductible: '5 000 Kč',
    usage: 'Každodenní dojíždění do města a do práce, občas víkend za rodinou. První vlastní auto, na kterém záleží.',
    base: 480, preset: ['skla', 'asistence'],
    why: 'Hbité auto do města. Stačí pevný základ, skla a asistence – klid při každodenním dojíždění bez přeplácení.',
    perks: ['Sjednání kompletně online za pár minut', 'Nižší cena díky krátkému nájezdu', 'Asistence 24/7 i pro začínající řidiče'],
  },
  {
    key: 'rodina', tagIcon: IconUsers, tag: 'Rodina s dětmi',
    img: '/cars/trip.svg',
    driver: 'Dva řidiči 35–40 let · děti v autě',
    car: 'Škoda Octavia Combi', year: '2021', engine: '2.0 TDI · 110 kW', mileage: '22 000 km / rok', deductible: '5 000 Kč',
    usage: 'Vožení dětí do školy a kroužků, víkendové výlety a každoroční dovolená autem napříč Evropou.',
    base: 560, preset: ['havarie', 'zver', 'asistence', 'cesty'],
    why: 'Novější rodinné auto na výlety i dovolenou. Plné krytí včetně střetu se zvěří a ochrany celé posádky na cestách.',
    perks: ['Plné havarijní krytí novějšího vozu', 'Ochrana posádky i zavazadel na dovolené', 'Náhradní vůz, ať rodina zůstane mobilní'],
  },
  {
    key: 'ojete', tagIcon: IconBuildingCommunity, tag: 'Ojeté auto',
    img: '/cars/bycar.svg',
    driver: 'Druhý vůz do domácnosti · nízký nájezd',
    car: 'Volkswagen Golf', year: '2012', engine: '1.6 TDI · 77 kW', mileage: '8 000 km / rok', deductible: '10 000 Kč',
    usage: 'Druhý vůz do domácnosti na nákupy a kratší cesty. Nižší hodnota, ale musí spolehlivě sloužit.',
    base: 320, preset: ['asistence'],
    why: 'Druhý vůz s nižší hodnotou. Havarijku není nutné řešit – vyplatí se hlavně spolehlivá asistence pro klid na cestě.',
    perks: ['Levné a férové krytí podle hodnoty vozu', 'Žádné přeplácení za zbytečné připojištění', 'Odtah a oprava na místě, kdyby vůz stávkoval'],
  },
]

const fmt = (n) => n.toLocaleString('cs-CZ')
const NOW_YEAR = new Date().getFullYear()
const carAge = (year) => {
  const a = NOW_YEAR - Number(year)
  return a === 1 ? '1 rok' : a >= 2 && a <= 4 ? `${a} roky` : `${a} let`
}

export default function Vozidla() {
  const [tab, setTab] = useState('povinne')
  const active = TABS.find((t) => t.key === tab)

  // --- modelové situace: 3 modely na preklik (žádný vyklikávač) ---
  const [profKey, setProfKey] = useState('rodina')
  const prof = PROFILES.find((p) => p.key === profKey)
  const presetMods = prof.preset.map((k) => MODULES.find((m) => m.key === k)).filter(Boolean)
  const total = prof.base + presetMods.reduce((s, m) => s + m.price, 0)

  // header priehľadný nad foto-hero, plný po zoskrolovaní pod hero (spoločné s ostatnými foto-hero stránkami)
  useHeroHeader()

  return (
    <div className="site">
      {/* ============ 1 · ÚVODNÍ SEKCE – kompaktní záhlaví kategorie ============ */}
      <section className="hero vz-hero">
        {/* foto vozu pod hero + modrý overlay (foto vloží klient do public/vozidla/hero.jpg) */}
        <div className="vz-hero-bg" style={{ backgroundImage: `url(${asset('/vozidla/hero.jpg')})` }} aria-hidden="true" />
        <div className="wrap vz-crumb-wrap">
          <nav className="vz-crumb">
            <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} />
            <span>Pojištění</span><IconChevronRight size={14} stroke={2} />
            <b>Pojištění vozidel</b>
          </nav>
        </div>
        <div className="wrap hero-in vz-hero-in">
          <div className="hero-tx">
            <h1>Pojištění <b>vozidel</b></h1>
            <p>Povinné ručení, havarijní pojištění i asistence – poskládané na míru tomu, jak a kde jezdíte.</p>
            <div className="hero-cta">
              <a href="#vz-produkty" className="btn fill">Prohlédnout nabídku <IconArrowRight size={18} stroke={2.2} /></a>
              <a href="#vz-modely" className="btn">Modelové situace</a>
            </div>
          </div>
          <ul className="vz-hero-points">
            <li>
              <span className="vz-hp-ic"><IconCar size={28} stroke={1.5} /></span>
              <span className="vz-hp-tx"><b>Náhradní vůz až na 20 dní zdarma</b><small>Abyste zůstali mobilní i během opravy vozu.</small></span>
            </li>
            <li>
              <span className="vz-hp-ic"><IconHeadset size={28} stroke={1.5} /></span>
              <span className="vz-hp-tx"><b>Oddělení likvidací 24/7, 365 dní</b><small>Škodu řešíme interně, kdykoliv ji nahlásíte.</small></span>
            </li>
            <li>
              <span className="vz-hp-ic"><IconRoute size={28} stroke={1.5} /></span>
              <span className="vz-hp-tx"><b>Služby autopůjčovny</b><small>Vše kolem vozu pod jednou střechou.</small></span>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ 2 · INKASNÍ SYSTÉM (2× 50/50 text + foto), bez veľkého nadpisu ============ */}
      <section className="sec wrap vz-system">
        {/* riadok 1 – Systém + kategórie vozidel vľavo, foto vpravo */}
        <div className="vz-feat">
          <div className="vz-feat-tx">
            <div className="vz-feat-block">
              <h3>Systém</h3>
              <p>V roce 2005 jsme na český trh přinesli jedinečný systém inkasního pojištění Allrisk. Díky globálnímu nákupu velkého množství produktů dosáhneme nejen optimální ceny, ale od každé pojišťovny nebo asistenční společnosti kupujeme jen ty produkty, které jsou prověřené trhem. Tyto produkty pak dle preferencí klienta poskládáme do balíčků, které svým obsahem zaručeně poskytují nejlepší poměr výkonu a ceny na trhu. Na pozadí celého projektu stojí obří IT zázemí, které vyvíjí a neustále zdokonaluje software Allrisk.</p>
            </div>
            <div className="vz-feat-block">
              <h3>Kategorie vozidel</h3>
              <ul className="vz-cats-mini">
                {VEHICLE_CATS.map((c) => {
                  const C = c.icon
                  return (
                    <li key={c.code}>
                      <span className="vz-cat-ic"><C size={20} stroke={1.6} /></span>
                      <span className="vz-cm-tx"><b>Kategorie {c.code}</b><small>{c.desc}</small></span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="vz-feat-img"><img src={asset('/vozidla/system.jpg')} alt="Inkasní systém Allrisk" loading="lazy" /></div>
        </div>

        {/* riadok 2 – foto vľavo, texty vpravo */}
        <div className="vz-feat rev">
          <div className="vz-feat-img"><img src={asset('/vozidla/vyhody.jpg')} alt="Autopojištění Allrisk" loading="lazy" /></div>
          <div className="vz-feat-tx">
            <div className="vz-feat-block">
              <h3>Obsah balíčku ZDARMA</h3>
              <p>Nad rámec základních produktů autopojištění jsou naší nejsilnější ochranou vozidel asistenční služby ZDARMA. <a href="#vz-produkty">Více informací</a></p>
            </div>
            <div className="vz-feat-block">
              <h3>Sjednocené vyúčtování</h3>
              <p>Ať už máte 1 nebo 100 vozidel, máte vždy jedno jednoduché vyúčtování, které se vám vždy synchronizuje s kalendářním rokem. Sami klienti si určují frekvenci placení od měsíčních po roční platbu bez procentních poplatků za područní platby.</p>
            </div>
            <div className="vz-feat-block">
              <h3>Klientský portál</h3>
              <p>Klientský portál mujallrisk.cz poskytuje našim klientům ucelený přehled na všechny produkty a smlouvy inkasního pojištění Allrisk. Přihlášení a veškeré změny probíhají prostřednictvím SMS hesla, které je vázané na klienty zaregistrované telefonní číslo. Důležitou součástí klientského portálu je přehled o pojistných událostech, které řešíte přes oddělení likvidace Allrisk.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4 · ZÁLOŽKY PRODUKTŮ ============ */}
      <section id="vz-produkty" className="sec wrap">
        <div className="sec-h">
          <span className="ey">Co lze sjednat</span>
          <h2>Vše k autu na <b>jedné stránce</b></h2>
          <p>Přepínejte mezi produkty a poskládejte si krytí přesně na míru – od povinného ručení po ochranu na cestách.</p>
        </div>

        {/* tab bar – vodorovně scrollovatelný na mobile */}
        <div className="vz-tabs" role="tablist">
          {TABS.map((t) => {
            const C = t.icon
            return (
              <button key={t.key} role="tab" aria-selected={tab === t.key}
                className={`vz-tab ${tab === t.key ? 'on' : ''}`} onClick={() => setTab(t.key)}>
                <C size={18} stroke={1.8} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* panel aktívneho produktu – rovnaká kostra pre všetky */}
        <div className="vz-panel" role="tabpanel">
          <div className="vz-panel-tx">
            <span className="vz-pill">{active.tag}</span>
            <h3>{active.label}</h3>
            <p>{active.lead}</p>
            <div className="vz-cov-lbl">Co kryje</div>
            <ul className="vz-cov">
              {active.covers.map((c) => (
                <li key={c}><IconCircleCheck size={20} stroke={1.8} /> <span>{c}</span></li>
              ))}
            </ul>
          </div>

          <aside className="vz-aside">
            <span className="vz-aside-ic">{(() => { const C = active.icon; return <C size={38} stroke={1.5} /> })()}</span>
            <div className="vz-aside-t">Dobré vědět</div>
            <p>{active.note}</p>
            <div className="vz-aside-div" />
            <div className="vz-aside-row"><IconCircleCheck size={18} stroke={1.8} /> Sjednání online za pár minut</div>
            <div className="vz-aside-row"><IconCircleCheck size={18} stroke={1.8} /> Vlastní likvidace škod</div>
            <div className="vz-aside-row"><IconCircleCheck size={18} stroke={1.8} /> Poradce nablízku po celé ČR</div>
          </aside>
        </div>
      </section>

      {/* ============ 3 · MODELOVÉ SITUACE (3 modely na preklik) ============ */}
      <section id="vz-modely" className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="sec-h">
          <span className="ey">Modelové situace</span>
          <h2>Najděte se v <b>jednom ze tří řidičů</b></h2>
          <p>Tři typické situace a pojištění, které k nim sedí. Přepínejte mezi nimi a podívejte se, co dává smysl a kolik to zhruba stojí.</p>
        </div>

        {/* prepínač 3 modelov – fotka konkrétneho šoféra/auta */}
        <div className="vz-models" role="tablist">
          {PROFILES.map((p) => {
            const C = p.tagIcon
            return (
              <button key={p.key} role="tab" aria-selected={profKey === p.key}
                className={`vz-model-tab ${profKey === p.key ? 'on' : ''}`} onClick={() => setProfKey(p.key)}>
                <span className="vz-model-photo"><img src={asset(p.img)} alt={`${p.tag} – ${p.car}`} loading="lazy" /></span>
                <span className="vz-model-meta">
                  <span className="vz-model-ic"><C size={18} stroke={1.7} /></span>
                  <span className="vz-model-tx"><b>{p.tag}</b><small>{p.car}, {p.year}</small></span>
                </span>
              </button>
            )
          })}
        </div>

        {/* detail vybraného modelu – iba výpis, bez obrázku */}
        <div className="vz-model-card">
          <div className="vz-model-head">
            <div>
              <h3>{prof.car} <span>{prof.year}</span></h3>
              <p className="vz-model-spec">{prof.driver}</p>
            </div>
            <span className="vz-model-engine">{prof.engine}</span>
          </div>

          <p className="vz-model-usage">{prof.usage}</p>

          <div className="vz-params">
            <div className="vz-param"><small>Stáří vozu</small><b>{carAge(prof.year)}</b></div>
            <div className="vz-param"><small>Roční nájezd</small><b>{prof.mileage}</b></div>
            <div className="vz-param"><small>Spoluúčast</small><b>{prof.deductible}</b></div>
          </div>

          <div className="vz-model-cols">
            <div className="vz-model-comp">
              <div className="vz-cov-lbl">Doporučené krytí</div>
              <ul className="vz-comp-list">
                <li className="base">
                  <span className="nm">Povinné ručení<small>Škody způsobené provozem jiným</small></span>
                  <span className="pr">{fmt(prof.base)} Kč</span>
                </li>
                {presetMods.map((m) => (
                  <li key={m.key}>
                    <span className="nm">{m.name}<small>{m.desc}</small></span>
                    <span className="pr">+{fmt(m.price)} Kč</span>
                  </li>
                ))}
              </ul>
              <div className="vz-comp-total">
                <span>Orientačně celkem</span>
                <span className="big" key={total}>{fmt(total)} Kč<small>/měs</small></span>
              </div>
            </div>

            <div className="vz-model-perks">
              <div className="vz-cov-lbl">Proč to sedí</div>
              <ul className="vz-perks">
                {prof.perks.map((pk) => (
                  <li key={pk}><IconCircleCheck size={18} stroke={1.8} /> <span>{pk}</span></li>
                ))}
              </ul>
              <div className="vz-model-why"><IconBulb size={18} stroke={1.7} /><span>{prof.why}</span></div>
            </div>
          </div>
        </div>

        {/* overenie na vlastnú situáciu → dotazník */}
        <div className="vz-verify">
          <div className="vz-verify-tx">
            <h3>Chcete si to ověřit přesně na vaši situaci?</h3>
            <p>Projděte si krátký dotazník a my vám ukážeme, co přesně potřebujete – bez zbytečného přeplácení i bez děr v krytí.</p>
          </div>
          <Link to="/test" className="btn fill">Spustit kontrolu pojištění <IconArrowRight size={18} stroke={2.2} /></Link>
        </div>
      </section>


      {/* ============ 5 · KONTAKT (spoločný banner) ============ */}
      <ContactBand />

      {/* ============ FOOTER (spoločný) ============ */}
      <SiteFooter />
    </div>
  )
}
