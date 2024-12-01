import { Stack, Toolbar } from '@mui/material'
import FranceMap from '../components/FranceMap'
import GameMenuBar from '../components/GameMenuBar'
import { GameProvider } from '../contexts/game'

export default function Game() {
  return (
    <GameProvider>
      <Stack direction='column' sx={{ flexGrow: 1 }}>
        <Stack direction='column' sx={{ flexGrow: 1 }}>
          <FranceMap />
          <Toolbar sx={{ minHeight: { xs: 104, md: 64 } }} />
        </Stack>
        <GameMenuBar />
      </Stack>
    </GameProvider>
  )
}
