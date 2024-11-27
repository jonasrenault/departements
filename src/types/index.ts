export type MapLayer = {
  ids: string[]
  label: string
  visible: boolean
}

export type MapVisibility = {
  cities: MapLayer
  regions: MapLayer
}

export type Departement = {
  code: string
  nom: string
  found?: number
  guess?: boolean
}
