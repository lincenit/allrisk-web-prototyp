import { Link, useSearchParams } from 'react-router-dom'
import { IconPhone, IconMail, IconMapPin, IconArrowUpRight } from '@tabler/icons-react'
import { Decor } from './Decor.jsx'
import { Line } from './Line.jsx'

// Modrý banner „Ozvěte se nám" - rovnaký na všetkých .site stránkach (Home, Vehicles).
// Štýl je v wireframe.css (.contact-band), ktorý tieto stránky importujú.
// ?tema=<produkt> nesie tému z rozcestníka, aby pristátie nadväzovalo na klik a nebolo slepé.
//
// Kružnice aj stuhu má VŽDY - je to plochý modrý pás ako každý iný.
// ZRUŠENÝ prop `line` (2026-08-17): pás stojí na deviatich stránkach a na troch
// z nich (/, /o-nas, /blog) sa prop nepodával, takže tam kontaktný formulár
// zostával bez stuhy a vyzeralo to ako chyba. Pravidlo „jedna stuha na stránku"
// padlo už 2026-08-16 - stránka ich smie mať viac a každý modrý pás si ju nesie.
// Ktorá zo štyroch stúh príde, rieši <Line> podľa cesty - pás si nevyberá.
export default function ContactBand() {
  const [params] = useSearchParams()
  const topic = params.get('tema')

  return (
    <section className="sec wrap">
      <div className="contact-band">
        <Decor />
        {/* vľavo dole: vpravo stojí formulár a stuha by z neho videla len okraje */}
        <Line corner="bottom-left" />
        <div className="contact-tx">
          <span className="ey">Kontakt</span>
          <h2>Ozvěte se <b>nám</b></h2>
          <p>Nechte nám kontakt a ozve se vám osobní poradce Allrisk - nezávazně, srozumitelně a zdarma.</p>
          {topic && <span className="topic-tag">Zajímá vás: {topic}</span>}
          <div className="info">
            {/* Tri rovnocenné karty: ikona 24, jeden riadok textu. Šípka v rohu
                odkazu je preč - celá karta je odkaz a v rohu robila len šum.
                Všetky tri sú odkaz - telefón vytáča, mail otvára klienta. */}
            <a className="info-row" href="tel:+420545110341"><span className="ic"><IconPhone size={24} stroke={1.7} /></span> +420 545 110 341</a>
            <a className="info-row" href="mailto:allrisk@allrisk.cz"><span className="ic"><IconMail size={24} stroke={1.7} /></span> allrisk@allrisk.cz</a>
            <Link to="/pobocky" className="branch-link"><span className="ic"><IconMapPin size={24} stroke={1.7} /></span> Najít pobočku</Link>
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
          <button className="btn fill" style={{ alignSelf: 'flex-start' }} type="submit">Odeslat <IconArrowUpRight size={18} stroke={2.2} /></button>
        </form>
      </div>
    </section>
  )
}
