import type { FeatureCollection, Polygon } from 'geojson'
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import departementsGeoJson from '../assets/departements.geojson?raw'
import { Departement, DepartementId, GameMode, MapVisibility } from '../types'

const defaultDepartements = JSON.parse(departementsGeoJson) as FeatureCollection<
  Polygon,
  Departement
>
defaultDepartements.features.forEach((feature) => (feature.properties.found = 0))

type GameContextActions = {
  visibility: MapVisibility
  setVisibility: Dispatch<SetStateAction<MapVisibility>>
  departementsId: DepartementId
  setDepartementsId: Dispatch<SetStateAction<DepartementId>>
  maxGuesses: number
  setMaxGuesses: Dispatch<SetStateAction<number>>
  gameMode: GameMode
  setGameMode: Dispatch<SetStateAction<GameMode>>
  target: Departement | undefined
  guesses: number
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
      visible: (localStorage.getItem('visibility-cities') ?? 'true') === 'true',
    },
    regions: {
      ids: ['boundary-land-level-4', 'place-state'],
      label: 'Régions',
      visible: (localStorage.getItem('visibility-regions') ?? 'true') === 'true',
    },
  } as MapVisibility)
  const [departementsId, setDepartementsId] = useState({
    nom: (localStorage.getItem('ids-nom') ?? 'true') === 'true',
    code: (localStorage.getItem('ids-code') ?? 'true') === 'true',
    prefecture: (localStorage.getItem('ids-prefecture') ?? 'false') === 'true',
  } as DepartementId)
  const [departements, setDepartements] =
    useState<FeatureCollection<Polygon, Departement>>(defaultDepartements)
  const [target, setTarget] = useState<Departement | undefined>(selectRandomTarget(departements))
  const [guesses, setGuesses] = useState(1)
  const [maxGuesses, setMaxGuesses] = useState(parseInt(localStorage.getItem('maxGuesses') ?? '3'))
  const [gameMode, setGameMode] = useState(
    GameMode[(localStorage.getItem('gameMode') ?? 'Point') as keyof typeof GameMode],
  )

  useEffect(() => {
    localStorage.setItem('maxGuesses', maxGuesses.toString())
  }, [maxGuesses])

  useEffect(() => {
    Object.entries(visibility).forEach(([key, value]) =>
      localStorage.setItem(`visibility-${key}`, String(value.visible)),
    )
  }, [visibility])

  useEffect(() => {
    Object.entries(departementsId).forEach(([key, value]) =>
      localStorage.setItem(`ids-${key}`, String(value)),
    )
  }, [departementsId])

  useEffect(() => {
    localStorage.setItem(`gameMode`, String(gameMode))
  }, [gameMode])

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
        departementsId,
        setDepartementsId,
        gameMode,
        setGameMode,
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
