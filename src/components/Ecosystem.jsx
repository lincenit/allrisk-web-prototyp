import { useCallback, useRef, useState } from 'react'
import { asset } from '../asset.js'
import { LINES } from '../data/company.js'
import { SecHead } from './PageParts.jsx'
import { useDebugOption } from './DebugPanel.jsx'
import {
  IconArrowLeft, IconArrowRight, IconCheck,
  IconShield, IconBuildingEstate, IconCoins, IconLifebuoy, IconScale, IconSparkles,
} from '@tabler/icons-react'

// ============================================================
// EKOSYSTÉM - šesť obchodných línií, dve podoby (`dbg:eko4`).
//
//   kolo     PÔVODNÝ NÁVRH (user, 2026-08-18: „tú prvú variantu vráť ako sme ju
//            mali predtým, než som ťa poprosil o redizajn"). Kružnica na bielej
//            sekcii, bubliny s fotkou línie, text nalieha na vybraný kruh.
//            Zmazané: modrý pás cez celú šírku aj zvislá linka pri texte.
//   sloupec  Vľavo zvislý zoznam kategórií, vpravo detail (popis + služby).
//            Kategórie stoja na OBLÚKU kružnice, ktorý sa otáča: vybraná je vždy
//            vo vrchole a najväčšia (viď `arcAt` nižšie). Koliesko je fotka línie
//            s ikonou, presne ako bublina na kružnici - fotka je SÚČASŤ
//            KATEGÓRIE, nie detailu (user, 2026-08-18).
//
// ZMAZANÉ 2026-08-18 (user: „iba si vytvoril kopec ďalších zbytočných variant"):
// päť podôb, ktoré sa od `kolo` líšili len PODKLADOM POD TEXTOM - `sklo`,
// `deska`, `vypis`, `velky` a fotka ako podklad karty (`foto`). Boli to zámeny
// pozadia, nie návrhy. A po nich aj `pas` - modrý pás cez celú šírku okna.
//
// Karta NEMÁ NADPIS (user, 2026-08-18): meno línie stojí v bubline (`kolo`)
// alebo vo vybranom riadku zoznamu (`sloupec`), v detaile by bolo druhýkrát.
//
// ZMAZANÉ skôr, stále platí: ryhy na dráhe, čítacia hlava, rozmazanie počas
// otáčky, ťahanie so zotrvačnosťou, značka v strede kružnice, štyri statické
// rozvrhy bez kružnice, hustý riadok služieb oddelený bodkami.
// ============================================================

const COUNT = LINES.length
const STEP = 360 / COUNT

// Kategórie v podobe `sloupec` stoja NA OBLÚKU a ten sa OTÁČA (user, 2026-08-18:
// „malo by sa to rotovať a ten selektnutý by mal byť v strede stále a väčší -
// tým pádom nepotrebujeme ten background card efekt na select").
// Vybraná kategória teda stojí vždy vo vrchole oblúka a je najväčšia; ostatné
// sa od nej rozostupujú po dráhe a ku krajom sa zmenšujú. Výber tak nesie
// POLOHA A MIERKA, nie podfarbený riadok - preto pod vybraným nie je žiadne
// pole (bolo tam do tejto zmeny).
//
// Poradie je CYKLICKÉ: odstup sa počíta modulo šesť do rozsahu -3…+2, takže
// nad vrcholom aj pod ním stojí vždy niekto a rám nikdy nemá prázdnu polovicu.
// Kategória na -90° je za rámom (`out`) - je to tá, ktorá práve obieha zospodu
// nahor, a musí byť neviditeľná, inak by pri prepnutí preletela cez stred.
//
// Trigonometria je tu, mierka v CSS: uhol a jeho sínus/kosínus sú konštanty na
// index, polomer `--eco-arc-r` je responzívny, takže sa posun počíta až v `calc`.
const ARC_STEP = 30
const arcAt = (k, i) => {
  const half = Math.floor(COUNT / 2)
  const o = ((k - i + half + COUNT) % COUNT) - half
  const a = (o * ARC_STEP * Math.PI) / 180
  return {
    out: Math.abs(o) > 2,
    style: {
      // vrchol oblúka je najviac vpravo, susedia sa odsúvajú doľava (kosínus - 1)
      '--x': `calc(var(--eco-arc-r) * ${(Math.cos(a) - 1).toFixed(4)})`,
      '--y': `calc(var(--eco-arc-r) * ${Math.sin(a).toFixed(4)})`,
      // vzdialenosť od vrcholu (0 až 1) - podľa nej sa zmenšuje koliesko
      '--d': (Math.abs(o) / half).toFixed(3),
    },
  }
}

