import { Link } from 'react-router-dom'
import {
  IconShield, IconBuildingSkyscraper, IconChartLine, IconUsers,
  IconArrowRight, IconCircleCheck, IconQuote, IconInfoCircle,
} from '@tabler/icons-react'
import { advisorBySlug, initials } from '../data/branches.js'
import {
  rubricLabel, rubricIconKey, formatDate, formatDateShort, readLabel, headingId,
  articlesFor,
} from '../data/blog.js'
import { productHref, productLabel, productHasPage, PRODUCTS_META } from '../data/profiles.js'
import { Icon } from './ProfileParts.jsx'
import { CarouselSection, CarouselHead, CarouselFoot } from './Carousel.jsx'

// Ikona rubriky - kľúč z data/blog.js -> tabler komponent (dáta zostávajú bez Reactu).
const RUBRIC_ICONS = {
  shield: IconShield, building: IconBuildingSkyscraper, chart: IconChartLine, users: IconUsers,
}

// Obálka článku. Fotka je NAD podkladom, nie namiesto neho: keď sa nenačíta
// (alebo ju klient vymení za vlastnú a súbor ešte nie je na mieste), zostane
// modrý podklad s ikonou rubriky a karta nespadne do prázdneho rámu.
export function ArticleCover({ a, className = '' }) {
  const C = RUBRIC_ICONS[rubricIconKey(a.rubric)] || IconShield
  return (
    <span className={`blog-cover ${className}`.trim()} aria-hidden="true">
      <span className="blog-cover-ic"><C size={44} stroke={1.3} /></span>
      <span className="blog-cover-ph" style={{ backgroundImage: `url(${a.img})` }} />
    </span>
  )
}

// Rubrika + dátum + doba čítania. Jediný tvar metadát v celom blogu -
// na karte aj v hlavičke detailu.
export function ArticleMeta({ a, long, dark }) {
  return (
    <span className={`blog-meta${dark ? ' on-dark' : ''}`}>
      <span className="blog-rub">{rubricLabel(a.rubric)}</span>
      <span className="blog-dot" />
      <span>{long ? formatDate(a.date) : formatDateShort(a.date)}</span>
      <span className="blog-dot" />
      <span>{readLabel(a.read)}</span>
    </span>
  )
}

// Karta článku - JEDINÝ tvar karty v celom blogu (výpis, blok pod produktom aj
// pod článkom): obálka, metadáta a titulok. Bez perexu, bez tlačidla „Přečíst"
// a bez štítku podproduktu - titulok článku povie, o čo ide, a odkazom je celá karta.
//   md - bežná karta
//   lg - jeden článok naplno, obálka vedľa textu (variant „hlavní" pod produktom)
export function ArticleCard({ a, size = 'md' }) {
  return (
    <Link to={`/blog/${a.slug}`} className={`blog-card blog-card-${size}`}>
      <ArticleCover a={a} />
      <span className="blog-card-tx">
        <ArticleMeta a={a} />
        <b>{a.title}</b>
      </span>
    </Link>
  )
}

// Autor článku = konkrétny poradca z branches.js, nie redakcia.
// Tvar karty je prevzatý z reality webu (components/BrokerCard.tsx): štvorcový
// portrét 80 px vľavo, meno a rola vpravo, celá karta je odkaz na jeho stránku.
export function AuthorCard({ slug, title = 'Autor článku' }) {
  const p = advisorBySlug(slug)
  if (!p) return null
  return (
    <div className="blog-aside-part">
      <span className="blog-aside-t">{title}</span>
      <Link to={`/poradce/${p.slug}`} className="blog-author">
        <span className="av">{initials(p.name)}</span>
        <span className="tx">
          <b>{p.name}</b>
          <small>{p.role}</small>
        </span>
      </Link>
    </div>
  )
}

// Obsah článku - skladá sa z nadpisov v tele, žiadny druhý zoznam sa neudržiava.
export function ArticleToc({ body }) {
  const heads = body.map((b, i) => ({ b, i })).filter(({ b }) => b.t === 'h')
  if (heads.length < 2) return null
  return (
    <nav className="blog-aside-part blog-toc" aria-label="Obsah článku">
      <span className="blog-aside-t">Obsah článku</span>
      <ol>
        {heads.map(({ b, i }) => (
          <li key={i}><a href={`#${headingId(i)}`}>{b.x}</a></li>
        ))}
      </ol>
    </nav>
  )
}

