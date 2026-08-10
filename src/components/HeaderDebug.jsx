/* ============================================================
   Ladiace skupiny, ktoré patria k HLAVIČKE, nie ku konkrétnej stránke.

   Hlavička je na každej stránke, takže jej prepínače musia byť tiež všade -
   inak si klient otvorí úvod, chce prepnúť verziu menu a panel tam nie je.
   Skupiny preto žijú tu a stránky ich len vložia do svojho <DebugPanel>.
   Stránka bez vlastných variantov si otvorí panel len s týmito dvoma.
   ============================================================ */
import { DebugGroup, useDebugOption } from './DebugPanel.jsx'
import { HDR_VARIANTS, HDR_DEFAULT } from '../headerVariants.js'
import { IconMenu2 } from '@tabler/icons-react'

export default function HeaderDebug() {
  const [hdrStyle, setHdrStyle] = useDebugOption('header', HDR_DEFAULT)
  return (
    <DebugGroup
      icon={IconMenu2} label="Horní menu" value={hdrStyle} onChange={setHdrStyle}
      options={HDR_VARIANTS}
    />
  )
}
