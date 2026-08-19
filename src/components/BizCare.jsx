/* ============================================================
   Systém péče o klienta - obsah bývalej stránky /podnikatele.

   Stránka zanikla 2026-08-11: odkedy je publikum prvou úrovňou navigácie
   a prepnutie záložky mení celý web, nemá zmysel, aby jedno z troch publík
   malo vlastnú adresu. Kto klikne na „Podnikatelé", dostane tento obsah
   rovno na úvode - tam, kde ostatné publiká vidia rozcestník a „Proč Allrisk".

   Rozdelené na dva kusy, lebo na úvode nesedia vedľa seba:
     BizPrinciples - „Proč si vybrat Allrisk" (7 kariet). Stojí hneď za hero
                     videom, v tom istom mieste, kde majú rodiny rozcestník.
                     Je to prvá vec po videu a musí odpovedať „proč vy".
     BizCare       - zvyšok systému péče: spolupráce, následná péče, Centrum
                     likvidace, autopojištění, ekosystém.

   Texty sú doslovný prepis z brožúry (data/care.js), nie parafráza.
   Ikony sedia tu, nie v dátach: tie isté texty môže použiť iná stránka
   s iným vizuálom a dáta by potom niesli cudzí predpis.
   ============================================================ */
import { useState } from 'react'
import { SecHead } from './PageParts.jsx'
import Illus from './Illus.jsx'
import { Decor } from './Decor.jsx'
import { Line } from './Line.jsx'
import Ecosystem from './Ecosystem.jsx'
import { STEPS, PRINCIPLES, AFTERCARE, CLAIMS, FLEET } from '../data/care.js'
import { whyVariant, WHY_VARIANT_DEFAULT } from '../bizVariants.js'
import {
  IconUserCheck, IconCar, IconShieldCheck, IconChevronDown,
  IconCircleCheck, IconLifebuoy, IconZoomCheck, IconRefresh, IconAward, IconChecklist,
  IconCheck, IconTruck, IconHeadset, IconPaw,
  IconWheel, IconDisc, IconPlugConnected, IconCaravan, IconScale, IconCloudStorm,
} from '@tabler/icons-react'

const PRINCIPLE_ICONS = {
  partner: IconUserCheck,
  check: IconCircleCheck,
  opora: IconLifebuoy,
  rizika: IconZoomCheck,
  pece: IconRefresh,
  kvalita: IconAward,
  vyber: IconChecklist,
}
const FLEET_ICONS = {
  car: IconCar, tow: IconTruck, help: IconHeadset, animal: IconPaw, tyre: IconWheel,
  disc: IconDisc, cable: IconPlugConnected, trailer: IconCaravan, law: IconScale, storm: IconCloudStorm,
}

/* ---------- Proč si vybrat Allrisk ----------
   Sedem tvrdení zo strany 6 brožúry, ale NIE sedem kariet.

   Zastrešujúce tvrdenie (`lead: true`) sa NEVYPISUJE (user, 2026-08-16): nadpis
   sekcie hovorí to isté a veta pod ním bola ten istý sľub druhýkrát. V dátach
   zostáva - odlišuje jedno tvrdenie od šiestich rovnocenných dôvodov pod ním.

   Popis KAŽDÉHO z tých šiestich sa vypisuje (user, 2026-08-16 - bez neho sú
   tvrdenia holé). Ako sa vypíše, rozhoduje variant (src/bizVariants.js,
   prepínač v ladiacom paneli): ruled riadky, dlaždice alebo holý pruh bez
   popisov.

   Variant „karty" NIE JE vlastný vzhľad: je to dlaždica rozcestníka (.rz-tile
   vo wireframe.css) - tá istá vec na tom istom mieste úvodu, len pre iné
   publikum (user, 2026-08-17). Preto si nesie jej triedy vrátane veľkého
   vodoznaku z tej istej ikony, nie kópiu jej vzhľadu v business.css. Kliknuteľná
   nie je: dôvod nie je voľba, nemá kam viesť - takže <li>, žiadne <button>
   a žiadny náznak druhej úrovne (.rz-more). */
export function BizPrinciples({ variant = WHY_VARIANT_DEFAULT }) {
  // `lead: true` nesie v dátach práve jedno tvrdenie (viď data/care.js)
  const reasons = PRINCIPLES.filter((p) => !p.lead)
  const v = whyVariant(variant)
  const tile = v === 'karty'
  return (
    <>
      <SecHead
        ey="Pro podnikatele a firmy"
        title={<>Nezačínáme produktem, <b>ale vaší firmou</b></>}
        /* Veta hovorí, čo z toho titulku plynie prakticky - preberáme celý
           program. Zámerne NEOPAKUJE zastrešujúci sľub z brožúry („máte jednoho
           odborníka"): ten stál na tomto mieste do 2026-08-16 a bol to ten istý
           sľub, aký hovorí nadpis nad ním. */
        lead="Převezmeme celý pojistný program vaší firmy - od rozpoznání rizik přes výběrové řízení až po škody, které vyřídíme za vás."
      />
      <ul className={`biz-why biz-why--${v}`}>
        {reasons.map((p) => {
          const I = PRINCIPLE_ICONS[p.icon]
          return (
            <li key={p.key} className={tile ? 'rz-tile' : undefined}>
              {tile && <span className="rz-bg" aria-hidden="true">{I && <I size={200} stroke={1.1} />}</span>}
              <span className={`biz-why-ic${tile ? ' ni' : ''}`}>
                {I && <I size={tile ? 28 : 24} stroke={tile ? 1.6 : 1.7} />}
              </span>
              <b>{p.label}</b>
              {/* skrátené znenie do dlaždice; plný prepis z tlače zostáva v `desc` */}
              <p>{p.short || p.desc}</p>
            </li>
          )
        })}
      </ul>
    </>
  )
}

