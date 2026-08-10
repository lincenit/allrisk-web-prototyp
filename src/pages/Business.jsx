/* ============================================================
   /podnikatele - systém péče o klienta.

   Stránka bola 2026-08-10 zredukovaná na dve sekcie z brožúry:
     1. Proč si vybrat Allrisk pro vaše pojištění (7 kariet)
     2. Jakým způsobem pro naše klienty pracujeme (5 krokov)
   Všetko ostatné (čísla, partneri, analýza, garant, Centrum likvidace,
   krytie) je preč. Dáta k tomu zostali zaparkované v data/care.js.

   Nie je to produktová stránka: klient sa dohodol, že podnikateľom sa
   netlačia produkty, ale spôsob, akým sa o firmu staráme.

   Texty sú doslovný prepis z tlače, nie parafráza.
   ============================================================ */
import { Link } from 'react-router-dom'
import './wireframe.css'
import './business.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { DebugPanel } from '../components/DebugPanel.jsx'
import HeaderDebug from '../components/HeaderDebug.jsx'
import { SecHead } from '../components/PageParts.jsx'
import Illus from '../components/Illus.jsx'
import { STEPS, PILLARS, PRINCIPLES, AFTERCARE, ASSIST, CLAIMS, FLEET, ECOSYSTEM } from '../data/care.js'
import {
  IconChevronRight, IconArrowRight, IconShieldCheck, IconUserCheck, IconCar,
  IconCircleCheck, IconLifebuoy, IconZoomCheck, IconRefresh, IconAward, IconChecklist,
  IconCheck, IconMinus, IconBuildingStore, IconTruck, IconHeadset, IconPaw,
  IconWheel, IconDisc, IconPlugConnected, IconCaravan, IconScale, IconCloudStorm,
  IconShieldHalf, IconChartLine, IconBuildingSkyscraper, IconHelpCircle, IconGavel, IconBolt,
} from '@tabler/icons-react'

// Ikony sedia v komponente, nie v dátach: tie isté texty môže použiť iná
// stránka s iným vizuálom a dáta by potom niesli cudzí predpis.
const PILLAR_ICONS = { likvidace: IconShieldCheck, garant: IconUserCheck, flotily: IconCar }
// Krytí v autopojištění a línie ekosystému. Mapy sedia tu z rovnakého dôvodu
// ako pri princípoch: dáta nesú obsah, nie predpis vizuálu.
const FLEET_ICONS = {
  car: IconCar, tow: IconTruck, help: IconHeadset, animal: IconPaw, tyre: IconWheel,
  disc: IconDisc, cable: IconPlugConnected, trailer: IconCaravan, law: IconScale, storm: IconCloudStorm,
}
const ECO_ICONS = {
  shield: IconShieldHalf, chart: IconChartLine, building: IconBuildingSkyscraper,
  help: IconHelpCircle, law: IconGavel, bolt: IconBolt,
}

const PRINCIPLE_ICONS = {
  partner: IconUserCheck,
  check: IconCircleCheck,
  opora: IconLifebuoy,
  rizika: IconZoomCheck,
  pece: IconRefresh,
  kvalita: IconAward,
  vyber: IconChecklist,
}

