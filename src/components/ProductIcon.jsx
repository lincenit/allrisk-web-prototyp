// Mapovanie string-kľúčov z data/menu.js na Tabler ikony.
// Zdieľané mega-menu, hľadaním aj mobilným drawerom.
import {
  IconCar, IconHome, IconArmchair, IconShield, IconScale, IconHeartHandshake, IconWorld,
  IconChartLine, IconCoin, IconBuildingBank, IconBuildingSkyscraper, IconTruck, IconBriefcase,
  IconBolt, IconKey, IconAlertTriangle, IconFileText, IconPlant2, IconFish, IconPhone,
  IconHomeDollar, IconHomeHand, IconHomeSearch,
} from '@tabler/icons-react'

export const PRODUCT_ICONS = {
  car: IconCar, house: IconHome, box: IconArmchair, shield: IconShield, scale: IconScale,
  heart: IconHeartHandshake, globe: IconWorld, chart: IconChartLine, coin: IconCoin,
  bank: IconBuildingBank, building: IconBuildingSkyscraper, truck: IconTruck, briefcase: IconBriefcase,
  bolt: IconBolt, key: IconKey, warn: IconAlertTriangle, doc: IconFileText, leaf: IconPlant2,
  fish: IconFish, phone: IconPhone,
  // realitná trojica - všetky tri sú „dom", líšia sa až prívlastkom,
  // takže rozdiel musí niesť ikona: peniaze / ruka / lupa
  houseSell: IconHomeDollar, houseBuyout: IconHomeHand, houseBuy: IconHomeSearch,
}

export default function ProductIcon({ name, size = 22 }) {
  const C = PRODUCT_ICONS[name] || IconFileText
  return <span className="hdr-ic"><C size={size} stroke={1.7} /></span>
}
