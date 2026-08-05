// Vizuálne varianty bloku „Co je dobré mít vyřešeno" (/profil/:slug).
// Markup je pre všetky maticové varianty ZHODNÝ (SolvedList v ProfileParts.jsx) –
// líšia sa čisto rozložením v CSS (.solved-*, viď pages/profile.css). Vďaka tomu sa
// dajú prepínať za behu a porovnať na tom istom profile bez ďalšej vetvy v komponente.
//
// Pozor pri porovnávaní: profily majú rôzne rozloženie úrovní (rodina 5/2/0,
// ostatné 2–3/2–3/1), takže variant treba pozrieť aspoň na /profil/rodina
// a /profil/sam-za-sebe – tam sa ukáže, ako znesie prázdnu a nevyváženú úroveň.
// (Skúšané a 2026-08-05 zahodené: „Osa" = Pásy so zvislou linkou vo farbe úrovne
// a „Tabulka" = hustá tabuľka s úrovňou ako medzihlavičkou.)
export const SOLVED_VARIANTS = [
  { value: 'sloupce', label: 'Sloupce' },
  { value: 'pasy', label: 'Pásy' },
  { value: 'puvodni', label: 'Původní' },
]

export const SOLVED_VARIANT_DEFAULT = 'sloupce'

// Farebná škála úrovní – nezávislá os od rozloženia, takže sa dá skúšať na ktoromkoľvek
// z variantov vyššie. Štýly ku každej hodnote sú v pages/profile.css (.solved-c-*).
//   semafor – klasický červená → žlutá → zelená, mapované RIZIKOVO (červená = Nutnost).
//             Ide proti DESIGN.md, kde je AllRed vyhradená pre „Nahlásit událost";
//             vedomé rozhodnutie používateľa z 2026-08-05.
//   zelena  – zelená → amber → šedá, bez červenej
//   modra   – váhová škála v značkovej modrej, jediná bez farieb mimo palety
export const SOLVED_COLORS = [
  { value: 'semafor', label: 'Semafor' },
  { value: 'zelena', label: 'Zelená' },
  { value: 'modra', label: 'Modrá' },
]

export const SOLVED_COLOR_DEFAULT = 'semafor'