export default function Business() {
  useHeroHeader()

  return (
    <div className="site">
      {/* ============ HERO ============
          Foto je z klientovej brožúry, nie stock. Tri body vedľa titulku sú
          tvrdenia, nie odkazy: sekcie, na ktoré predtým mierili, na stránke
          už nie sú. */}
      <section className="hero biz-hero photo-hero">
        <div className="photo-hero-bg" style={{ backgroundImage: `url(${asset('/podnikatele/hero.jpg')})` }} aria-hidden="true" />
        <div className="wrap hero-in biz-hero-in">
          <div className="hero-tx">
            <nav className="biz-crumb">
              <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} />
              <b>Podnikatelé</b>
            </nav>
            <h1>Pojištění, které posouvá<br />hranice <b>vašeho podnikání</b></h1>
            <p>Neprodáváme produkty. Díváme se na vaše podnikání v souvislostech, hledáme rizika a zůstáváme u toho i po podpisu smlouvy.</p>
            <div className="hero-cta">
              <a href="#spoluprace" className="btn fill">Jak s vámi pracujeme <IconArrowRight size={18} stroke={2.2} /></a>
              <Link to="/kontakt" className="btn">Domluvit setkání</Link>
            </div>
          </div>
          <ul className="hero-points">
            {PILLARS.map((p) => {
              const I = PILLAR_ICONS[p.key]
              return (
                <li key={p.key}>
                  <span className="hp-ic">{I && <I size={28} stroke={1.5} />}</span>
                  <span className="hp-tx"><b>{p.label}</b><small>{p.short}</small></span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ============ PROČ ALLRISK ============
          Sedem kariet zo strany 6 brožúry. Prvá je zastrešujúci sľub, nie
          jedna zo siedmich rovnocenných, preto má vlastný vzhľad a v mriežke
          zaberá dve miesta. */}
      <section className="sec wrap" id="proc">
        <SecHead
          ey="Proč Allrisk"
          title={<>Proč si vybrat Allrisk pro vaše <b>pojištění</b></>}
          lead="Nejsme jen zprostředkovatel smlouvy. Postaráme se o celý pojistný program vaší firmy, od rozpoznání rizik po pomoc, když se něco stane."
        />
        <ul className="biz-cards">
          {PRINCIPLES.map((p) => {
            const I = PRINCIPLE_ICONS[p.icon]
            return (
              <li key={p.key} className={p.lead ? 'is-lead' : ''}>
                <span className="biz-card-ic">{I && <I size={26} stroke={1.6} />}</span>
                <b>{p.label}</b>
                <p>{p.desc}</p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ============ SPOLUPRÁCE ============
          Nadpis s ilustráciou vpravo, pod celým blokom kroky pod sebou na
          plnú šírku. Obsah karty stojí v stĺpci: číslo, názov, popis. */}
      <section className="sec wrap" id="spoluprace">
        <div className="biz-head">
          <SecHead
            ey="Spolupráce"
            title={<>Jakým způsobem pro naše klienty <b>pracujeme</b></>}
            lead="Pět kroků, které projdeme s každou firmou. Na základě plné moci vás zastupujeme u pojistitelů, od poptávky až po správu škod."
          />
          <Illus src="/illus/tabler/podnikatele/spoluprace.svg" icon={IconChecklist} />
        </div>
        {/* prefix `krok-`: kľúč „pece" má aj sekcia Následná péče nižšie
            a dve rovnaké id na stránke rozbijú kotvy aj odčítačku */}
        <ol className="biz-steps">
          {STEPS.map((st) => (
            <li key={st.key} id={`krok-${st.key}`}>
              <b>{st.label}</b>
              <p>{st.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ NÁSLEDNÁ PÉČE (brožúra s. 12) ============
          Text aj výpočet služby sú v jednom stĺpci, ilustrácia drží celú
          druhú stranu sekcie. Predtým zoznam prebiehal cez plnú šírku pod
          blokom a rozpadol sa na dve nesúvisiace časti. */}
      <section className="sec wrap" id="pece">
        <div className="biz-care biz-care--alt">
          <div className="biz-care-tx">
            <span className="ey">Následná péče</span>
            <h2>Uzavřením pojištění to <b>nekončí</b></h2>
            <p>Každý klient má podle rozsahu sjednaných služeb přiděleného odborného garanta. Je vaším hlavním kontaktem a dohlíží na to, aby pojištění odpovídalo aktuální situaci firmy. Naším cílem je jistota, že se o vaše pojištění někdo aktivně stará, nejen formálně.</p>
            <ul className="biz-list biz-list--lg">
              {AFTERCARE.map((t) => (
                <li key={t.slice(0, 24)}><IconCheck size={22} stroke={2.4} /> {t}</li>
              ))}
            </ul>
          </div>
          <Illus src="/illus/tabler/podnikatele/garant.svg" icon={IconUserCheck} />
        </div>
      </section>

      {/* ============ CENTRUM LIKVIDACE (brožúra s. 14) ============
          Rovnaká kostra ako následná péče: text a výpočet v jednom stĺpci,
          ilustrácia cez celú druhú stranu. */}
      <section className="sec wrap" id="likvidace">
        <div className="biz-care">
          <div className="biz-care-tx">
            <span className="ey">Centrum likvidace pojistných událostí</span>
            <h2>Když nastane <b>škoda</b></h2>
            <p>Při pojistné události se ukáže rozdíl mezi běžným servisem a partnerstvím. Standardem na trhu je základní asistence makléře. My máme vlastní Centrum likvidace.</p>
            <ul className="biz-list biz-list--lg">
              {CLAIMS.map((c) => (
                <li key={c}><IconCheck size={22} stroke={2.4} /> {c}</li>
              ))}
            </ul>
          </div>
          <Illus src="/illus/tabler/podnikatele/likvidace.svg" icon={IconShieldCheck} />
        </div>
      </section>

      {/* ============ ÚROVNĚ ASISTENCE ============
          Vlastný pás, nie súčasť sekcie vyššie: je to porovnanie s trhom,
          nie výpočet toho, čo Centrum robí. V sekcii sa oba zoznamy bili. */}
      <section className="wrap biz-mini" id="asistence">
        <span className="ey">Úrovně asistence</span>
        <div className="biz-assist">
          {ASSIST.map((a) => (
            <article key={a.key} className={a.market ? 'is-market' : 'is-ours'}>
              <span className="biz-assist-note">
                {a.market ? <IconMinus size={14} stroke={2.5} /> : <IconCheck size={14} stroke={3} />}
                {a.note}
              </span>
              <b>{a.label}</b>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ============ AUTOPOJIŠTĚNÍ (brožúra s. 16) ============
          Rovnaká kostra ako spolupráce: nadpis vľavo, ilustrácia vpravo,
          pod celým blokom desať krytí na plnú šírku. Sú to rovnocenné
          dlaždice a hodnota je v tom, koľko ich je - v stĺpci vedľa obrázka
          by z nich bol úzky zoznam. */}
      <section className="sec wrap" id="vozy">
        <div className="biz-head">
          <SecHead
            ey="Autopojištění Allrisk"
            title={<>Za co jinde platíte, <b>u nás máte zdarma</b></>}
            lead="Inkasní systém drží náklady na vozový park pod kontrolou. Jedna platba za všechny produkty, žádná správa smluv s různými variabilními symboly."
          />
          <Illus src="/illus/tabler/podnikatele/vozy.svg" icon={IconCar} />
        </div>
        <ul className="biz-perks">
          {FLEET.map((f) => {
            const I = FLEET_ICONS[f.icon]
            return (
              <li key={f.label}>
                <span className="biz-perk-ic">{I && <I size={20} stroke={1.7} />}</span>
                <span><b>{f.label}</b><small>{f.note}</small></span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ============ EKOSYSTÉM (brožúra s. 10) ============
          Až na konci: je to odpoveď na „a co ještě umíte", nie argument
          stránky. Firemný rez, nie celý katalóg pre všetkých. */}
      <section className="sec wrap" id="ekosystem">
        <SecHead
          ey="Vše pod jednou střechou"
          title={<>Ucelený unikátní <b>ekosystém Allrisk</b></>}
          lead="Služby na sebe navazují. Na jednom místě vyřešíte i financování, nemovitosti a provozní náklady."
        />
        <div className="biz-eco">
          {ECOSYSTEM.map((e) => {
            const I = ECO_ICONS[e.icon]
            return (
              <article key={e.key}>
                <span className="biz-eco-ic">{I && <I size={22} stroke={1.7} />}</span>
                <b>{e.label}</b>
                <p>{e.desc}</p>
                <ul>
                  {e.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      <ContactBand />
      <SiteFooter />

      <DebugPanel>
        <HeaderDebug />
      </DebugPanel>
    </div>
  )
}
