import * as turf from '@turf/turf'
import { StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FillLayer, Layer, Map as MapGL, Popup, Source } from 'react-map-gl/maplibre'
import defaultMapStyle from '../assets/bright.json'
import departements from '../assets/departements.geojson?raw'
import metropole from '../assets/metropole.geojson?raw'
import { MapVisibility } from './ControlPanel'

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
    'fill-opacity': 0.75,
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
const departementsOverlay = JSON.parse(departements)

interface MapProps {
  visibility: MapVisibility
}

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

export default function FranceMap({ visibility }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: 3,
    latitude: 46.4,
    zoom: 0,
  })
  const [mapStyle, setMapStyle] = useState(defaultMapStyle as StyleSpecification)

  const [hoverInfo, setHoverInfo] = useState(null)

  const onHover = useCallback((event) => {
    const dep = event.features && event.features[0]
    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      dep: dep && dep.properties,
    })
  }, [])

  const selectedDep = hoverInfo && hoverInfo.dep
  const filter = useMemo(() => ['in', 'code', selectedDep ? selectedDep.code : ''], [selectedDep])

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
      interactiveLayerIds={['departementsLayer']}
    >
      {franceOverlay && (
        <Source id='overlay' type='geojson' data={franceOverlay}>
          <Layer beforeId='place-town' {...overlayLayer} />
          {/* <Layer {...overlayLayer} /> */}
        </Source>
      )}

      {departementsOverlay && (
        <Source id='departements' type='geojson' data={departementsOverlay}>
          <Layer {...departementsLayer} />
          <Layer {...highlightedDepartementLayer} filter={filter} />
        </Source>
      )}

      {selectedDep && (
        <Popup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          offset={[0, -10]}
          closeButton={false}
          className='dep-info'
        >
          {selectedDep.nom}
        </Popup>
      )}
    </MapGL>
  )
}
