import { Link, useSearchParams } from 'react-router-dom'
import { IconPhone, IconMail, IconMapPin, IconArrowRight } from '@tabler/icons-react'

// Modrý banner „Ozvěte se nám" – rovnaký na všetkých .site stránkach (Home, Vehicles).
// Štýl je v wireframe.css (.contact-band), ktorý tieto stránky importujú.
// ?tema=<produkt> nesie tému z rozcestníka, aby pristátie nadväzovalo na klik a nebolo slepé.
export default function ContactBand() {
  const [params] = useSearchParams()
  const topic = params.get('tema')

  return (
    <section className="sec wrap">
      <div className="contact-band">
        <div className="contact-tx">
          <span className="ey">Kontakt</span>
          <h2>Ozvěte se <b>nám</b></h2>
          <p>Nechte nám kontakt a ozve se vám osobní poradce Allrisk – nezávazně, srozumitelně a zdarma.</p>
          {topic && <span className="topic-tag">Zajímá vás: {topic}</span>}
          <div className="info">
            <div className="info-row"><span className="ic"><IconPhone size={18} stroke={1.7} /></span> +420 545 110 341</div>
            <div className="info-row"><span className="ic"><IconMail size={18} stroke={1.7} /></span> allrisk@allrisk.cz</div>
            <Link to="/pobocky" className="branch-link"><span className="ic"><IconMapPin size={18} stroke={1.7} /></span> Najít pobočku<span className="ar"><IconArrowRight size={18} stroke={2.2} /></span></Link>
          </div>
        </div>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="flabel"><span>Jméno a příjmení</span><input className="field" placeholder="Jan Novák" /></label>
            <label className="flabel"><span>Telefon</span><input className="field" placeholder="+420 …" /></label>
          </div>
          <label className="flabel"><span>E-mail</span><input className="field" type="email" placeholder="jan@email.cz" /></label>
          <label className="flabel">
            <span>Zpráva</span>
            {/* key = pri zmene témy sa neriadený textarea prekreslí na novú predvyplnenú hodnotu */}
            <textarea
              key={topic || 'blank'}
              className="field"
              rows={4}
              defaultValue={topic ? `Mám zájem o: ${topic}` : ''}
              placeholder="Co potřebujete řešit?"
            />
          </label>
          <button className="btn fill" style={{ alignSelf: 'flex-start' }} type="submit">Odeslat <IconArrowRight size={18} stroke={2.2} /></button>
        </form>
      </div>
    </section>
  )
}
