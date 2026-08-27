import './NumbersBand.css'
import { numbers } from '../data/company.js'
import { Decor } from './Decor.jsx'
import { Line } from './Line.jsx'

// ============================================================
// ALLRISK V ČÍSLECH - modrý pás s dlaždicami.
//
// SEKCIU SI NESIE KOMPONENT SÁM (`<section class="sec wrap">`), rovnako ako
// ekosystém: pás nesú od 2026-08-27 DVE MIESTA - /o-nas a úvod. Do tej zmeny
// stál len na /o-nas priamo v stránke; user ho vypýtal aj na úvod pod
// „Proč Allrisk?" a čísla sa majú upravovať na jednom mieste (data/company.js
// -> NUMBERS), nie v dvoch kópiách sadzby.
//
// V tlači je to jedna modrá strana: vpravo tabuľka „O společnosti", pod ňou
// dlaždice s číslami. Tu je to jeden pás v rovnakom poradí.
//
// Líši sa JEDINE hlavička (`ey`, `title`) - /o-nas je profil firmy, úvod je
// dôkaz pod argumentom. Čísla aj ich poradie sú na oboch miestach tie isté.
//
// Dekoráciu má pás vždy - kružnice aj stuhu. To je pravidlo každého modrého
// poľa na webe (user, 2026-08-16), nie vlastnosť stránky, takže sa o ňu volajúci
// nestará.
//
// ZMAZANÉ podoby pásu (presunuté sem 2026-08-27 z /o-nas, kde pás dovtedy
// stál sám):
//   2026-08-17  os „Dlaždice" s voľbou `riadok` (popis vedľa čísla na jednej
//               svislici). Zostáva popis POD číslom, teda jediný rozvrh
//               dlaždice - prepínač s jednou hodnotou nie je voľba.
//   2026-08-17  značkové gesto na veľkej dlaždici „2003" (žiara pod číslom /
//               stuha po boku). Dlaždica je sklo ako susedia, len väčšie;
//               jediné, čo ju povyšuje, je mierka sadzby.
//   2026-08-19  os „Rozvrh pásu" (`pod` / `nadpis` / `vedla`): PÁS MÁ NADPIS
//               NAD DLAŽDICAMI, bodka. S nadpisom vľavo museli dlaždice do
//               dvoch stĺpcov a z ôsmich čísel bol vysoký stĺpec vedľa
//               krátkeho nadpisu - pás prestal byť pásom.
//
// ZMAZANÉ 2026-08-17 (user): tiráž pod dlaždicami (.ab-facts) - právna forma,
// základné imanie, limit odpovědnosti, statutárne orgány, dozorná rada a obe
// centrály. Pás nesie čísla, ktoré niečo tvrdia; údaje z rejstříku vedľa nich
// argument neniesli. Dáta zostávajú v company.js (FACTS, OFFICES).
// ============================================================

// OSEM ROVNAKÝCH DLAŽDÍC v poradí od usera (2026-08-27). Veľká dlaždica cez dva
// riadky tu už nie je: osem kusov a jedna z nich cez dva riadky je deväť buniek,
// čo sa do štyroch stĺpcov nezmestí. Osem rovnakých vyplní 4 × 2 presne.
const ORDER = numbers('naTrhu', 'klienti', 'pojistne', 'uvery', 'vypujcky', 'poradci', 'skody', 'pobocky')

export default function NumbersBand({
  ey = 'O společnosti',
  title = <>Čísla, která za nás <b>mluví</b></>,
  id,
}) {
  return (
    <section id={id} className="sec wrap">
      {/* modrý pás je spoločný .banner - tu len jeho vnútorný rozvrh */}
      <div className="banner nums-band">
        <Decor />
        <Line />
        <div className="nums-head">
          <span className="ey">{ey}</span>
          <h2>{title}</h2>
        </div>
        <div className="nums">
          {/* Dlaždica sa číta zhora nadol ako veta: „Více než | 78 000 výpůjček |
              vozů z autopůjčovny Allrisk". Riadok nad číslom má len tá, ktorá
              ho v znení má - obsah sa kvôli rovnakému tvaru nedopĺňa. */}
          {ORDER.map((n) => (
            <div className="num" key={n.label}>
              {n.pre && <span className="c">{n.pre}</span>}
              <b>{n.value}</b>
              <span className="c">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
