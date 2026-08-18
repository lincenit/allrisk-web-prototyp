import { useState } from 'react'
import { Link } from 'react-router-dom'
import './wireframe.css'
import './blog.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { SecHead } from '../components/PageParts.jsx'
import { Decor } from '../components/Decor.jsx'
import { Line } from '../components/Line.jsx'
import { ArticleCard } from '../components/ArticleParts.jsx'
import { ARTICLES, RUBRICS, PRINT, HERO_PHOTO } from '../data/blog.js'
import { IconChevronRight, IconDownload, IconArrowUpRight } from '@tabler/icons-react'

// Filtre podľa rubriky - zoznam sa skladá z dát, nech nezostarne pri pridaní článku.
const ALL = 'Vše'

export default function Blog() {
  const [rub, setRub] = useState(ALL)
  // hlavička je nad fotkou, takže header musí byť hore priehľadný (ako na /vozidla)
  useHeroHeader()

  // ponúkame len rubriky, v ktorých nejaký článok naozaj je
  const used = RUBRICS.filter((r) => ARTICLES.some((a) => a.rubric === r.key))
  const shown = rub === ALL ? ARTICLES : ARTICLES.filter((a) => a.rubric === rub)

  return (
    <div className="site">
      {/* ============ 1 · HLAVIČKA STRÁNKY ============ */}
      {/* Foto pod modrým gradientom - ten istý recept ako každý foto-hero na webe
          (.photo-hero z wireframe.css). Bez eyebrowu: „Blog" už nesie drobečková
          navigácia aj titulok, tretíkrát to isté slovo je len šum. */}
      <section className="page-head photo-hero">
        <div className="photo-hero-bg" style={{ backgroundImage: `url(${HERO_PHOTO})` }} aria-hidden="true" />
        <Decor />
        <Line pos="hero" />
        <div className="wrap">
          <nav className="page-crumb">
            <Link to="/">Domů</Link><IconChevronRight size={14} stroke={2} /><b>Blog</b>
          </nav>
          <SecHead
            level={1}
            title={<>Co se právě děje v <b>pojištění, financích a realitách</b></>}
            lead="Praktické návody, vysvětlení a rozhovory od lidí, kteří to řeší denně s klienty. Bez marketingových frází a bez pojišťovácké hantýrky."
          />
        </div>
      </section>

      {/* ============ 2 · ALLRISK MAGAZÍN (tištěné vydání) ============ */}
      {/* Stojí hore, nie dole: je to jedna vec do roka, nie ďalší článok v poradí.
          Blog pod ním je potom homogénny - samé rovnaké karty.
          Tvar je ten istý pás ako „Věděli jste, že…?" na úvode: text vľavo,
          značková linka vpravo. Žiadna vlastná varianta banneru. */}
      <section className="sec wrap">
        <div className="banner">
          <Decor />
          <Line />
          <div className="banner-tx">
            <h2>{PRINT.title}</h2>
            <p>{PRINT.lead}</p>
            <div className="banner-cta">
              <a className="btn" href={asset(PRINT.pdf)} download>
                Stáhnout magazín <IconDownload size={18} stroke={2.2} />
              </a>
              {/* TODO(obsah): archív ročeniek zatiaľ nemá vlastnú stránku */}
              <a className="btn line" href="#archiv">
                Archiv <IconArrowUpRight size={18} stroke={2.2} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3 · RUBRIKY + VÝPIS ============ */}
      <section className="sec wrap blog-list">
        {/* rovnaký rad filtrov ako na /reference - jeden tvar chipu pre celý web */}
        <div className="ref-filter" role="tablist" aria-label="Filtr rubrik">
          <button
            type="button" role="tab" aria-selected={rub === ALL}
            className={`ref-chip ${rub === ALL ? 'on' : ''}`} onClick={() => setRub(ALL)}
          >{ALL}</button>
          {used.map((r) => (
            <button
              key={r.key} type="button" role="tab" aria-selected={rub === r.key}
              className={`ref-chip ${rub === r.key ? 'on' : ''}`} onClick={() => setRub(r.key)}
            >{r.label}</button>
          ))}
        </div>

        {/* Žiadny „hlavný" článok navrchu - všetky rovnaké karty, poradie robí dátum. */}
        <div className="blog-grid">
          {shown.map((a) => <ArticleCard key={a.slug} a={a} />)}
        </div>
      </section>

      <ContactBand />
      <SiteFooter />
    </div>
  )
}
