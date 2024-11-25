import { fromJS } from 'immutable'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import { FillLayer, Layer, Source } from 'react-map-gl'
import { Map as MapGL } from 'react-map-gl/maplibre'

const layerStyle: FillLayer = {
  id: 'data',
  type: 'fill',
  'source-layer': 'data',
  paint: {
    'fill-color': '#3288bd',
    'fill-opacity': 0.8,
  },
}

export default function Map() {
  const [viewState, setViewState] = useState({
    longitude: 3,
    latitude: 46.4,
    zoom: 5.6,
  })
  const [mapStyle, setMapStyle] = useState()
  const [franceGeo, setFranceGeo] = useState()

  useEffect(() => {
    const fetchMapStyle = async () => {
      const response = await fetch(
        'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      )
      const style = fromJS(await response.json())
      setMapStyle(style)

      const frResponse = await fetch(
        'https://openmaptiles.geo.data.gouv.fr/data/france-vector.json',
      )
      const frGeo = fromJS(await frResponse.json())
      setFranceGeo(frGeo)
    }

    fetchMapStyle()
  }, [])

  return (
    <MapGL
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle={mapStyle}
      styleDiffing
    >
      <Source
        type='vector'
        // data={franceGeo}
        tiles={['https://openmaptiles.geo.data.gouv.fr/data/france-vector/{z}/{x}/{y}.pbf']}
      >
        <Layer {...layerStyle} />
      </Source>
    </MapGL>
  )
}
