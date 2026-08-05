import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import './vehicles.css'
import './profile.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import TabBar from '../components/TabBar.jsx'
import { DebugPanel, DebugGroup, useDebugOption } from '../components/DebugPanel.jsx'
import { TAB_VARIANTS, TAB_VARIANT_DEFAULT } from '../tabVariants.js'
import { VEHICLE_CATS, PRODUCTS } from '../data/vehicles.js'
// Modelové situácie ťaháme z klientských profilov – ten istý archetyp, ktorý má
// vlastnú stránku /profil/:slug. Situácia „stala se nehoda" je doslova tá istá entita.
import { situationsFor, countGen } from '../data/profiles.js'
import { SituationPanel, ProfileTabs } from '../components/ProfileParts.jsx'
import { SecHead } from '../components/PageParts.jsx'
import {
  IconShield, IconCarCrash, IconWindow, IconTool, IconRoute,
  IconCircleCheck, IconArrowRight,
  IconChevronRight, IconCar, IconUser, IconUsers,
  IconBuildingCommunity, IconPaw, IconLock, IconHeadset,
  IconMotorbike, IconCaravan, IconTractor,
  IconLayoutNavbar,
} from '@tabler/icons-react'

// Kľúč ikony z data/vehicles.js -> tabler komponent (dáta samotné zostávajú bez Reactu).
const VEH_ICONS = {
  motorbike: IconMotorbike, car: IconCar, caravan: IconCaravan, tractor: IconTractor,
  shield: IconShield, crash: IconCarCrash, window: IconWindow, tool: IconTool, route: IconRoute,
  paw: IconPaw, lock: IconLock,
  user: IconUser, users: IconUsers, community: IconBuildingCommunity,
}


