# Allrisk web — prototyp

Klikací prototyp redesignu allrisk.cz (Vite + React + React Router).

## Spustenie lokálne
```bash
npm install
npm run dev      # http://localhost:5188
```

## Build
```bash
npm run build    # výstup do dist/ (vrátane 404.html pre SPA routing)
npm run lint     # eslint nad src/
```

## Pomenovania

Hranica medzi češtinou a angličtinou je zámerná — drž sa jej:

| Vrstva | Jazyk | Príklad |
|---|---|---|
| Viditeľný text | **česky** | `<h1>Pojištění vozidel</h1>` |
| URL a query parametre | **česky** (SEO) | `/vozidla`, `/pobocky/:slug`, `?tema=`, `?seg=rodiny` |
| Taxonomické kľúče v `src/data/` | **česky** (serializujú sa do URL) | `pojisteni`, `rodiny`, `podnikatele` |
| Názvy súborov a komponentov | **anglicky** | `Vehicles.jsx`, `BranchDetail.jsx`, `data/branches.js` |
| Premenné a funkcie | **anglicky** | `advisorsForBranch`, `advisorCountLabel` |
| CSS triedy | **anglicky** | `.veh-tab`, `.branch-row`, `.home-catgrid` |

Komentáre sú po slovensky. Obsahové dáta patria do `src/data/`, nie do page komponentov;
ikony sa v dátach uvádzajú ako **kľúč** (string) a na komponenty ich mapuje stránka.

## Publikovanie na GitHub Pages
```bash
npm run deploy   # zbuilduje a pushne dist/ do vetvy gh-pages
```
Potom v repo: **Settings → Pages → Source: branch `gh-pages` / root**.
Bežať bude na `https://<github-uzivatel>.github.io/allrisk-web-prototyp/`.

> Pozn.: `base` v `vite.config.js` musí zodpovedať názvu repa (`/allrisk-web-prototyp/`).
> Ak repo premenuješ, uprav `base`.
