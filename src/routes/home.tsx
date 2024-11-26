import { useState } from 'react'
import ControlPanel, { MapVisibility } from '../components/ControlPanel'
import FranceMap from '../components/FranceMap'

export default function Home() {
  const [visibility, setVisibility] = useState({
    cities: {
      ids: ['place-city', 'place-city-capital', 'place-town'],
      label: 'Villes',
      visible: true,
    },
    regions: {
      ids: ['boundary-land-level-4', 'place-state'],
      label: 'Régions',
      visible: true,
    },
  } as MapVisibility)

  const handleVisibilityToggle = (value: keyof MapVisibility) => () => {
    setVisibility((_visibility) => ({
      ..._visibility,
      [value]: { ..._visibility[value], visible: !_visibility[value].visible },
    }))
  }

  return (
    <div style={{ flexGrow: '1', position: 'relative' }}>
      <FranceMap visibility={visibility} />
      <ControlPanel visibility={visibility} handleVisibilityToggle={handleVisibilityToggle} />
    </div>
  )
}