export default function Vehicles() {
  const [tab, setTab] = useState('povinne')
  const active = PRODUCTS.find((t) => t.key === tab)
  // vzhľad radu záložiek – rozpracovaná voľba, drží sa naprieč stránkami (aj na profile)
  const [tabStyle, setTabStyle] = useDebugOption('tabs', TAB_VARIANT_DEFAULT)
  // ikona pre TabBar je komponent, nie hotový prvok – veľkosť si volí variant
  const tabItems = PRODUCTS.map((t) => ({ key: t.key, label: t.label, icon: VEH_ICONS[t.icon] }))

  // --- modelové situace: klientské profily na preklik ---
  // Zoznam ťaháme zo situácií k tomuto produktu, nie zo všetkých profilov: prepínač tak
  // nikdy neponúkne profil, ku ktorému by sa nemala z čoho vykresliť situácia.
  const profiles = situationsFor('vozidla')
  const [profKey, setProfKey] = useState(profiles[0].profile.key)
  const picked = profiles.find((x) => x.profile.key === profKey) || profiles[0]
  const prof = picked.profile
  const situation = picked.situation

  // header priehľadný nad foto-hero, plný po zoskrolovaní pod hero (spoločné s ostatnými foto-hero stránkami)
  useHeroHeader()

  return (
    <div className="site">
      {/* ============ 1 · ÚVODNÍ SEKCE – kompaktní záhlaví kategorie ============ */}
      <section className="hero veh-hero">
        {/* foto vozu pod hero + modrý overlay (foto vloží klient do public/vozidla/hero.jpg) */}
        <div className="veh-hero-bg" style={{ backgroundImage: `url(${asset('/vozidla/hero.jpg')})` }} aria-hidden="true" />
        <div className="wrap hero-in veh-hero-in">
          {/* breadcrumb je súčasťou textového stĺpca, nie pás nad ním – rovnako ako na /profil */}
          <div className="hero-tx">
            <nav className="veh-crumb">
              <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} />
              <span>Pojištění</span><IconChevronRight size={14} stroke={2} />
              <b>Pojištění vozidel</b>
            </nav>
            <h1>Pojištění <b>vozidel</b></h1>
            <p>Povinné ručení, havarijní pojištění i asistence – poskládané na míru tomu, jak a kde jezdíte.</p>
            <div className="hero-cta">
              {/* na produkte sa hovorí o produktoch – „Co se jim stalo“ patrí profilu klienta,
                  kde je ten človek konkrétny; tu sú modelové situace prehľadom viacerých profilov */}
              <a href="#veh-produkty" className="btn fill">Prohlédnout produkty <IconArrowRight size={18} stroke={2.2} /></a>
              <a href="#veh-modely" className="btn">Modelové situace</a>
            </div>
          </div>
          <ul className="veh-hero-points">
            <li>
              <span className="veh-hp-ic"><IconCar size={28} stroke={1.5} /></span>
              <span className="veh-hp-tx"><b>Náhradní vůz až na 20 dní zdarma</b><small>Abyste zůstali mobilní i během opravy vozu.</small></span>
            </li>
            <li>
              <span className="veh-hp-ic"><IconHeadset size={28} stroke={1.5} /></span>
              <span className="veh-hp-tx"><b>Oddělení likvidací 24/7, 365 dní</b><small>Škodu řešíme interně, kdykoliv ji nahlásíte.</small></span>
            </li>
            <li>
              <span className="veh-hp-ic"><IconRoute size={28} stroke={1.5} /></span>
              <span className="veh-hp-tx"><b>Služby autopůjčovny</b><small>Vše kolem vozu pod jednou střechou.</small></span>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ 2 · INKASNÍ SYSTÉM (2× 50/50 text + foto), bez veľkého nadpisu ============ */}
      <section className="sec wrap veh-system">
        {/* riadok 1 – Systém + kategórie vozidel vľavo, foto vpravo */}
        <div className="veh-feat">
          <div className="veh-feat-tx">
            <div className="veh-feat-block">
              <h3>Systém</h3>
              <p>V roce 2005 jsme na český trh přinesli jedinečný systém inkasního pojištění Allrisk. Díky globálnímu nákupu velkého množství produktů dosáhneme nejen optimální ceny, ale od každé pojišťovny nebo asistenční společnosti kupujeme jen ty produkty, které jsou prověřené trhem. Tyto produkty pak dle preferencí klienta poskládáme do balíčků, které svým obsahem zaručeně poskytují nejlepší poměr výkonu a ceny na trhu. Na pozadí celého projektu stojí obří IT zázemí, které vyvíjí a neustále zdokonaluje software Allrisk.</p>
            </div>
            <div className="veh-feat-block">
              <h3>Kategorie vozidel</h3>
              <ul className="veh-cats-mini">
                {VEHICLE_CATS.map((c) => {
                  const C = VEH_ICONS[c.icon]
                  return (
                    <li key={c.code}>
                      <span className="veh-cat-ic"><C size={20} stroke={1.6} /></span>
                      <span className="veh-cm-tx"><b>Kategorie {c.code}</b><small>{c.desc}</small></span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="veh-feat-img"><img src={asset('/vozidla/system.jpg')} alt="Inkasní systém Allrisk" loading="lazy" /></div>
        </div>

        {/* riadok 2 – foto vľavo, texty vpravo */}
        <div className="veh-feat rev">
          <div className="veh-feat-img"><img src={asset('/vozidla/vyhody.jpg')} alt="Autopojištění Allrisk" loading="lazy" /></div>
          <div className="veh-feat-tx">
            <div className="veh-feat-block">
              <h3>Obsah balíčku ZDARMA</h3>
              <p>Nad rámec základních produktů autopojištění jsou naší nejsilnější ochranou vozidel asistenční služby ZDARMA. <a href="#veh-produkty">Více informací</a></p>
            </div>
            <div className="veh-feat-block">
              <h3>Sjednocené vyúčtování</h3>
              <p>Ať už máte 1 nebo 100 vozidel, máte vždy jedno jednoduché vyúčtování, které se vám vždy synchronizuje s kalendářním rokem. Sami klienti si určují frekvenci placení od měsíčních po roční platbu bez procentních poplatků za područní platby.</p>
            </div>
            <div className="veh-feat-block">
              <h3>Klientský portál</h3>
              <p>Klientský portál mujallrisk.cz poskytuje našim klientům ucelený přehled na všechny produkty a smlouvy inkasního pojištění Allrisk. Přihlášení a veškeré změny probíhají prostřednictvím SMS hesla, které je vázané na klienty zaregistrované telefonní číslo. Důležitou součástí klientského portálu je přehled o pojistných událostech, které řešíte přes oddělení likvidace Allrisk.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4 · ZÁLOŽKY PRODUKTŮ ============ */}
      <section id="veh-produkty" className="sec wrap">
        <SecHead
          ey="Co lze sjednat"
          title={<>Vše k autu na <b>jedné stránce</b></>}
          lead="Přepínejte mezi produkty a poskládejte si krytí přesně na míru – od povinného ručení po ochranu na cestách."
        />

        {/* rovnaký rad záložiek ako situácie v profile klienta – jeden komponent */}
        <TabBar
          items={tabItems} value={tab} onChange={setTab}
          variant={tabStyle} label="Produkty k vozidlu"
        />

        {/* panel aktívneho produktu – rovnaká kostra pre všetky */}
        <div className="veh-panel" role="tabpanel">
          <div className="veh-panel-tx">
            <span className="veh-pill">{active.tag}</span>
            <h3>{active.label}</h3>
            <p>{active.lead}</p>
            <div className="veh-cov-lbl">Co kryje</div>
            <ul className="veh-cov">
              {active.covers.map((c) => (
                <li key={c}><IconCircleCheck size={20} stroke={1.8} /> <span>{c}</span></li>
              ))}
            </ul>
          </div>

          <aside className="veh-aside">
            <span className="veh-aside-ic">{(() => { const C = VEH_ICONS[active.icon]; return <C size={38} stroke={1.5} /> })()}</span>
            <div className="veh-aside-t">Dobré vědět</div>
            <p>{active.note}</p>
            <div className="veh-aside-div" />
            <div className="veh-aside-row"><IconCircleCheck size={18} stroke={1.8} /> Sjednání online za pár minut</div>
            <div className="veh-aside-row"><IconCircleCheck size={18} stroke={1.8} /> Vlastní likvidace škod</div>
            <div className="veh-aside-row"><IconCircleCheck size={18} stroke={1.8} /> Poradce nablízku po celé ČR</div>
          </aside>
        </div>
      </section>

      {/* ============ 3 · MODELOVÉ SITUACE (klientské profily na preklik) ============ */}
      <section id="veh-modely" className="sec wrap">
        {/* počet nie je natvrdo – iný produkt môže mať modelov menej */}
        <SecHead
          ey="Modelové situace"
          title={<>Najděte se v <b>jednom ze {countGen(profiles.length)} profilů</b></>}
          lead="Vyberte si profil, který vám sedí nejvíc, a podívejte se, co se v něm reálně stalo – a co v tom pojištění udělalo."
        />

        {/* Prepínač klientských profilov – doslova tie isté dlaždice ako na landingu,
            len bez CTA. Jeden komponent, žiadny druhý variant karty. */}
        <ProfileTabs profiles={profiles.map((x) => x.profile)} value={profKey} onChange={setProfKey} />

        {/* Tá istá situácia, akú vidí klient na svojej profilovej stránke – len vstup je produkt. */}
        <div className="veh-sit" key={situation.key}>
          <SituationPanel profile={prof} situation={situation} context="produkt" />
        </div>

        {/* overenie na vlastnú situáciu → poradca */}
        <div className="veh-verify">
          <div className="veh-verify-tx">
            <h3>Chcete si to ověřit přesně na vaši situaci?</h3>
            <p>Projděte si krytí s poradcem – ukážeme, co přesně potřebujete, bez zbytečného přeplácení i bez děr v krytí.</p>
          </div>
          <Link to="/kontakt?tema=Pojištění vozidel" className="btn fill">Probrat s poradcem <IconArrowRight size={18} stroke={2.2} /></Link>
        </div>
      </section>


      {/* ============ 5 · KONTAKT (spoločný banner) ============ */}
      <ContactBand />

      {/* ============ FOOTER (spoločný) ============ */}
      <SiteFooter />

      {/* rad záložiek je ten istý prvok ako v profile klienta – variant sa prepína
          na oboch stránkach naraz, aby sa dal porovnať v oboch kontextoch */}
      <DebugPanel>
        <DebugGroup
          icon={IconLayoutNavbar} label="Záložky" value={tabStyle} onChange={setTabStyle} wrap
          options={TAB_VARIANTS}
        />
      </DebugPanel>
    </div>
  )
}
