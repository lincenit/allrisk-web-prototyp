import { useCallback, useRef, useState } from 'react'
import '../pages/ecosystem.css'
import { LINES } from '../data/company.js'
import { SecHead } from './PageParts.jsx'
import {
  IconArrowLeft, IconArrowRight, IconCheck,
  IconShield, IconBuildingEstate, IconCoins, IconLifebuoy, IconScale, IconSparkles,
} from '@tabler/icons-react'

// ============================================================
// EKOSYSTÉM - šesť obchodných línií, JEDNA podoba.
//
// Kružnica na bielej sekcii, bubliny len s ikonou a menom, text nalieha na
// vybraný kruh. Je to pôvodný návrh, vrátený 2026-08-18 na žiadosť usera
// („tú prvú variantu vráť ako sme ju mali predtým, než som ťa poprosil
// o redizajn"). Fotka línie z bubliny odišla a bublina sa zmenšila (user,
// ten istý deň) - ostáva ikona a názov na značkovej modrej.
//
// ŠÍPKY STOJA NAD POPISOM A ZĽAVA S NÍM LÍCUJÚ (user, 2026-08-19: „daj to nad
// Komplexní… align left"). Sú preto priamo v sadzbe, nie prilepené k okraju
// mriežky - zarovnanie tak drží sám text a platí na ploche aj v úzkom okne.
// Neposúvajú sa, lebo pravá strana je pripnutá HORE a rastie nadol; že jej
// spodok potom pri každej línii plachtí inde, je v poriadku, riešilo sa práve
// to, aby neposkakovali šípky.
//
// ZMAZANÉ 2026-08-19 (user: „odstráň ostatné varianty, ostáva len Kolo + text
// a šípky nad popisom zľava") aj s ladiacim prepínačom `dbg:eko4` / `dbg:ekonav`
// a s components/EcosystemDebug.jsx:
//   podoby  `sloupec` (kategórie na otáčajúcom sa oblúku vľavo, detail vpravo)
//           a `hranate` (to isté koleso so štvorcovými bublinami)
//   šípky   `pod` (spodok textu pripnutý na dráhu, text rástol nahor)
//           a `nadpis` (pager v riadku s nadpisom sekcie)
//
// ZMAZANÉ 2026-08-18 (user: „iba si vytvoril kopec ďalších zbytočných variant"):
// päť podôb, ktoré sa líšili len PODKLADOM POD TEXTOM - `sklo`, `deska`,
// `vypis`, `velky` a fotka ako podklad karty (`foto`). Boli to zámeny pozadia,
// nie návrhy. A po nich aj `pas` - modrý pás cez celú šírku okna.
//
// Karta NEMÁ NADPIS (user, 2026-08-18): meno línie stojí v bubline, v detaile
// by bolo druhýkrát.
//
// ZMAZANÉ skôr, stále platí: ryhy na dráhe, čítacia hlava, rozmazanie počas
// otáčky, ťahanie so zotrvačnosťou, značka v strede kružnice, štyri statické
// rozvrhy bez kružnice, hustý riadok služieb oddelený bodkami.
//
// SEKCIU NESÚ DVE MIESTA (2026-08-19): /o-nas a úvod pre podnikateľov. Na úvode
// stála do tejto zmeny vlastná mriežka šiestich kariet (`.biz-eco`) nad iným
// rezom dát - dve podoby toho istého tvrdenia. User ju vymenil za tento
// komponent, takže sa ekosystém kreslí a otáča na oboch miestach rovnako.
// Oko nad nadpisom je prop (`ey`) - hlavička sa na každom mieste líši. Od
// 2026-08-27 je prepisovateľný aj `title`: úvod pre rodiny sekciu volá „Proč
// zvolit Allrisk?", /o-nas aj podnikatelia berú nadpis z tlače. Veta pod
// nadpisom nikde nie je - skúšaná bola (tvrdenie z brožúry pod otázkou) a user
// ju zamietol, na otázku odpovedá samotné koleso.
//
// Štýly si komponent importuje sám (pages/ecosystem.css). Boli v about.css,
// ale stránka, ktorá si sekciu zavolá, si nemá ťahať šatník cudzej stránky.
// ============================================================

const COUNT = LINES.length
const STEP = 360 / COUNT

// Kľúč z data/company.js → ikona. Ten istý spôsob ako CHANNEL_ICONS na /o-nas:
// dáta nesú meno, obrázok si vyberá komponent.
const ECO_ICONS = {
  shield: IconShield, estate: IconBuildingEstate, coins: IconCoins,
  help: IconLifebuoy, scale: IconScale, club: IconSparkles,
}

