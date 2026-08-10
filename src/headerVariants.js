// Dve verzie hornej lišty. Rozdiel nie je kozmetický - je to iná odpoveď na
// otázku, či publikum patrí do navigácie, alebo dovnútra jedného panelu.
//
//   prepinac - tak, ako lišta fungovala predtým: jedna položka „Produkty"
//              a výber publika až v paneli (modrý bočný stĺpec). Rodiny
//              a Města ukazujú katalóg, Podnikatelé systém péče.
//              Lišta zostáva krátka, publikum je o klik ďalej.
//   polozky  - každé publikum má vlastnú položku v lište. „Jednotlivci
//              a rodiny" ide celým názvom, takže je to najdlhší riadok,
//              aký lišta unesie; Podnikatelé preto NIE SÚ rozbaľovacie,
//              ale rovno preklik na /podnikatele - ušetrí to chevron aj
//              panel a zodpovedá tomu, že tam nejde o výber produktu.
export const HDR_VARIANTS = [
  { value: 'prepinac', label: 'Přepínač' },
  { value: 'polozky', label: 'Položky' },
]
export const HDR_DEFAULT = 'prepinac'
