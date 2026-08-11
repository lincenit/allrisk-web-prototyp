// Verzie hornej lišty. Rozdiel nie je kozmetický - každá je iná odpoveď na
// otázku, či publikum (jednotlivci a rodiny / podnikatelé / města a obce)
// patrí do navigácie, a ak áno, čo tomu v lište ustúpi.
//
//   prepinac - jedna položka „Produkty" a výber publika až v paneli (modrý
//              bočný stĺpec). Lišta zostáva krátka, publikum je o klik ďalej.
//   pas      - každé publikum má vlastnú položku, ale utility (Společnost,
//              Kontakt, hľadanie, účet) odchádza do tenkého pásu nad lištu.
//              Hlavná lišta tak nesie len logo, tri publiká plnými názvami
//              a „Nahlásit škodu". Cena je výška hlavičky.
//   kontext  - publikum nie je cieľ, ale kontext: prepínač stojí pri položke
//              „Produkty" a je vidieť aj so zavretým menu. Výber platí pre
//              celý web (src/segment.js), nie len pre menu.
//   karty    - lišta ako „prepinac", ale panel začína tromi kartami publík na
//              plnú šírku namiesto úzkeho bočného stĺpca.
//
// ZMAZANÉ 2026-08-11: verzia „polozky" (tri publiká priamo v lište, bez pásu).
// Zmestila sa len tak-tak - 1103 z 1124 dostupných po tom, čo obetovala širší
// hover aj deliacu čiaru, a pod 1140px sa musela zložiť do burgera. „Kebyže
// pridáme niečo ďalšie, už to nemá miesto" (user), a to je na hlavnú navigáciu
// príliš krehké. Tri publiká v lište žijú ďalej vo verzii „pas", ktorá si na ne
// miesto poctivo vytvorila.
//
// Vo VŠETKÝCH verziách vedú Podnikatelé na /podnikatele a nikde neotvárajú
// katalóg: klient nechcel podnikateľom tlačiť produkty, ich vstupom je systém
// péče na vlastnej stránke.
// „karty" sú predvolená verzia (user, 2026-08-11), takže stoja aj prvé
// v prepínači - inak by prvá voľba v rade nebola tá, ktorú človek vidí.
export const HDR_VARIANTS = [
  { value: 'karty', label: 'Karty' },
  { value: 'prepinac', label: 'Přepínač' },
  { value: 'pas', label: 'Dva pásy' },
  { value: 'kontext', label: 'Kontext' },
]
export const HDR_DEFAULT = 'karty'

// Verzie, kde lišta nesie JEDNU položku „Produkty" a publikum sa vyberá inde.
// Rozhoduje o kostre lišty aj o mobilnom drawri (prepínač publika nad jedným
// akordeónom namiesto dvojúrovňového).
export const HDR_ONE_ITEM = ['prepinac', 'karty', 'kontext']

// Zmazaná verzia môže zostať v localStorage z minulej návštevy - vtedy by sa
// lišta vykreslila podľa kostry, ktorej CSS už neexistuje.
export const hdrVariant = (value) => (
  HDR_VARIANTS.some((v) => v.value === value) ? value : HDR_DEFAULT
)
