import { Link, useParams } from 'react-router-dom'
import './wireframe.css'
import './blog.css'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { SecHead } from '../components/PageParts.jsx'
import { Decor } from '../components/Decor.jsx'
import { Line } from '../components/Line.jsx'
import {
  ArticleBody, ArticleToc, AuthorCard, BlogSection, ArticleProductCard, ArticleMeta,
} from '../components/ArticleParts.jsx'
import { articleBySlug, relatedArticles } from '../data/blog.js'
import { IconArrowLeft, IconArrowUpRight } from '@tabler/icons-react'

export default function ArticleDetail() {
  const { slug } = useParams()
  const a = articleBySlug(slug)
  useHeroHeader(!!a)

  if (!a) {
    return (
      <div className="site">
        <section className="wrap notfound">
          <h1>Článek nenalezen</h1>
          <p>Takový článek na blogu nemáme - možná se přejmenoval.</p>
          <Link to="/blog" className="btn fill">Zpět na blog <IconArrowUpRight size={18} stroke={2.2} /></Link>
        </section>
        <SiteFooter />
      </div>
    )
  }

  // štyri, nie tri - rad ukáže tri a štvrtá dá šípkam čo posúvať (rovnako ako pod produktom)
  const related = relatedArticles(a, 4)

  return (
    <div className="site">
      {/* ============ 1 · HLAVIČKA ČLÁNKU ============ */}
      {/* Fotka článku je podklad hlavičky, nie samostatný pás pod ňou - nadpis tak
          stojí rovno v nej. Hore len tlačidlo späť; eyebrow ani autor tu nie sú,
          rubriku aj dátum nesie jeden riadok metadát pod perexom. */}
      <section className="page-head photo-hero">
        <div className="photo-hero-bg" style={{ backgroundImage: `url(${a.img})` }} aria-hidden="true" />
        <Decor />
        <Line pos="hero" />
        <div className="wrap">
          <Link to="/blog" className="blog-back">
            <IconArrowLeft size={18} stroke={2.2} aria-hidden="true" /> Zpět na blog
          </Link>
          {/* bez perexu - titulok a riadok metadát stačia, perex je prvý odstavec textu */}
          <SecHead level={1} title={a.title} className="blog-art-h">
            <ArticleMeta a={a} long dark />
          </SecHead>
        </div>
      </section>

      {/* ============ 2 · TĚLO ČLÁNKU + BOČNÍ SLOUPEC ============ */}
      <section className="sec wrap">
        <div className="blog-art">
          <article>
            <ArticleBody body={a.body} />
          </article>

          {/* Bočný stĺpec nesie tri sprievodné veci: kde v texte som, kto to píše
              a čoho sa to týka. Všetky tri v rovnakej tichej škatuľke - sú to
              údaje vedľa článku, nie druhý koniec článku. Ďalšie články stoja
              dole cez celú šírku, aby sa neopakovali dvakrát na jednej obrazovke. */}
          <aside className="blog-aside">
            <ArticleToc body={a.body} />
            <AuthorCard slug={a.author} />
            <ArticleProductCard productKey={a.product} />
          </aside>
        </div>
      </section>

      {/* ============ 3 · DALŠÍ ČLÁNKY ============ */}
      {/* Tá istá sekcia ako pod produktom - rovnaké karty, rovnaké šípky, rovnaký
          odkaz „Zobrazit vše". Líši sa len titulok. */}
      <section className="sec wrap">
        <BlogSection items={related} title={<>Co číst <b>dál</b></>} />
      </section>

      <ContactBand />
      <SiteFooter />
    </div>
  )
}
