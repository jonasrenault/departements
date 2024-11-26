import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'
import { Map as MapGL, FillLayer, Layer, Source } from 'react-map-gl/maplibre'
import * as turf from '@turf/turf'
import defaultMapStyle from '../assets/bright.json'
import metropole from '../assets/metropole.geojson?raw'

const layerStyle: FillLayer = {
  id: 'overlayL',
  source: 'overlay',
  type: 'fill',
  paint: {
    'fill-color': '#3288bd',
    'fill-opacity': 1,
  },
}

const bounds: [[number, number], [number, number]] = [
  [-15, 38], // Southwest coordinates
  [20, 53], // Northeast coordinates
]
const bboxPoly = turf.bboxPolygon(bounds.flat() as [number, number, number, number])
const franceOverlay = turf.difference(turf.featureCollection([bboxPoly, JSON.parse(metropole)]))

export default function Map() {
  const [viewState, setViewState] = useState({
    longitude: 3,
    latitude: 46.4,
    zoom: 0,
  })
  const [mapStyle, setMapStyle] = useState(defaultMapStyle)

  return (
    <MapGL
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle={mapStyle}
      styleDiffing
      maxBounds={bounds}
      minZoom={0}
      maxZoom={10}
    >
      {franceOverlay && (
        <Source id='overlay' type='geojson' data={franceOverlay}>
          <Layer {...layerStyle} />
        </Source>
      )}
    </MapGL>
  )
}
