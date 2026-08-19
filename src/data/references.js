// Klientské reference - zdroj pre carousel na úvode aj pre stránku /reference.
// TODO(obchod): nahradiť reálnymi citáciami (meno + súhlas klienta). Texty sú zatiaľ lorem placeholder,
// zámerne rôzne dlhé, aby sa dal odladiť layout kartičiek.
const L1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
const L2 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'
const L3 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

// Foto pod hlavičkou /reference - dočasne z Unsplashe, rovnako ako fotky blogu
// a pobočiek. Až budú vlastné fotky Allrisku, mení sa jediný riadok.
export const HERO_PHOTO = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1800&q=70'

// Pod menom je dátum recenzie, nie „klient od 2019" - u referencie je podstatné, kdy
// hodnocení vzniklo (jak je čerstvé), ne jak dlouho u nás klient je.
// TODO(obchod): fotky sú z Unsplashe, rovnako ako fotky blogu, pobočiek a hlavičky
// /reference - portréty NIE SÚ skutoční klienti. Menia sa spolu s citáciami, keď
// klient dodá reálne hodnotenia so súhlasom. `av` (iniciály) zostáva ako záloha:
// keď fotka chýba alebo sa nenačíta, kolečko ju má čím vyplniť.
const face = (id) => `https://images.unsplash.com/${id}?auto=format&fit=facearea&facepad=2.6&w=160&h=160&q=70`

// Poradie je od najnovšej - tak sa referencie čítajú aj v carouseli na úvode.
export const REFERENCES = [
  { av: 'JN', name: 'Jan N.', date: '12. 6. 2026', tag: 'Pojištění vozidel', stars: 5, text: L2, photo: face('photo-1500648767791-00dcc994a43e') },
  { av: 'EM', name: 'Eva M.', date: '28. 5. 2026', tag: 'Hypotéka', stars: 5, text: L1, photo: face('photo-1494790108377-be9c29b29330') },
  { av: 'PK', name: 'Petr K.', date: '4. 5. 2026', tag: 'Likvidace škody', stars: 5, text: L3, photo: face('photo-1506794778202-cad84cf45f1d') },
  { av: 'LS', name: 'Lucie S.', date: '19. 3. 2026', tag: 'Pojištění nemovitosti', stars: 5, text: L2, photo: face('photo-1544005313-94ddf0286df2') },
  { av: 'MH', name: 'Martin H.', date: '27. 2. 2026', tag: 'Reality', stars: 4, text: L3, photo: face('photo-1507003211169-0a1dd7228f2d') },
  { av: 'VD', name: 'Veronika D.', date: '11. 2. 2026', tag: 'Investice', stars: 5, text: L1, photo: face('photo-1580489944761-15a19d654956') },
  { av: 'TR', name: 'Tomáš R.', date: '8. 12. 2025', tag: 'Revize smluv', stars: 5, text: L3, photo: face('photo-1519085360753-af0119f7cbe7') },
  { av: 'AB', name: 'Alena B.', date: '21. 10. 2025', tag: 'Životní pojištění', stars: 5, text: L2, photo: face('photo-1534528741775-53994a69daeb') },
  { av: 'ZP', name: 'Zdeněk P.', date: '3. 9. 2025', tag: 'Energie a tarify', stars: 4, text: L1, photo: face('photo-1472099645785-5658abf4ff4e') },
]

// Koľko hodnotení firma má. Kartičky vyššie sú VÝBER zverejnených citácií, nie
// všetko - deväť kariet neznamená deväť hodnotení, a úvod by tým tvrdil o firme
// niečo, čo nie je pravda (user, 2026-08-19: „to číslo daj oveľa väčšie").
// TODO(obchod): doplniť reálny počet z hodnotiaceho portálu (Google, Firmy.cz).
export const REVIEWS_TOTAL = '2 400'

// Na úvode ukazujeme len prvú vlnu - zvyšok je na /reference.
export const REFERENCES_HOME = REFERENCES.slice(0, 6)
