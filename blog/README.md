# Obrázky blogu

Obálky článků jsou **dočasné fotky z Unsplashe** (Unsplash License – volné i pro komerční
užití, bez povinné atribuce) a jsou zapsané přímo v `src/data/blog.js` přes helper
`photo('<unsplash-id>')` – stejně jako fotky poboček v `src/data/branches.js`.

Až budou vlastní fotky Allrisku, stačí u článku vyměnit jediný řádek:

```js
img: photo('1503376780353-7e6692767b70'),   // → img: '/blog/podpojisteni-vozidla.jpg',
```

Doporučené rozměry vlastních fotek: **1600 × 1000** (poměr 16:10), do ~250 kB.
Hero na detailu článku fotku ořezává na širší pás a překrývá modrým gradientem,
takže rozhoduje kompozice a střední tóny – podstatné patří doprava od středu,
vlevo sedí titulek.

Do téhle složky patří soubory tištěného vydání:

| Soubor | K čemu |
|---|---|
| `obalka-2026.jpg` | Obálka ročenky na výšku (poměr 3:4), pás „Allrisk Magazín" na `/blog` |
| `allrisk-magazin-2026.pdf` | PDF ročenky ke stažení (`PRINT.pdf`) |

Dokud obálka chybí, drží místo modrý podklad s ikonou – nic se nerozbije.
