import type { FeatureCollection, Polygon } from 'geojson'
import { Departement, DepartementId, GameHistory, GameMode, GameStats } from '../types'

export function loadGameHistory(): GameHistory[] {
  const history = JSON.parse(localStorage.getItem('history') ?? '[]', (key, value) => {
    if (key === 'date') return new Date(value)
    return value
  })
  console.log('Loading history', history)
  return history
}

export function saveGameHistory(
  gameId: string,
  departements: FeatureCollection<Polygon, Departement>,
  gameMode: GameMode,
  maxGuesses: number,
  ids: DepartementId,
) {
  const history = loadGameHistory()
  const duplicate = history.filter((game) => game.id === gameId)
  if (duplicate.length === 0) {
    const gameHistory: GameHistory = {
      id: gameId,
      mode: gameMode,
      ids,
      maxGuesses,
      departements: departements.features.map((feature) => feature.properties),
      date: new Date(),
    }
    history.push(gameHistory)
    localStorage.setItem('history', JSON.stringify(history))
  }
}

export function computeStats(departements: Departement[]): GameStats {
  return {
    total: departements.length,
    seen: departements.filter((d) => d.found).length,
    correct: departements.filter((d) => d.found === 1).length,
    second: departements.filter((d) => d.found === 2).length,
    third: departements.filter((d) => d.found === 3).length,
    error: departements.filter((d) => d.found === 4).length,
  }
}