// Kľúč z data/company.js → ikona. Ten istý spôsob ako CHANNEL_ICONS na /o-nas:
// dáta nesú meno, obrázok si vyberá komponent.
const ECO_ICONS = {
  shield: IconShield, estate: IconBuildingEstate, coins: IconCoins,
  help: IconLifebuoy, scale: IconScale, club: IconSparkles,
}

export default function Ecosystem() {
  // Kľúč je `eko4`: zmazané hodnoty (`pas`, `foto`, `linka`, …) prežívajú
  // v localStorage a vyliezli by z neho ako neoštýlovaná sekcia.
  const [style] = useDebugOption('eko4', 'kolo')
  const [i, setI] = useState(0)
  // Uhol sa akumuluje, nepočíta sa modulo 360: prechod z poslednej línie na
  // prvú tak koleso dotočí dopredu o krok, a nie späť skoro cez celú kružnicu.
  const [rot, setRot] = useState(0)
  const nodes = useRef([])
  const kolo = style === 'kolo'

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
    <section className={`sec eco-sec eco-sec--${style}`}>
      <div className="wrap eco-in">
        <SecHead
          ey="Ekosystém"
          title={<>Ucelený unikátní <b>ekosystém Allrisk</b></>}
        />

        <div className="eco">
          {kolo ? (
            <div
              className="eco-ring" style={{ '--eco-rot': `${rot}deg` }}
              role="tablist" aria-label="Obchodní linie Allrisk" onKeyDown={onKey}
            >
              {/* Stuha nie je SVG: kreslí ju CSS ako kužeľový gradient orezaný
                  na prstenec, takže farba beží PO DRÁHE a nie cez štvorec okolo
                  nej. Stred, polomer aj hrúbku berie z tých istých premenných,
                  po ktorých sa rozostavujú uzly (about.css). */}
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
                      style={{ '--a': `${-k * STEP}deg`, '--eco-img': `url(${asset(l.img)})` }}
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
          ) : (
            // Zoznam kategórií je TÁ ISTÁ navigácia ako kružnica, len rozbalená
            // do stĺpca - preto tie isté role a tie isté klávesy.
            <div
              className="eco-rail" role="tablist" aria-orientation="vertical"
              aria-label="Obchodní linie Allrisk" onKeyDown={onKey}
            >
              {/* Oblúk stuhy. Je to celý kruh orezaný schránkou stĺpca - preto
                  vyzerá, že pokračuje von zhora aj zdola. Na úzkom okne sa
                  nekreslí, tam stuha ide rovno (viď about.css). */}
              <span className="eco-arc" aria-hidden="true" />
              {LINES.map((l, k) => {
                const Icon = ECO_ICONS[l.icon]
                const on = k === i
                const arc = arcAt(k, i)
                return (
                  <button
                    key={l.key} type="button" role="tab" id={`eco-tab-${l.key}`}
                    ref={(el) => { nodes.current[k] = el }}
                    aria-selected={on} aria-controls="eco-detail" tabIndex={on ? 0 : -1}
                    className={`eco-rail-b${on ? ' on' : ''}${arc.out ? ' out' : ''}`}
                    style={arc.style}
                    onClick={() => go(k)}
                  >
                    {/* Uzol stuhy: fotka línie, modrý závoj a ikona nad ním -
                        to isté zloženie ako bublina na kružnici. Prstenec je
                        vo farbe stránky a vyrezáva koliesku miesto v stuhe;
                        vybrané ho má z prelivu, takže doň stuha vteká. */}
                    <span className="pic">
                      <img src={asset(l.img)} alt="" loading="lazy" />
                      <Icon size={22} stroke={1.8} aria-hidden="true" />
                    </span>
                    <b>{l.label}</b>
                    <IconArrowRight size={20} stroke={2.2} className="ar" aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          )}

          <div
            className="eco-detail" id="eco-detail"
            role="tabpanel" aria-labelledby={`eco-tab-${active.key}`}
          >
            {/* `key` = líniu prekresli, nie prepíš: detail tak nabehne ako celok
                a výpočet služieb sa vysype po položkách. */}
            <div className="eco-detail-in" key={active.key}>
              {/* Detail nesie SADZBU, nie obrázok: fotka línie je súčasť
                  kategórie vľavo (user, 2026-08-18). */}
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

              {/* Šípky patria ku kružnici - v stĺpci je navigáciou samotný
                  zoznam kategórií a druhé ovládanie toho istého by len mátlo. */}
              {kolo && (
                <div className="eco-nav">
                  <button type="button" className="btn eco-nav-b" onClick={() => go(i - 1)} aria-label="Předchozí linie">
                    <IconArrowLeft size={20} stroke={2.2} aria-hidden="true" />
                  </button>
                  <button type="button" className="btn eco-nav-b" onClick={() => go(i + 1)} aria-label="Další linie">
                    <IconArrowRight size={20} stroke={2.2} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
