# Obrázky blogu

Obálky článků jsou vlastní obálky článků z allrisk.cz (`<slug>.webp`, převedené z originálů
CMS na šířku 1400 px). Článek na ni ukazuje v `src/data/blog.js`:

```js
img: asset('/blog/podpojisteni-vozidla-2026.webp'),
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
