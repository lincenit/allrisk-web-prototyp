/* Skupina „Hlavička hore" do ladiaceho panelu - čím sa zvolená záložka drží nad
   foto-hero, kde je hlavička priehľadná (src/headerVariants.js).

   Skupina „Hlavička" (rozvrh) tu od 2026-08-19 NIE JE: rozvrh je jeden, `bila`,
   a prepínač s jedinou možnosťou je horší než žiadny.

   Vlastný komponent, nie DebugGroup priamo na stránke: hlavička je na KAŽDEJ
   stránke a varianty sa porovnávajú prekliknutím, takže tá istá skupina musí byť
   v paneli všade rovnaká. Voľbu drží `useDebugOption` (localStorage + udalosť),
   takže prepnutie tu prekreslí hlavičku okamžite, hoci tú renderuje App. */
import { IconEyeglass } from '@tabler/icons-react'
import { DebugGroup, useDebugOption } from './DebugPanel.jsx'
import { HDR_TOP_VARIANTS, HDR_TOP_DEFAULT } from '../headerVariants.js'

export default function HeaderDebug() {
  const [top, setTop] = useDebugOption('hdrtop', HDR_TOP_DEFAULT)
  return (
    <DebugGroup
      icon={IconEyeglass} label="Hlavička hore" value={top} onChange={setTop}
      options={HDR_TOP_VARIANTS} wrap
    />
  )
}
