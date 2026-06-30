import { Link, useParams } from 'react-router-dom'
import './kontakt.css'
import SiteFooter from '../components/SiteFooter.jsx'
import { advisorBySlug, branchBySlug, initials } from '../data/pobocky.js'
import {
  IconMapPin, IconPhone, IconMail, IconArrowRight, IconChevronRight,
  IconCalendarEvent, IconWorld,
} from '@tabler/icons-react'

export default function PoradceDetail() {
  const { slug } = useParams()
  const a = advisorBySlug(slug)

  if (!a) {
    return (
      <div className="site">
        <section className="wrap notfound">
          <h1>Poradce nenalezen</h1>
          <p>Tohoto poradce se nám nepodařilo najít.</p>
          <Link to="/pobocky" className="btn fill">Zpět na pobočky <IconArrowRight size={18} stroke={2.2} /></Link>
        </section>
        <SiteFooter />
      </div>
    )
  }

  const b = branchBySlug(a.branch)
  const tel = a.phone.replace(/\s/g, '')

  return (
    <div className="site">
      <div className="wrap">
        <div className="crumbs">
          <Link to="/kontakt">Kontakt</Link><IconChevronRight />
          <Link to="/pobocky">Pobočky</Link><IconChevronRight />
          {b && <><Link to={`/pobocky/${b.slug}`}>{b.city}</Link><IconChevronRight /></>}
          <span className="cur">{a.name}</span>
        </div>
      </div>

      <section className="sec wrap" style={{ paddingTop: 'clamp(24px,4vw,36px)' }}>
        <div className="adv">
          <div className="adv-head">
            <div className="adv-id">
              <span className="avatar lg">{initials(a.name)}</span>
              <div className="tx">
                <h1>{a.name}</h1>
                <div className="role">{a.role}</div>
                {b && (
                  <div className="branch">
                    <IconMapPin size={15} stroke={1.8} /> Pobočka <Link to={`/pobocky/${b.slug}`}>{b.city}</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="adv-tags">
              {a.tags.map((t) => <span className="chip-tag" key={t}>{t}</span>)}
            </div>

            <p className="adv-bio">{a.bio}</p>

            <div className="adv-facts">
              <div><span className="k">U Allrisku od</span><b>{a.since}</b></div>
              <div><span className="k">Jazyky</span><b>{a.langs.join(', ')}</b></div>
            </div>
          </div>

          {/* bočná kontakt karta */}
          <aside className="adv-side">
            <h3>Spojte se s {a.name.split(' ')[0]}em</h3>
            <div className="info">
              <a href={`tel:${tel}`} className="info-row"><span className="ic"><IconPhone size={18} stroke={1.7} /></span>{a.phone}</a>
              <a href={`mailto:${a.email}`} className="info-row"><span className="ic"><IconMail size={18} stroke={1.7} /></span>{a.email}</a>
              {b && (
                <div className="info-row"><span className="ic"><IconWorld size={18} stroke={1.7} /></span>{b.cityFull}</div>
              )}
            </div>
            <button className="btn fill"><IconCalendarEvent size={18} stroke={2} /> Objednat schůzku</button>
            <a href={`tel:${tel}`} className="btn">Zavolat hned</a>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
