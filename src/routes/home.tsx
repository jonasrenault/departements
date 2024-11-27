import type { FeatureCollection, Polygon } from 'geojson'
import { useEffect, useState } from 'react'
import departementsGeoJson from '../assets/departements.geojson?raw'
import ControlPanel from '../components/ControlPanel'
import FranceMap from '../components/FranceMap'
import { Departement, MapVisibility } from '../types'

const defaultDepartements = JSON.parse(departementsGeoJson) as FeatureCollection<
  Polygon,
  Departement
>

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

  const [departements, setDepartements] =
    useState<FeatureCollection<Polygon, Departement>>(defaultDepartements)
  const [target, setTarget] = useState<Departement>()
  const [guesses, setGuesses] = useState(0)

  useEffect(() => {
    const possible = departements.features.filter((feature) => !feature.properties.found)
    setTarget(possible[Math.floor(Math.random() * possible.length)].properties)
  }, [departements])

  const handleVisibilityToggle = (value: keyof MapVisibility) => () => {
    setVisibility((_visibility) => ({
      ..._visibility,
      [value]: { ..._visibility[value], visible: !_visibility[value].visible },
    }))
  }

  const onDepartementClick = (departement: Departement) => {
    if (target) {
      const found = departement.code === target.code
      if (!found && guesses < 2) {
        setGuesses((_guesses) => _guesses + 1)
      } else {
        setDepartements((_departements) => {
          return {
            ..._departements,
            features: _departements.features.map((feature) => {
              if (feature.properties.code === departement.code) {
                return {
                  ...feature,
                  properties: { ...feature.properties, found: found ? guesses : guesses + 1 },
                }
              }
              return feature
            }),
          }
        })
        setGuesses(0)
      }
    }
  }

  return (
    <div style={{ flexGrow: '1', position: 'relative' }}>
      <FranceMap
        visibility={visibility}
        onDepartementClick={onDepartementClick}
        deps={departements}
      />
      <ControlPanel
        visibility={visibility}
        handleVisibilityToggle={handleVisibilityToggle}
        target={target}
      />
    </div>
  )
}
