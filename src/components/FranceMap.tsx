import * as turf from '@turf/turf'
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
import { useGame } from '../contexts/game'
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

// department found on first guess
const foundDepartementLayer: FillLayer = {
  id: 'foundDepartementLayer',
  type: 'fill',
  source: 'departementsLayer',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#059669',
    'fill-opacity': 0.7,
  },
}

// department found on second guess
const missDepartementLayer: FillLayer = {
  id: 'missDepartementLayer',
  type: 'fill',
  source: 'departementsLayer',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#0891B2',
    'fill-opacity': 0.7,
  },
}

// department found on third guess
const lastDepartementLayer: FillLayer = {
  id: 'lastDepartementLayer',
  type: 'fill',
  source: 'departementsLayer',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#DB2777',
    'fill-opacity': 0.7,
  },
}

// department not found
const errorDepartementLayer: FillLayer = {
  id: 'errorDepartementLayer',
  type: 'fill',
  source: 'departementsLayer',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#DC2626',
    'fill-opacity': 0.7,
  },
}

// department not found
const guessDepartementLayer: FillLayer = {
  id: 'guessDepartementLayer',
  type: 'fill',
  source: 'departementsLayer',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#CA8A04',
    'fill-opacity': 0.7,
  },
}

// maxBounds for the map
const maxBounds: [[number, number], [number, number]] = [
  [-15, 39], // Southwest coordinates
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

export default function FranceMap() {
  const { visibility, onDepartementClick, departements } = useGame()
  const [viewState, setViewState] = useState({
    longitude: 2.2,
    latitude: 46.4,
    zoom: 0,
  })
  const [mapStyle, setMapStyle] = useState(defaultMapStyle as StyleSpecification)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>()

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
    () =>
      [
        'all',
        ['==', ['get', 'code'], selectedDep ? selectedDep.code : ''],
        ['==', ['get', 'found'], 0],
      ] as FilterSpecification,
    [selectedDep],
  )

  useEffect(() => {
    setMapStyle(getMapStyle(visibility) as StyleSpecification)
  }, [visibility])

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
          <Layer beforeId='place-town' {...departementsLayer} />
          <Layer beforeId='place-town' {...highlightedDepartementLayer} filter={filter} />
          <Layer
            beforeId='place-town'
            {...foundDepartementLayer}
            filter={['==', ['get', 'found'], 1]}
          />
          <Layer
            beforeId='place-town'
            {...missDepartementLayer}
            filter={['==', ['get', 'found'], 2]}
          />
          <Layer
            beforeId='place-town'
            {...lastDepartementLayer}
            filter={['==', ['get', 'found'], 3]}
          />
          <Layer
            beforeId='place-town'
            {...errorDepartementLayer}
            filter={['>', ['get', 'found'], 3]}
          />
          <Layer
            beforeId='place-town'
            {...guessDepartementLayer}
            filter={['boolean', ['get', 'guess']]}
          />
        </Source>
      )}

      {selectedDep && selectedDep.found && (
        <Popup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          offset={[0, -10] as [number, number]}
          closeButton={false}
          className='dep-info'
        >
          {`${selectedDep.code} - ${selectedDep.nom}`}
        </Popup>
      )}
    </MapGL>
  )
}
