import * as turf from '@turf/turf'
import type { FeatureCollection, Polygon } from 'geojson'
import { FilterSpecification, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FillLayer,
  Layer,
  Map as MapGL,
  MapLayerMouseEvent,
  Popup,
  Source,
} from 'react-map-gl/maplibre'
import defaultMapStyle from '../assets/bright.json'
import metropole from '../assets/metropole.geojson?raw'
import { Departement, MapVisibility } from '../types'

// overlay layer masking out everything but france
const overlayLayer: FillLayer = {
  id: 'overlayLayer',
  source: 'overlay',
  type: 'fill',
  paint: {
    'fill-color': '#3288bd',
    'fill-opacity': 1,
  },
}

// layer displaying departments
const departementsLayer: FillLayer = {
  id: 'departementsLayer',
  source: 'departements',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(0,0,0,0.1)',
    'fill-color': 'transparent',
  },
}

// highlighted department layer
const highlightedDepartementLayer: FillLayer = {
  id: 'highlightedDepartementLayer',
  type: 'fill',
  source: 'departementsLayer',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#455a64',
    'fill-opacity': 0.7,
  },
}

// highlighted department layer
const foundDepartementLayer: FillLayer = {
  id: 'foundDepartementLayer',
  type: 'fill',
  source: 'departementsLayer',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#1976d2',
    'fill-opacity': 0.7,
  },
}

// maxBounds for the map
const maxBounds: [[number, number], [number, number]] = [
  [-15, 38], // Southwest coordinates
  [20, 53], // Northeast coordinates
]
// Compute the difference between the polygon representing the maxBounds and the area of France
const bboxPoly = turf.bboxPolygon(maxBounds.flat() as [number, number, number, number])
const franceOverlay = turf.difference(turf.featureCollection([bboxPoly, JSON.parse(metropole)]))

function getMapStyle(visibility: MapVisibility) {
  const visible = new Map()
  Object.entries(visibility).forEach(([_, value]) => {
    value.ids.forEach((id) => visible.set(id, value.visible))
  })
  const layers = defaultMapStyle.layers.map((layer) => {
    if (visible.has(layer.id)) {
      return {
        ...layer,
        layout: { ...layer.layout, visibility: visible.get(layer.id) ? 'visible' : 'none' },
      }
    } else {
      return layer
    }
  })
  return { ...defaultMapStyle, layers: layers }
}

type HoverInfo = {
  longitude: number
  latitude: number
  dep?: Departement
}

interface MapProps {
  visibility: MapVisibility
  onDepartementClick: (dep: Departement) => void
  deps: FeatureCollection<Polygon, Departement>
}

export default function FranceMap({ visibility, onDepartementClick, deps }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: 3,
    latitude: 46.4,
    zoom: 0,
  })
  const [mapStyle, setMapStyle] = useState(defaultMapStyle as StyleSpecification)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>()
  const [departements, setDepartements] = useState<FeatureCollection<Polygon, Departement>>(deps)

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0]
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      dep: feature && (feature.properties as Departement),
    })
  }, [])

  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features && event.features[0]

      if (feature) onDepartementClick(feature.properties as Departement)
    },
    [onDepartementClick],
  )

  const selectedDep = hoverInfo && hoverInfo.dep
  const filter = useMemo(
    () => ['==', 'code', selectedDep ? selectedDep.code : ''] as FilterSpecification,
    [selectedDep],
  )

  useEffect(() => {
    setMapStyle(getMapStyle(visibility) as StyleSpecification)
  }, [visibility])

  useEffect(() => {
    setDepartements(deps)
  }, [deps])

  return (
    <MapGL
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle={mapStyle}
      styleDiffing
      maxBounds={maxBounds}
      minZoom={0}
      maxZoom={8}
      onMouseMove={onHover}
      onClick={onClick}
      interactiveLayerIds={['departementsLayer']}
    >
      {franceOverlay && (
        <Source id='overlay' type='geojson' data={franceOverlay}>
          <Layer beforeId='place-town' {...overlayLayer} />
        </Source>
      )}

      {departements && (
        <Source id='departements' type='geojson' data={departements}>
          <Layer {...foundDepartementLayer} filter={['==', ['get', 'found'], 0]} />
          <Layer {...departementsLayer} />
          <Layer {...highlightedDepartementLayer} filter={filter} />
        </Source>
      )}

      {selectedDep && (
        <Popup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          offset={[0, -10] as [number, number]}
          closeButton={false}
          className='dep-info'
        >
          {selectedDep.nom}
        </Popup>
      )}
    </MapGL>
  )
}
