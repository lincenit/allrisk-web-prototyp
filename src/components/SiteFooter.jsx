import { Link } from 'react-router-dom'
import './SiteFooter.css'
import { asset } from '../asset.js'
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react'

export default function SiteFooter() {
  return (
    <footer className="sfoot">
      <div className="sfoot-wrap sfoot-top">
        <div className="sfoot-brand">
          <img className="fl" src={asset('/allrisk-logo-white.svg')} alt="Allrisk" />
          <p>Spolehlivý partner při vašich životních krocích - pojištění, bydlení, financování i investice pod jednou střechou.</p>
          <div className="soc">
            <a href="#" aria-label="Facebook"><IconBrandFacebook size={20} stroke={1.7} /></a>
            <a href="#" aria-label="Instagram"><IconBrandInstagram size={20} stroke={1.7} /></a>
            <a href="#" aria-label="LinkedIn"><IconBrandLinkedin size={20} stroke={1.7} /></a>
          </div>
        </div>
        <div className="sfoot-col">
          <h4>Pojištění</h4>
          <Link to="/vozidla">Vozidla</Link><a href="#">Nemovitost</a><a href="#">Domácnost</a><a href="#">Život a úraz</a><a href="#">Cestovní</a><a href="#">Odpovědnost</a>
        </div>
        <div className="sfoot-col">
          <h4>Reality & finance</h4>
          <a href="#">Prodej nemovitostí</a><a href="#">Nájem bez rizika</a><a href="#">Hypotéky</a><a href="#">Investice</a><a href="#">Allrisk EFFECTIVE</a>
        </div>
        <div className="sfoot-col">
          <h4>Allrisk</h4>
          <Link to="/o-nas">O nás</Link><a href="#">Kariéra</a><Link to="/blog">Blog</Link><Link to="/pobocky">Pobočky</Link><Link to="/kontakt">Kontakt</Link>
        </div>
      </div>
      <div className="sfoot-wrap sfoot-bot">
        <span>© 2026 Allrisk, a.s.</span>
        <span style={{ display: 'flex', gap: 18 }}><a href="#">Ochrana údajů</a><a href="#">Cookies</a><a href="#">Dokumenty</a></span>
      </div>
    </footer>
  )
}
