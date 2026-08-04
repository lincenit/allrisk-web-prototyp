// Kde má produkt v prototype reálnu stránku. Zvyšok zatiaľ vedie na kontakt
// s predvyplnenou témou — žiadny odkaz v menu nesmie končiť naprázdno.
const ROUTES = {
  Vozidla: '/vozidla',
  'Pojištění vozidel': '/vozidla',
  'Flotila vozidel': '/vozidla',
  'Vozidla / flotily': '/vozidla',
}

export const routeFor = (label) => ROUTES[label] || `/kontakt?tema=${encodeURIComponent(label)}`
// Má produkt vlastnú stránku? Podľa toho sa mení text CTA – „Zobrazit produkt"
// sľubuje stránku produktu, takže ho nesmieme dať nad odkaz na kontakt.
export const hasRoute = (label) => Boolean(ROUTES[label])
