import { useEffect } from 'react'

// Stránky s foto-hero pod headerom: header je priehľadný úplne hore (vidno foto aj za hlavičkou)
// a po zoskrolovaní dostane plné značkové pozadie. Triedy žijú na <html>, lebo header je mimo stránky.
export function useHeroHeader(active = true) {
  useEffect(() => {
    if (!active) return undefined
    const el = document.documentElement
    el.classList.add('hero-hdr')
    const onScroll = () => el.classList.toggle('hero-hdr-solid', window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      el.classList.remove('hero-hdr', 'hero-hdr-solid')
    }
  }, [active])
}
