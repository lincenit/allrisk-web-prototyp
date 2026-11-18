# Ilustrácie z Tableru

Ilustrácie na celom webe pochádzajú z https://tabler.io/illustrations - rovnaká
rodina ako ikony z `@tabler/icons-react`, aby ikonová a ilustračná reč boli jedna.
**Len na test** - pred spustením webu treba kúpiť balík ($49, komerčná licencia)
a súbory nahradiť oficiálnymi SVG.

Sekcie si ilustráciu nedržia pod pôvodným tabler názvom: kópia ide do
`<sekcia>/<vyznamovy-nazov>.(svg|png)` (napr. `stories/rodina.svg`) a odkazuje sa
cez `asset('/illus/tabler/…')`.

## Vodoznak: pozor na veľkosť `lg`

Galéria skladá každú ilustráciu z troch rastrových vrstiev:

    https://tabler.io/illustrations/light/<nazov>-<velkost>-color.png    maska modrej
    https://tabler.io/illustrations/light/<nazov>-<velkost>-skin.png     maska pleti
    https://tabler.io/illustrations/light/<nazov>-<velkost>-shadows.png  kresba

Veľkosť `lg` (800x600) má **v kresbe vodoznak „tabler"**. Veľkosť `md` (504x378)
je čistá - odtiaľ sa berie. Väčšie rozlíšenie bez vodoznaku neexistuje.

Skladajú sa tak, ako to robí ich komponent `ColoredIllustration`: `color` a `skin`
sú alfa masky vyliate farbou (`#066FD1` = `--tblr-color-accent`, `#FFCB9D` =
`--tblr-illustrations-skin`), `shadows` je hotová kresba navrchu. Farby sú teda
masky, nie natvrdo - po kúpe balíka sa modrá prepne na značkovú jedným tokenom.

504px stačí: `.illus-img` má `max-height:340px`, teda ~453px na šírku.

Takto vznikli `podnikatele/spoluprace.png` (contract) a `podnikatele/pece.png` (chart).

## Bez vodoznaku aj v `lg`

Deväť kusov dáva Tabler na stránke ako inline SVG, tie sú čisté v plnej veľkosti:

`boy-and-cat` · `boy-girl` · `boy-with-key` · `computer-fix` · `good-info` ·
`good-news` · `icons` · `not-found` · `shopping`

Preto sú `stories/*.svg` a `podnikatele/likvidace.svg` práve z tejto deviatky.
