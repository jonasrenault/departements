import { Stack } from '@mui/material'
import FranceMap from '../components/FranceMap'
import GameMenuBar from '../components/GameMenuBar'
import { GameProvider } from '../contexts/game'

export default function Game() {
  return (
    <GameProvider>
      <Stack direction='column' sx={{ flexGrow: 1 }}>
        <FranceMap />
        <GameMenuBar />
      </Stack>
    </GameProvider>
  )
}
