// Klientské reference – zdroj pre carousel na úvode aj pre stránku /reference.
// TODO(obchod): nahradiť reálnymi citáciami (meno + súhlas klienta). Texty sú zatiaľ lorem placeholder,
// zámerne rôzne dlhé, aby sa dal odladiť layout kartičiek.
const L1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
const L2 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'
const L3 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

// Pod menom je dátum recenzie, nie „klient od 2019" – u referencie je podstatné, kdy
// hodnocení vzniklo (jak je čerstvé), ne jak dlouho u nás klient je.
// Poradie je od najnovšej – tak sa referencie čítajú aj v carouseli na úvode.
export const REFERENCES = [
  { av: 'JN', name: 'Jan N.', date: '12. 6. 2026', tag: 'Pojištění vozidel', stars: 5, text: L2 },
  { av: 'EM', name: 'Eva M.', date: '28. 5. 2026', tag: 'Hypotéka', stars: 5, text: L1 },
  { av: 'PK', name: 'Petr K.', date: '4. 5. 2026', tag: 'Likvidace škody', stars: 5, text: L3 },
  { av: 'LS', name: 'Lucie S.', date: '19. 3. 2026', tag: 'Pojištění nemovitosti', stars: 5, text: L2 },
  { av: 'MH', name: 'Martin H.', date: '27. 2. 2026', tag: 'Reality', stars: 4, text: L3 },
  { av: 'VD', name: 'Veronika D.', date: '11. 2. 2026', tag: 'Investice', stars: 5, text: L1 },
  { av: 'TR', name: 'Tomáš R.', date: '8. 12. 2025', tag: 'Revize smluv', stars: 5, text: L3 },
  { av: 'AB', name: 'Alena B.', date: '21. 10. 2025', tag: 'Životní pojištění', stars: 5, text: L2 },
  { av: 'ZP', name: 'Zdeněk P.', date: '3. 9. 2025', tag: 'Energie a tarify', stars: 4, text: L1 },
]

// Na úvode ukazujeme len prvú vlnu – zvyšok je na /reference.
export const REFERENCES_HOME = REFERENCES.slice(0, 6)