/* Kroky spolupráce - očíslovaný zoznam, kde je vidieť len názov a popis sa
   rozbalí. Otvorený je najviac jeden krok naraz.
   Rozbalenie beží cez `grid-template-rows: 0fr → 1fr`: popis má neznámu výšku,
   takže `max-height` by musel hádať číslo a pri dlhšom texte by sekal. */
function StepList({ items }) {
  // Prvý krok je otvorený hneď (user, 2026-08-16): sekcia tak neotvára piatimi
  // holými názvami, ale rovno ukáže, čo sa v kroku deje. Kliknutím sa zavrie.
  const [open, setOpen] = useState(items[0]?.key ?? null)

  // Hover PREBERÁ otvorenie, nie pridáva (user, 2026-08-17). Do toho dňa bolo
  // rozbalenie pod myšou v CSS (`li:hover`), takže prvý krok zostal otvorený
  // a pri prejdení na tretí boli otvorené dva - a to je presne tá stena textu,
  // ktorej sa sekcia vyhýba. Preto stav namiesto :hover: otvorený je vždy práve
  // jeden a myš ho prepína rovnako ako klik.
  // `pointerType` je tu podstatné: na dotyku prehliadač pošle pred klikom
  // syntetický `pointerenter`, takže by ťuknutie na zavretý krok otvorilo (enter)
  // a hneď zavrelo (klik). Zvládne to teda len skutočná myš alebo pero.
  const enter = (key) => (e) => { if (e.pointerType !== 'touch') setOpen(key) }

  return (
    <ol className="biz-steps">
      {items.map((it, i) => (
        <li
          key={it.key} id={`krok-${it.key}`} className={open === it.key ? 'on' : ''}
          onPointerEnter={enter(it.key)}
        >
          <button
            type="button"
            aria-expanded={open === it.key}
            aria-controls={`krok-d-${it.key}`}
            onClick={() => setOpen((cur) => (cur === it.key ? null : it.key))}
          >
            {/* číslo je poradie v rade, preto z indexu a nie z dát */}
            <span className="biz-step-n">{i + 1}</span>
            <b>{it.label}</b>
            <IconChevronDown className="biz-step-cv" size={18} stroke={2.2} aria-hidden="true" />
          </button>
          {/* dve schránky zámerne: vonkajšia sa zmršťuje, vnútorná orezáva.
              Keby orezával rovno odstavec, jeho spodné odsadenie by v zabalenom
              stave nechalo vidieť prvý riadok - `overflow` reže po hranu VÝPLNE. */}
          <div className="biz-step-d" id={`krok-d-${it.key}`}>
            <div className="biz-step-dn"><p>{it.desc}</p></div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ---------- zvyšok systému péče ----------
   Vlastné <section> pásy, nie jeden blok: sú to samostatné argumenty
   a úvod ich prekladá rovnakým rytmom ako každú inú sekciu. */
export function BizCare() {
  return (
    <>
      {/* ============ SPOLUPRÁCE ============
          PREROBENÉ 2026-08-16 (user): obsah vľavo, ilustrácia spolupráce vpravo
          cez celú výšku sekcie (tá istá, aká tu bola), v tom istom pomere ako
          sekcie pod ňou (.biz-care). Veta pod titulkom odpadla: „pět kroků"
          povie samotný zoznam.

          Kroky si nechávajú pôvodnú „cestu": modré koliesko s číslom a linka
          medzi kolieskami - to je to, čo z piatich odstavcov robí postupnosť.

          Krok je len názov, popis sa rozbalí - hoverom aj klikom (na dotyku
          hover neexistuje, tam je klepnutie jediné gesto). Otvorený je vždy
          najviac jeden: päť rozbalených odstavcov je stena textu, presne to,
          čomu sa vyhýbame. Názvy idú v Interi a o stupeň nižšie - v stĺpci
          vedľa ilustrácie čítal displejový rez ako päť nadpisov.

          ZMAZANÉ 2026-08-16 aj s CSS a s prepínačom v ladiacom paneli: varianty
          krokov `cesta` / `pas` / `radky`.

          Prefix id je `krok-`: kľúč „pece" má aj sekcia Následná péče nižšie
          a dve rovnaké id na stránke rozbijú kotvy aj odčítačku. */}
      <section className="sec wrap" id="spoluprace">
        <div className="biz-flow">
          <div className="biz-flow-tx">
            <SecHead
              ey="Spolupráce"
              title={<>Jakým způsobem pro naše klienty <b>pracujeme</b></>}
            />
            <StepList items={STEPS} />
          </div>
          <Illus src="/illus/tabler/podnikatele/spoluprace.png" icon={IconChecklist} />
        </div>
      </section>

      {/* ============ NÁSLEDNÁ PÉČE (brožúra s. 12) ============
          Text aj výpočet služby sú v jednom stĺpci, ilustrácia drží celú
          druhú stranu sekcie. */}
      <section className="sec wrap" id="pece">
        <div className="biz-care biz-care--alt">
          <div className="biz-care-tx">
            <span className="ey">Následná péče</span>
            <h2>Uzavřením pojištění to <b>nekončí</b></h2>
            {/* Veta pod titulkom tu už NIE JE (user, 2026-08-16) - garant, o ktorom
                hovorila, je prvou položkou zoznamu. Body sú jeden riadok, bez podtextu. */}
            <ul className="biz-list biz-list--lg">
              {AFTERCARE.map((t) => (
                <li key={t}><IconCheck size={22} stroke={2.4} aria-hidden="true" /> {t}</li>
              ))}
            </ul>
          </div>
          <Illus src="/illus/tabler/podnikatele/pece.png" icon={IconUserCheck} />
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
            {/* Veta pod titulkom tu už NIE JE (user, 2026-08-16) - rozdiel oproti
                trhovému štandardu nesie prvá položka zoznamu. Body sú jeden riadok. */}
            <ul className="biz-list biz-list--lg">
              {CLAIMS.map((c) => (
                <li key={c}><IconCheck size={22} stroke={2.4} aria-hidden="true" /> {c}</li>
              ))}
            </ul>
          </div>
          <Illus src="/illus/tabler/podnikatele/likvidace.svg" icon={IconShieldCheck} />
        </div>
      </section>

      {/* ZMAZANÉ 2026-08-16 (user): sekcia „Úrovně asistence" - dve karty
          s porovnaním trhového štandardu a našej plnej asistencie. Dáta
          (ASSIST v data/care.js) zostávajú, sú prepísané z brožúry. */}

      {/* ============ AUTOPOJIŠTĚNÍ (brožúra s. 16) ============
          PREROBENÉ 2026-08-16 (user): jeden modrý pás - text vľavo, desať krytí
          ako drobné kartičky vpravo. Ilustrácia je preč: hodnota sekcie je
          v tom, KOĽKO tých krytí je, a kresba auta vedľa nich len ubrala miesto.
          Pás je spoločný `.banner`, nie vlastná modrá plocha - na webe sú takéto
          pásy štyri a druhá kópia gradientu by sa raz rozišla s prvou. */}
      <section className="sec wrap" id="vozy">
        <div className="banner biz-fleet">
          <Decor />
          {/* vpravo hore: kartičky krytia zaberajú celú spodnú časť pásu na plnú
              šírku, takže jediný voľný roh je ten vedľa titulku */}
          <Line corner="top-right" />
          <div className="biz-fleet-tx">
            <span className="ey">Autopojištění Allrisk</span>
            {/* bez vety pod titulkom (user, 2026-08-16) - čo je zdarma, vypisujú
                kartičky pod ním, veta to len prerozprávala */}
            <h2>Za co jinde platíte, <b>u nás máte zdarma</b></h2>
          </div>
          <ul className="biz-perks">
            {FLEET.map((f) => {
              const I = FLEET_ICONS[f.icon]
              return (
                <li key={f.label}>
                  {I && <I size={24} stroke={1.7} aria-hidden="true" />}
                  <b>{f.label}</b>
                  <small>{f.note}</small>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ============ EKOSYSTÉM ============
          Až na konci: je to odpoveď na „a co ještě umíte", nie argument
          stránky.

          TÁ ISTÁ SEKCIA AKO NA /o-nas (user, 2026-08-19: „necháj label a title,
          zvyšok vymeň za to, čo je na about"). Do tejto zmeny tu stála vlastná
          mriežka šiestich kariet nad firemným rezom dát (`ECOSYSTEM` z care.js,
          `.biz-eco` v business.css) - druhá podoba toho istého tvrdenia. Teraz
          je to komponent s kružnicou, takže sa ekosystém na oboch miestach
          kreslí, otáča aj číta rovnako.

          Zostáva JEDINE oko nad nadpisom: „Vše pod jednou střechou" je vetná
          hlavička úvodu, kde sekcia nadväzuje na predchádzajúce pásy; /o-nas má
          na tom mieste holé „Ekosystém". Nadpis je na oboch miestach ten istý,
          takže ho nesie komponent. Odišla veta pod ním - na /o-nas žiadna nie je
          a popis línie ju hovorí presnejšie. */}
      <Ecosystem id="ekosystem" ey="Vše pod jednou střechou" />
    </>
  )
}
