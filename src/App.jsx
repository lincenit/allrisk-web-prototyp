import { Routes, Route, Navigate } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import ScrollTop from './components/ScrollTop.jsx'
import Wireframe from './pages/Wireframe.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Contact from './pages/Contact.jsx'
import Branches from './pages/Branches.jsx'
import BranchDetail from './pages/BranchDetail.jsx'
import AdvisorDetail from './pages/AdvisorDetail.jsx'
import ProfileDetail from './pages/ProfileDetail.jsx'
import References from './pages/References.jsx'
import About from './pages/About.jsx'
import Blog from './pages/Blog.jsx'
import ArticleDetail from './pages/ArticleDetail.jsx'
import { setSegment, readSegment } from './segment.js'

// Zrušená adresa /podnikatele. Presmerovať na úvod nestačí - kto na ňu príde
// zvonku, musí pristáť na obsahu, ktorý si vyžiadal, nie na verzii pre rodiny.
// Publikum sa preto nastaví ešte pred presmerovaním; render prebehne raz a bez
// blikania, lebo Navigate sa vykoná až po ňom.
function BusinessRedirect() {
  if (readSegment() !== 'podnikatele') setSegment('podnikatele')
  return <Navigate to="/" replace />
}

export default function App() {
  // Jeden spoločný header pre celý prototyp.
  // URL zostávajú v češtine (user-facing + SEO), názvy komponentov sú anglické.
  return (
    <>
      <ScrollTop />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Wireframe />} />
        <Route path="/vozidla" element={<Vehicles />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/pobocky" element={<Branches />} />
        <Route path="/pobocky/:slug" element={<BranchDetail />} />
        <Route path="/poradce/:slug" element={<AdvisorDetail />} />
        <Route path="/profil/:slug" element={<ProfileDetail />} />
        <Route path="/reference" element={<References />} />
        {/* /o-nas je späť (2026-08-12): profil společnosti podľa druhej brožúry.
            Na rozdiel od zrušenej /podnikatele nie je rezom jedného publika -
            je to identita firmy, ktorú potrebujú všetci tri. */}
        <Route path="/o-nas" element={<About />} />
        {/* /podnikatele zanikla 2026-08-11: publikum je pás v hlavičke a mení
            celý web, takže jedno z troch publík nemá dôvod mať vlastnú adresu.
            Jej obsah je na úvode pod záložkou Podnikatelé (components/BizCare).
            Presmerovanie tu zostáva kvôli starým odkazom - `replace`, aby sa
            zrušená adresa nedostala do histórie a tlačidlo späť fungovalo. */}
        <Route path="/podnikatele" element={<BusinessRedirect />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<ArticleDetail />} />
      </Routes>
    </>
  )
}
