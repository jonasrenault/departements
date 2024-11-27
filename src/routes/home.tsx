import type { FeatureCollection, Polygon } from 'geojson'
import { useState } from 'react'
import departementsGeoJson from '../assets/departements.geojson?raw'
import ControlPanel from '../components/ControlPanel'
import FranceMap from '../components/FranceMap'
import { Departement, MapVisibility } from '../types'

const defaultDepartements = JSON.parse(departementsGeoJson) as FeatureCollection<
  Polygon,
  Departement
>
defaultDepartements.features.forEach((feature) => (feature.properties.found = 0))

function selectRandomTarget(
  departements?: FeatureCollection<Polygon, Departement>,
): Departement | undefined {
  const possible = departements?.features.filter((feature) => !feature.properties.found)
  if (possible && possible.length)
    return possible[Math.floor(Math.random() * possible.length)].properties
}

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
  const [target, setTarget] = useState<Departement | undefined>(selectRandomTarget(departements))
  const [guesses, setGuesses] = useState(1)

  const handleVisibilityToggle = (value: keyof MapVisibility) => () => {
    setVisibility((_visibility) => ({
      ..._visibility,
      [value]: { ..._visibility[value], visible: !_visibility[value].visible },
    }))
  }

  const onDepartementClick = (departement: Departement) => {
    if (target) {
      const found = departement.code === target.code
      const showSolution = !found && guesses >= 3

      let updatedDeps = undefined
      setDepartements((_departements) => {
        updatedDeps = {
          ..._departements,
          features: _departements.features.map((feature) => {
            const feat = { ...feature, properties: { ...feature.properties } }
            if (feature.properties.code === departement.code) {
              if (found) feat.properties.found = guesses
              else feat.properties.guess = true
            } else {
              feat.properties.guess = false
            }
            if (showSolution && feature.properties.code === target.code)
              feat.properties.found = guesses + 1
            return feat
          }),
        }
        return updatedDeps
      })

      if (!found && guesses < 3) {
        setGuesses((_guesses) => _guesses + 1)
      } else {
        setGuesses(1)
        setTarget(selectRandomTarget(updatedDeps))
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
        guesses={guesses}
      />
    </div>
  )
}
