import 'maplibre-gl/dist/maplibre-gl.css'
import { useCallback, useMemo, useState } from 'react'
import { Map as MapGL, FillLayer, Layer, Source, Popup } from 'react-map-gl/maplibre'
import * as turf from '@turf/turf'
import defaultMapStyle from '../assets/bright.json'
import metropole from '../assets/metropole.geojson?raw'
import departements from '../assets/departements.geojson?raw'

const overlayStyle: FillLayer = {
  id: 'overlayL',
  source: 'overlay',
  type: 'fill',
  paint: {
    'fill-color': '#3288bd',
    'fill-opacity': 1,
  },
}

const departementsLayer: FillLayer = {
  id: 'departementsL',
  source: 'departements',
  // 'source-layer': 'original',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(0,0,0,0.1)',
    'fill-color': 'transparent',
  },
}

// Highlighted county polygons
const highlightDepLayer: FillLayer = {
  id: 'departements-highlighted',
  type: 'fill',
  source: 'departementsL',
  // 'source-layer': 'original',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#455a64',
    'fill-opacity': 0.75,
  },
}

const bounds: [[number, number], [number, number]] = [
  [-15, 38], // Southwest coordinates
  [20, 53], // Northeast coordinates
]
const bboxPoly = turf.bboxPolygon(bounds.flat() as [number, number, number, number])
const franceOverlay = turf.difference(turf.featureCollection([bboxPoly, JSON.parse(metropole)]))
const departementsOverlay = JSON.parse(departements)

export default function Map() {
  const [viewState, setViewState] = useState({
    longitude: 3,
    latitude: 46.4,
    zoom: 0,
  })
  const [mapStyle, setMapStyle] = useState(defaultMapStyle)

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

  return (
    <MapGL
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle={mapStyle}
      styleDiffing
      maxBounds={bounds}
      minZoom={0}
      maxZoom={10}
      onMouseMove={onHover}
      interactiveLayerIds={['departementsL']}
    >
      {franceOverlay && (
        <Source id='overlay' type='geojson' data={franceOverlay}>
          <Layer {...overlayStyle} />
        </Source>
      )}

      {departementsOverlay && (
        <Source id='departements' type='geojson' data={departementsOverlay}>
          <Layer {...departementsLayer} />
          <Layer {...highlightDepLayer} filter={filter} />
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