// Telo článku. Bloky sú dáta (viď data/blog.js), tu sa len mapujú na značky.
// Citát nesie slug poradcu, takže sa podpíše sám a nemôže sa rozísť s autorom.
export function ArticleBody({ body }) {
  return (
    <div className="blog-body">
      {body.map((b, i) => {
        if (b.t === 'h') return <h2 key={i} id={headingId(i)}>{b.x}</h2>
        if (b.t === 'p') return <p key={i}>{b.x}</p>
        if (b.t === 'ul') {
          return (
            <ul key={i} className="blog-ul">
              {b.x.map((li) => (
                <li key={li}><IconCircleCheck size={19} stroke={1.8} /><span>{li}</span></li>
              ))}
            </ul>
          )
        }
        if (b.t === 'num') {
          return (
            <ol key={i} className="blog-ol">
              {b.x.map((li) => <li key={li}>{li}</li>)}
            </ol>
          )
        }
        if (b.t === 'quote') {
          const who = advisorBySlug(b.who)
          return (
            <blockquote key={i} className="blog-quote">
              <IconQuote size={22} stroke={1.6} aria-hidden="true" />
              <p>{b.x}</p>
              {who && <cite>{who.name}, {who.role}</cite>}
            </blockquote>
          )
        }
        if (b.t === 'note') {
          return (
            <aside key={i} className="blog-note">
              <span className="blog-note-h"><IconInfoCircle size={18} stroke={1.8} /> {b.title}</span>
              <p>{b.x}</p>
            </aside>
          )
        }
        return null
      })}
    </div>
  )
}

// „Souvisí s produktem" - tretia škatuľka bočného stĺpca. Článok vždy vedie späť
// k tomu, o čom je, inak je blog slepá ulica; ale je to sprievodný údaj, nie druhý
// koniec článku, takže stojí vedľa textu a nie ako modrý pás cez celú šírku.
// Keď produkt vlastnú stránku nemá, ide odkaz na kontakt s predvyplnenou témou
// (rovnaké pravidlo ako v productRoutes.js).
export function ArticleProductCard({ productKey }) {
  if (!productKey) return null
  const meta = PRODUCTS_META[productKey]
  const has = productHasPage(productKey)
  return (
    <div className="blog-aside-part">
      <span className="blog-aside-t">Souvisí s produktem</span>
      <Link to={productHref(productKey)} className="blog-prodcard">
        <span className="ic">{meta?.icon && <Icon name={meta.icon} size={22} stroke={1.7} />}</span>
        <span className="tx">
          <b>{productLabel(productKey)}</b>
          <small>{has ? 'Co se dá sjednat a co je v základu zdarma' : 'Probrat s poradcem'}</small>
        </span>
      </Link>
    </div>
  )
}

// JEDINÁ sekcia so zoznamom článkov na celom webe: pod produktom aj pod článkom.
// Odlišuje ich len titulok - karty, šípky aj odkaz „Zobrazit vše" sú tie isté,
// pretože je to ten istý posuvný rad ako referencie na úvode (Carousel.jsx).
// Kto pridá druhé miesto so zoznamom článkov, použije toto, nie vlastnú mriežku.
const ALL_LINK = { allTo: '/blog', allLabel: 'Zobrazit vše' }

export function BlogSection({ items, ey = 'Blog', title }) {
  if (!items?.length) return null
  return (
    <CarouselSection ey={ey} title={title} {...ALL_LINK} label="články">
      {items.map((a) => <ArticleCard key={a.slug} a={a} />)}
    </CarouselSection>
  )
}

// Blok blogu na PRODUKTOVEJ stránke. Zoznam si ťahá sám z väzby článok × produkt,
// takže nový článok s `product: 'vozidla'` sa na /vozidla objaví bez zásahu do stránky.
//   rad    - BlogSection, teda presne to isté, čo stojí pod článkom
//   hlavni - prvý článok naplno, zvyšok ako odkazy (rozpracovaná alternatíva)
export function ProductArticles({
  productKey, variant = 'rad', limit = 4,
  ey = 'Blog', title = <>Souvislosti, <b>které rozhodují</b></>,
}) {
  const items = articlesFor(productKey).slice(0, limit)
  if (!items.length) return null

  if (variant === 'hlavni') {
    const [lead, ...rest] = items
    return (
      <>
        <CarouselHead ey={ey} title={title} {...ALL_LINK} />
        <div className="blog-prod-hlavni">
          <ArticleCard a={lead} size="lg" />
          {rest.length > 0 && (
            <ul className="blog-links">
              {rest.map((a) => (
                <li key={a.slug}>
                  <Link to={`/blog/${a.slug}`}>
                    <span className="tx">
                      <b>{a.title}</b>
                      <small>{readLabel(a.read)}</small>
                    </span>
                    <IconArrowRight size={18} stroke={2.2} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <CarouselFoot {...ALL_LINK} />
      </>
    )
  }

  return <BlogSection items={items} ey={ey} title={title} />
}
