// Blok článkov pod produktom - koľko priestoru článok na produktovej stránke unesie.
// Zoznam žije mimo stránok z toho istého dôvodu ako tabVariants.js: prepínač patrí
// do ladiaceho panelu na /vozidla aj kdekoľvek inde, kde blok pribudne.
// Štýly k hodnotám sú v pages/blog.css (.blog-prod-*).
//
// Výpis na /blog vlastné varianty nemá - rozhodnuté 2026-08-10, sú to len karty.
export const BLOG_PROD_VARIANTS = [
  { value: 'rad', label: 'Řada karet' },
  { value: 'hlavni', label: 'Hlavní + odkazy' },
]
export const BLOG_PROD_DEFAULT = 'rad'
