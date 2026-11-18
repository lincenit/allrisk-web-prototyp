# Fotky klientských profilů

Podklad pod hero na `/profil/:slug` – název souboru = `slug` profilu z `src/data/profiles.js`.
Hero je vykresluje černobíle pod modrým overlayem, takže rozhoduje kompozice a střední tóny,
ne barevnost. Ideální je širší situační záběr (ne těsný portrét), člověk spíš vpravo od středu –
vlevo sedí text.

Aktuálně jsou to **dočasné fotky z Unsplashe** (Unsplash License – volné i pro komerční užití,
bez povinné atribuce). Až budou k dispozici vlastní fotky Allrisku, stačí soubory přepsat
stejnými názvy, v kódu se nic neměnní.

| Soubor | Archetyp | Unsplash ID |
|---|---|---|
| `mlada-rodina.jpg` | Jana a Tomáš, 32 let – mladí rodiče v novém bytě | `1713942590368-09cfc6ae94ce` |
| `podnikatel.jpg` | Martin, 41 let – majitel se zaměstnancem ve skladu | `1664382953403-fc1ac77073a0` |
| `rodina-v-nejlepsich-letech.jpg` | Eva a Petr, 45 let – rodina s dospívajícími dětmi | `1529518152792-d08317b26e22` |
| `pred-penzi.jpg` | Pavel, 63 let – muž v důchodovém věku | `1566761284295-af58908238bb` |

Staženo jako 1920×1080, q=72 (`fit=crop&crop=faces,entropy`), cca 200–480 kB / kus.
