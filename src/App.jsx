import { Routes, Route } from 'react-router-dom'
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
      </Routes>
    </>
  )
}
