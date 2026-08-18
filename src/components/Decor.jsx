import { asset } from '../asset.js'
import { makePicker } from './decorPick.js'

// ============================================================
// ZNAČKOVÁ DEKORÁCIA MODRÝCH PÁSOV.
//
// Dekorácia je OBRÁZOK, nie kód. Jeden súbor z /public/brand/decor = jedna
// vrstva cez pás, kladená na 100 % jeho plochy a v krytí, ktoré si nesie sám
// súbor. Kód sa do výtvarnej stránky nemieša: nemení veľkosť, nepresúva, ani
// nestlmuje. Kto chce iné rozostavenie, vymení súbor.
//
// Platí to pre oba prvky z tlačeného manuálu (profilspolecnosti.pdf) - biele
// vlásočnicové kružnice aj farebnú linku - a najmä pre plátno, kde sú oba
// naraz. Jeden pás preto potrebuje len jeden <Decor>.
//
// Patrí to na modré pole, a to aj na fotohero (user, 2026-08-16): fotka aj
// modrý závoj zostávajú, kresba je len ďalšia vrstva nad nimi. Vrstvenie to
// unesie bez zásahu - .decor je z-index 1 a v strome stojí za pseudoprvkom
// .photo-hero::before, takže sa kreslí nad závojom a pod sadzbou.
// Na bielej sekcii dekorácia čo robiť nemá - tam nesie značku eyebrow a nadpis.
// Pravidlá sú v DESIGN.md §5.
//
// STAV 2026-08-16: kružnice sedia na KAŽDOM modrom poli webu - všetky heroy
// a hlavičky podstránok (aj tie s fotkou), bannery na /, /o-nas a /blog
// a kontaktný pás. Jediná výnimka je videohero úvodu: cez pohyblivý záber by
// bola vlásočnica šmuha a video je signatúrou stránky samo o sebe.
// Farebnú stuhu kladie <Line> a od 2026-08-16 ju má tiež každé hero aj banner;
// kružnice sú pod ňou tichý podklad.
// ============================================================

// NÁHODNÉ PLÁTNO PRI KAŽDOM NAČÍTANÍ (user, 2026-08-17). Súbor si nevyberá
// call-site: štyri plátna sú štyri rozostavenia tých istých kružníc a ktorékoľvek
// smie stáť na ktoromkoľvek páse. Pomer plátna sa nerieši - `cover` v .decor
// mierku dorovná a prebytok oreže.
//
// Mechanika losovania je v decorPick.js - aj s tým, prečo sa nelosuje priamo
// v komponente a prečo dva pásy pod sebou nedostanú to isté plátno.
const RINGS = ['rings-band.svg', 'rings-form.svg', 'rings-head.svg', 'rings-hero.svg']
const useRings = makePicker(RINGS)

// Vloží sa do pásu PRED obsah - vrstvenie stojí na poradí v strome (viď
// komentár k .decor v index.css).
//   o    prebitie krytia, ak treba kresbu niekde tlmenejšiu
//   pos  object-position, ak sa má orez držať iného miesta než stredu
export function Decor({ o, pos }) {
  const img = useRings()
  const style = {}
  if (!img) return null
  if (o != null) style['--decor-o'] = o
  if (pos) style['--decor-pos'] = pos
  return (
    <img
      className="decor"
      style={Object.keys(style).length ? style : undefined}
      src={asset(`/brand/decor/${img}`)}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  )
}
