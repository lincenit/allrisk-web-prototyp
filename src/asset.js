// Cesta k súboru z /public so správnym base (GitHub Pages podadresár).
// asset('/hero.mp4') -> '/allrisk-web-prototyp/hero.mp4' v builde, '/hero.mp4' v dev.
export const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\//, '')
