import { Link, useParams } from 'react-router-dom'
import './contact.css'
import { asset } from '../asset.js'
import { useHeroHeader } from '../useHeroHeader.js'
import ContactBand from '../components/ContactBand.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { PageHero, HeroChip, SectionHead, PersonCard } from '../components/PageParts.jsx'
import { branchBySlug, advisorsForBranch, initials } from '../data/branches.js'
import {
  IconMapPin, IconClockHour4, IconPhone, IconMail, IconArrowUpRight,
  IconMap, IconUsers, IconUsersGroup,
} from '@tabler/icons-react'

// Poradie sekcií podľa reality webu (/contacts/$id): hero s tlačidlom späť a čipmi
// → foto pobočky, vedľa neho sticky stĺpec (otváracie hodiny + poloha) → tím pobočky
// pod fotkou → kontaktný banner.
const isLead = (role) => /vedoucí/i.test(role || '')

export default function BranchDetail() {
  const { slug } = useParams()
  const b = branchBySlug(slug)
  useHeroHeader(!!b)

  if (!b) {
    return (
      <div className="site">
        <section className="wrap notfound">
          <h1>Pobočka nenalezena</h1>
          <p>Tuto pobočku se nám nepodařilo najít.</p>
          <Link to="/kontakt" className="btn fill">Zpět na kontakty <IconArrowUpRight size={18} stroke={2.2} /></Link>
        </section>
        <SiteFooter />
      </div>
    )
  }

  const team = advisorsForBranch(b.slug)
  // vedenie pobočky ako prvá skupina, zvyšok poradcov pod ním
  const groups = [
    { name: 'Vedení pobočky', icon: <IconUsers />, people: team.filter((a) => isLead(a.role)) },
    { name: 'Poradci', icon: <IconUsersGroup />, people: team.filter((a) => !isLead(a.role)) },
  ].filter((g) => g.people.length)

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.street}, ${b.zip} ${b.cityFull}`)}`

  return (
    <div className="site">
      <PageHero
        back="/kontakt"
        backLabel="Zpět na kontakty"
        photo="/pobocky/hero.jpg"
        title={b.name}
        subtitle={b.note}
      >
        <div className="hchips">
          <HeroChip href={`tel:${b.phone.replace(/\s/g, '')}`} icon={<IconPhone size={20} stroke={1.8} />}>{b.phone}</HeroChip>
          <HeroChip href={`mailto:${b.email}`} icon={<IconMail size={20} stroke={1.8} />}>{b.email}</HeroChip>
          <HeroChip href={mapsUrl} icon={<IconMapPin size={20} stroke={1.8} />}>{b.street}, {b.zip} {b.cityFull}</HeroChip>
        </div>
      </PageHero>

      <section className="sec wrap">
        <div className="pd-grid">
          {/* foto - vľavo hore, na mobile prvé */}
          <img
            className="pd-photo"
            src={asset('/pobocky/branch.jpg')}
            alt={`Pobočka ${b.city} - klientské centrum`}
            loading="lazy"
          />

          {/* sticky stĺpec: otváracie hodiny + poloha */}
          <div className="pd-side">
            <div className="pcardbox">
              <SectionHead icon={<IconClockHour4 />} title="Otevírací doba" />
              <table className="pd-hours">
                <tbody>
                  {b.hours.map(([d, h]) => (
                    <tr key={d}><td>{d}</td><td>{h}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="pd-note">Po domluvě se vám budeme věnovat i mimo pracovní dobu.</p>
            </div>

            <div className="pcardbox">
              <SectionHead icon={<IconMap />} title="Poloha" />
              <div className="pd-map" role="img" aria-label={`Mapa - ${b.cityFull}`}>
                <span className="pin" style={{ left: `${b.map[0]}%`, top: `${b.map[1]}%` }} />
              </div>
            </div>
          </div>

          {/* tím pobočky - v ľavom stĺpci pod fotkou */}
          {groups.length > 0 && (
            <div className="pd-team">
              {groups.map((g) => (
                <div className="pd-group" key={g.name}>
                  <SectionHead icon={g.icon} title={g.name} />
                  <div className="pd-people">
                    {g.people.map((a) => (
                      <PersonCard key={a.slug} a={a} initials={initials} to={`/poradce/${a.slug}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactBand />
      <SiteFooter />
    </div>
  )
}
