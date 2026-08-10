import { Link, useParams } from 'react-router-dom'
import './contact.css'
import { useHeroHeader } from '../useHeroHeader.js'
import SiteFooter from '../components/SiteFooter.jsx'
import { PageHero, HeroChip, SectionHead, PersonCard } from '../components/PageParts.jsx'
import { ReferenceCard } from '../components/References.jsx'
import { REFERENCES } from '../data/references.js'
import { advisorBySlug, branchBySlug, initials } from '../data/branches.js'
import {
  IconMapPin, IconPhone, IconMail, IconArrowRight, IconMessage,
  IconChecklist, IconStar, IconSend,
} from '@tabler/icons-react'

// Poradie sekcií podľa reality webu (/broker/$id): hero s tlačidlom späť, fotkou,
// menom, rolou a čipmi → vľavo predstavenie, špecializácia a reference, vpravo sticky
// kontaktný formulár. Kontaktný banner tu zámerne nie je - formulár už na stránke je.

// Reference sa vyberajú podľa tém poradce; keď nič nesedí, ukážeme prvé dve.
function referencesFor(advisor) {
  const match = REFERENCES.filter((r) => advisor.tags.some((t) => r.tag.toLowerCase().includes(t.toLowerCase().slice(0, 5))))
  return (match.length ? match : REFERENCES).slice(0, 2)
}

export default function AdvisorDetail() {
  const { slug } = useParams()
  const a = advisorBySlug(slug)
  useHeroHeader(!!a)

  if (!a) {
    return (
      <div className="site">
        <section className="wrap notfound">
          <h1>Poradce nenalezen</h1>
          <p>Tohoto poradce se nám nepodařilo najít.</p>
          <Link to="/kontakt" className="btn fill">Zpět na kontakty <IconArrowRight size={18} stroke={2.2} /></Link>
        </section>
        <SiteFooter />
      </div>
    )
  }

  const b = branchBySlug(a.branch)
  const tel = a.phone.replace(/\s/g, '')
  const refs = referencesFor(a)

  return (
    <div className="site">
      <PageHero
        back={b ? `/pobocky/${b.slug}` : '/kontakt'}
        backLabel={b ? `Zpět na pobočku ${b.city}` : 'Zpět na kontakty'}
        media={<span className="phero-av">{initials(a.name)}</span>}
        title={a.name}
        subtitle={a.role}
      >
        <div className="hchips">
          <HeroChip href={`tel:${tel}`} icon={<IconPhone size={20} stroke={1.8} />}>{a.phone}</HeroChip>
          <HeroChip href={`mailto:${a.email}`} icon={<IconMail size={20} stroke={1.8} />}>{a.email}</HeroChip>
        </div>
      </PageHero>

      <section className="sec wrap">
        <div className="ad-grid">
          <div className="ad-main">
            <p className="ad-bio">{a.bio}</p>

            <div className="ad-facts">
              <div><span className="k">U Allrisku od</span><b>{a.since}</b></div>
              <div><span className="k">Jazyky</span><b>{a.langs.join(', ')}</b></div>
              {b && (
                <div>
                  <span className="k">Pobočka</span>
                  <b><Link to={`/pobocky/${b.slug}`}><IconMapPin size={15} stroke={1.9} /> {b.city}</Link></b>
                </div>
              )}
            </div>

            <div className="ad-block">
              <SectionHead icon={<IconChecklist />} title="Co pro vás řeším" />
              <div className="ad-tags">
                {a.tags.map((t) => <span className="chip-tag lg" key={t}>{t}</span>)}
              </div>
            </div>

            <div className="ad-block">
              <SectionHead
                icon={<IconStar />}
                title="Reference"
                action={<Link to="/reference" className="btn">Všechny reference</Link>}
              />
              <div className="ad-refs">
                {refs.map((r) => <ReferenceCard key={r.name} r={r} />)}
              </div>
            </div>
          </div>

          {/* sticky kontaktný formulár - to isté miesto ako na reality webe */}
          <aside className="ad-side">
            <form className="pcardbox ad-form" onSubmit={(e) => e.preventDefault()}>
              <SectionHead icon={<IconMessage />} title="Kontaktujte mě" />
              <PersonCard a={a} initials={initials} plain />
              <div className="ad-form-row">
                <label className="flabel"><span>Jméno a příjmení</span><input className="field" placeholder="Jan Novák" /></label>
                <label className="flabel"><span>Telefon</span><input className="field" placeholder="+420 …" /></label>
              </div>
              <label className="flabel"><span>E-mail</span><input className="field" type="email" placeholder="jan@email.cz" /></label>
              <label className="flabel">
                <span>Zpráva</span>
                <textarea className="field" rows={4} placeholder="Co potřebujete řešit?" />
              </label>
              <button className="btn fill" type="submit">Odeslat <IconSend size={18} stroke={2} /></button>
            </form>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
