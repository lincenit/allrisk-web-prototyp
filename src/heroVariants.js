/* Hero úvodu („/" pre jednotlivcov a rodiny) - DVE PODOBY (user, 2026-08-19:
   „chcem mať prepínač na hero sekciu - video / classic").

     video    značková slučka ako kulisa cez celú šírku okna. Bez tvrdenia
              a bez cesty ďalej - je to nálada, nie argument. PREDVOLENÉ.
     classic  bežné hero: motto, veta, čísla, hodnotenie a dve tlačidlá vľavo,
              video vpravo ako karta so spúšťacím tlačidlom. Video tu nie je
              kulisa, ale prvok - kým stojí, premietajú sa na ňom zábery z neho.

   NA TELEFÓNE JE PODOBA `video` ROZHODNUTÁ (user, 2026-08-19: „pri variante
   video musí byť Pás pod hlavičkou na mobile"). Video je 16:9, takže pri 390px
   širokom okne má 219px na výšku a hlavička (48 pás publík + 80 lišta = 128px)
   by z neho zakryla viac než polovicu vrátane vlastného titulku videa. Preto
   video začína POD hlavičkou a pás je vyšší, 27:20: boky sa orežú, ostáva vidieť
   ~76 % šírky a titulok videa sa doň zmestí. Orezom sa to vyriešiť nedá -
   schránka je na telefóne užšia než pomer videa, takže `cover` reže boky a celú
   výšku ukáže; vyšší pás by záber len zväčšil a titulok by zostal v hornej
   štvrtine, teda pod hlavičkou.

   ZMAZANÉ 2026-08-19 (user: „vyčisti tie varianty"): os `dbg:vidm`, ktorá týchto
   „kde video na telefóne začína" ponúkala štyri - `pas` je z nej rozhodnutý stav
   podoby `video`, `obsah` je dnešná podoba `classic`, a `karta` (video v ráme zo
   značkového gradientu) aj `prekryv` (video od vrchu okna, hlavička naň ľahla)
   sú preč. Skôr v ten istý deň z nej odišli `pod`, `posun` a `skryta`. Sú v gite.

   Nad 700px sa podoba `video` nemení: pri 900px má video 506px a hlavička je
   z neho štvrtina. Hodnota je trieda na sekcii (`.wf-hero--classic`), nie značka
   na <html> - meniť sa má hero, nie dokument. Štýly sú v pages/wireframe.css. */
export const HERO_VARIANTS = [
  { value: 'video', label: 'Video' },
  { value: 'classic', label: 'Classic' },
]

export const HERO_DEFAULT = 'video'

// Voľba prežíva v localStorage (useDebugOption), takže tam po zmazaní podoby
// môže ostať hodnota, ku ktorej už nie sú štýly - neznáma sa ticho vráti na
// predvolenú. Kľúč je `hero`, nie starý `vidm`: hodnoty tej osi (`pas`, `karta`,
// `prekryv`) by tu inak vyliezli z localStorage ako neznáme.
export const heroVariant = (v) =>
  HERO_VARIANTS.some((o) => o.value === v) ? v : HERO_DEFAULT