export default function Ecosystem({
  ey = 'Ekosystém',
  // Nadpis je na /o-nas aj u podnikateľov ten istý, preto stojí tu ako východzia
  // hodnota. Úvod pre rodiny ho prepisuje - sekcia sa tam volá „Proč zvolit
  // Allrisk?", lebo je to prvý argument stránky, nie výpočet služieb.
  title = <>Ucelený unikátní <b>ekosystém Allrisk</b></>,
  id,
}) {
  const [i, setI] = useState(0)
  // Uhol sa akumuluje, nepočíta sa modulo 360: prechod z poslednej línie na
  // prvú tak koleso dotočí dopredu o krok, a nie späť skoro cez celú kružnicu.
  const [rot, setRot] = useState(0)
  const nodes = useRef([])

  const go = useCallback((k, focus) => {
    const idx = ((k % COUNT) + COUNT) % COUNT
    setI(idx)
    setRot((r) => {
      let d = (idx * STEP - r) % 360
      if (d > 180) d -= 360
      if (d < -180) d += 360
      return r + d
    })
    if (focus) nodes.current[idx]?.focus()
  }, [])

  const onKey = (e) => {
    const map = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: COUNT - 1 }
    if (!(e.key in map)) return
    e.preventDefault()
    go(map[e.key], true)
  }

  const active = LINES[i]

  return (
    // Sekciu si nesie komponent sám (nie stránka): hlavička sekcie, kružnica
    // aj detail sú jeden rozvrh a stránka do neho nemá čo hovoriť.
    <section id={id} className="sec eco-sec">
      <div className="wrap eco-in">
        <div className="eco-head">
          <SecHead ey={ey} title={title} />
        </div>

        <div className="eco">
          <div
            className="eco-ring" style={{ '--eco-rot': `${rot}deg` }}
            role="tablist" aria-label="Obchodní linie Allrisk" onKeyDown={onKey}
          >
            {/* Stuha nie je SVG: kreslí ju CSS ako kužeľový gradient orezaný
                na prstenec, takže farba beží PO DRÁHE a nie cez štvorec okolo
                nej. Stred, polomer aj hrúbku berie z tých istých premenných,
                po ktorých sa rozostavujú uzly (ecosystem.css). */}
            <span className="eco-track" aria-hidden="true" />

            <div className="eco-wheel">
              {LINES.map((l, k) => {
                const Icon = ECO_ICONS[l.icon]
                const on = k === i
                return (
                  <button
                    key={l.key} type="button" role="tab" id={`eco-tab-${l.key}`}
                    ref={(el) => { nodes.current[k] = el }}
                    aria-selected={on} aria-controls="eco-detail" tabIndex={on ? 0 : -1}
                    className={`eco-node${on ? ' on' : ''}`}
                    style={{ '--a': `${-k * STEP}deg` }}
                    onClick={() => go(k)}
                  >
                    {/* kontraotočenie: koleso sa točí, kruh stojí rovno */}
                    <span className="eco-node-in">
                      <Icon stroke={1.6} aria-hidden="true" />
                      {/* Skratka, nie celé meno: bubliny sú rovnako veľké
                          a dlhý názov sa do nich nezmestí. */}
                      <span className="eco-node-lb">{l.short}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            className="eco-detail" id="eco-detail"
            role="tabpanel" aria-labelledby={`eco-tab-${active.key}`}
          >
            {/* `key` = líniu prekresli, nie prepíš: detail tak nabehne ako celok
                a výpočet služieb sa vysype po položkách. */}
            <div className="eco-detail-in" key={active.key}>
              {/* Detail nesie SADZBU, nie obrázok: fotka línie je súčasť
                  kategórie, tá tu po zmazaní podoby `sloupec` nie je.
                  Šípky sú PRVÁ VEC pravej strany - stoja nad popisom a zľava
                  s ním lícujú, preto sú v sadzbe a nie pripnuté k mriežke. */}
              <div className="eco-nav">
                <button type="button" className="btn eco-nav-b" onClick={() => go(i - 1)} aria-label="Předchozí linie">
                  <IconArrowLeft size={20} stroke={2.2} aria-hidden="true" />
                </button>
                <button type="button" className="btn eco-nav-b" onClick={() => go(i + 1)} aria-label="Další linie">
                  <IconArrowRight size={20} stroke={2.2} aria-hidden="true" />
                </button>
              </div>

              <p className="eco-lead">{active.desc}</p>

              {/* Výpočet služieb je zoznam (user, 2026-08-17) a je to zoznam
                  ZO SYSTÉMU - `.biz-list--lg`, ten istý prvok ako odborné skúšky
                  nižšie na stránke. Vlastný recept by sa s ním raz rozišiel. */}
              <ul className="biz-list biz-list--lg eco-rows">
                {active.items.map((it, n) => (
                  <li key={it} style={{ '--i': n }}>
                    <IconCheck size={22} stroke={2.4} aria-hidden="true" />{it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
