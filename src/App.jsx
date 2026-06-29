import { Routes, Route } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import ScrollTop from './components/ScrollTop.jsx'
import Test from './pages/Test.jsx'
import Wireframe from './pages/Wireframe.jsx'
import Vozidla from './pages/Vozidla.jsx'

export default function App() {
  // Jeden spoločný header pre celý prototyp.
  return (
    <>
      <ScrollTop />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Wireframe />} />
        <Route path="/vozidla" element={<Vozidla />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  )
}
