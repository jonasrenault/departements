import type { FeatureCollection, Polygon } from 'geojson'
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'
import departementsGeoJson from '../assets/departements.geojson?raw'
import { Departement, MapVisibility } from '../types'

const defaultDepartements = JSON.parse(departementsGeoJson) as FeatureCollection<
  Polygon,
  Departement
>
defaultDepartements.features.forEach((feature) => (feature.properties.found = 0))

type GameContextActions = {
  visibility: MapVisibility
  setVisibility: Dispatch<SetStateAction<MapVisibility>>
  target: Departement | undefined
  guesses: number
  maxGuesses: number
  setMaxGuesses: Dispatch<SetStateAction<number>>
  departements: FeatureCollection<Polygon, Departement>
  reset: () => void
  onDepartementClick: (departement: Departement) => void
}

const GameContext = createContext<GameContextActions>({} as GameContextActions)

interface GameContextProviderProps {
  children: ReactNode
}

function selectRandomTarget(
  departements?: FeatureCollection<Polygon, Departement>,
): Departement | undefined {
  const possible = departements?.features.filter((feature) => !feature.properties.found)
  if (possible && possible.length)
    return possible[Math.floor(Math.random() * possible.length)].properties
}

const GameProvider: FC<GameContextProviderProps> = ({ children }) => {
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
  const [maxGuesses, setMaxGuesses] = useState(3)

  const onDepartementClick = (departement: Departement) => {
    if (target) {
      const found = departement.code === target.code
      const showSolution = !found && guesses >= maxGuesses

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
            if (showSolution && feature.properties.code === target.code) feat.properties.found = 4
            return feat
          }),
        }
        return updatedDeps
      })

      if (!found && guesses < maxGuesses) {
        setGuesses((_guesses) => _guesses + 1)
      } else {
        setGuesses(1)
        setTarget(selectRandomTarget(updatedDeps))
      }
    }
  }

  const reset = () => {
    setDepartements(defaultDepartements)
    setTarget(selectRandomTarget(defaultDepartements))
    setGuesses(1)
  }

  return (
    <GameContext.Provider
      value={{
        visibility,
        setVisibility,
        target,
        guesses,
        maxGuesses,
        setMaxGuesses,
        departements,
        reset,
        onDepartementClick,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

const useGame = (): GameContextActions => {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGame must be used within a GameContextProvider')
  }

  return context
}

export { GameProvider, useGame }
