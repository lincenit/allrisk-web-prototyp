/* ============================================================
   Illus - ilustrácia v obsahu sekcie.

   Ilustrácie na celom webe pochádzajú z tabler.io (rovnaká rodina ako
   ikony z @tabler/icons-react), aby ikonová a ilustračná reč boli jedna.
   Iný štýl ilustrácií by tú väzbu rozbil.

   Súbory žijú v `public/illus/tabler/<sekcia>/`. Kým klient PNG neexportuje,
   nesmie na stránke visieť rozbitý obrázok - preto ikonový fallback. Je to
   ten istý vzor ako `ProfileIllus` v ProfileParts.jsx, len pre obsahové
   bloky namiesto profilových dlaždíc.
   ============================================================ */
import { useState } from 'react'
import { asset } from '../asset.js'

export default function Illus({ src, icon: Icon, className = '' }) {
  const [ok, setOk] = useState(true)

  if (!src || !ok) {
    return (
      <div className={`illus illus--fb ${className}`.trim()} aria-hidden="true">
        {Icon && <Icon size={112} stroke={1.1} />}
      </div>
    )
  }
  return (
    <div className={`illus ${className}`.trim()}>
      <img className="illus-img" src={asset(src)} alt="" aria-hidden="true" onError={() => setOk(false)} />
    </div>
  )
}
