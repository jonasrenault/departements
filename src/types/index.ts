export type MapLayer = {
  ids: string[]
  label: string
  visible: boolean
}

export type MapVisibility = {
  cities: MapLayer
  regions: MapLayer
}

export type DepartementId = {
  nom: boolean
  code: boolean
  prefecture: boolean
}

export type Departement = {
  code: string
  nom: string
  found?: number
  guess?: boolean
}

export type GameStats = {
  total: number
  seen: number
  correct: number
  second: number
  third: number
  error: number
}
