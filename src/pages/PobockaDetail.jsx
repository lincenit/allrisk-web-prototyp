import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import './kontakt.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { branchBySlug, advisorsForBranch, initials } from '../data/pobocky.js'
import {
  IconMapPin, IconClock, IconPhone, IconMail, IconArrowRight,
  IconChevronRight,
} from '@tabler/icons-react'

const isLead = (role) => /vedoucí/i.test(role || '')

export default function PobockaDetail() {
  const { slug } = useParams()
  const b = branchBySlug(slug)
  useHeroHeader(!!b)

  if (!b) {
    return (
      <div className="site">
        <section className="wrap notfound">
          <h1>Pobočka nenalezena</h1>
          <p>Tuto pobočku se nám nepodařilo najít.</p>
          <Link to="/pobocky" className="btn fill">Zpět na seznam poboček <IconArrowRight size={18} stroke={2.2} /></Link>
        </section>
        <SiteFooter />
      </div>
    )
  }

  const team = advisorsForBranch(b.slug)
  // vedúci pobočky ako prvý
  const orderedTeam = [...team].sort((x, y) => (isLead(y.role) ? 1 : 0) - (isLead(x.role) ? 1 : 0))
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.street}, ${b.zip} ${b.cityFull}`)}`

  return (
    <div className="site">
      {/* HEADER – názov, typ pobočky, kontaktné + adresové tlačidlo (bez foto) */}
      <section className="bd-phero">
        <div className="bd-phero-bg" style={{ backgroundImage: `url(${asset('/pobocky/hero.jpg')})` }} aria-hidden="true" />
        <div className="wrap bd-phero-in">
          <div className="crumbs on-dark">
            <Link to="/kontakt">Kontakt</Link><IconChevronRight />
            <Link to="/pobocky">Pobočky</Link><IconChevronRight />
            <span className="cur">{b.city}</span>
          </div>
          <h1>{b.name}</h1>
          {b.note && <p>{b.note}</p>}
          <div className="bd-phero-actions">
            <a href={`tel:${b.phone.replace(/\s/g, '')}`} className="btn fill"><IconPhone size={18} stroke={2} /> {b.phone}</a>
            <a href={`mailto:${b.email}`} className="btn"><IconMail size={18} stroke={2} /> {b.email}</a>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn"><IconMapPin size={18} stroke={2} /> {b.street}, {b.cityFull}</a>
          </div>
        </div>
      </section>

      {/* fotka interiéru pobočky – „klientské centrum" pôsobí ľudsky a otvorene */}
      <section className="sec wrap" style={{ paddingBottom: 0 }}>
        <img className="bd-hero" src={asset('/pobocky/branch.jpg')} alt={`Pobočka ${b.city} – klientské centrum`} loading="lazy" />
      </section>

      {/* otváracie hodiny + mapa */}
      <section className="sec wrap" style={{ paddingTop: 'clamp(26px,4vw,40px)' }}>
        <div className="bd">
          <div className="bd-meta">
            <div className="bd-row">
              <span className="ic"><IconClock size={20} stroke={1.7} /></span>
              <span>
                <span className="k">Otevírací doba</span>
                <div className="bd-hours">
                  {b.hours.map(([d, h]) => (<Fragment key={d}><span className="d">{d}</span><span className="h">{h}</span></Fragment>))}
                </div>
                <span className="bd-hours-note">Po domluvě se vám budeme věnovat i mimo pracovní dobu.</span>
              </span>
            </div>
          </div>
          <div className="bd-map" role="img" aria-label={`Mapa – ${b.cityFull}`}>
            <span className="pin" style={{ left: `${b.map[0]}%`, top: `${b.map[1]}%` }} />
          </div>
        </div>
      </section>

      {/* tím poradcov – kľúčový rozdiel oproti reality webu (ten ľudí skrýva) */}
      <section className="sec wrap blk" style={{ paddingTop: 0 }}>
        <div className="sec-h"><span className="ey">Náš tým</span><h2>Poradci na pobočce <b>{b.city}</b></h2></div>
        <div className="team">
          {orderedTeam.map((a) => {
            const lead = isLead(a.role)
            return (
              <Link className={`team-card${lead ? ' lead' : ''}`} key={a.slug} to={`/poradce/${a.slug}`}>
                <span className="avatar">{initials(a.name)}</span>
                <span className="tx">
                  <b>{a.name}{lead && <span className="lead-badge">Vedoucí</span>}</b>
                  <span className="role">{a.role}</span>
                  <span className="chips">{a.tags.slice(0, 3).map((t) => <span className="chip-tag" key={t}>{t}</span>)}</span>
                </span>
                <span className="go"><IconArrowRight size={18} stroke={2.2} /></span>
              </Link>
            )
          })}
        </div>
      </section>

      <ContactBand />
      <SiteFooter />
    </div>
  )
}
