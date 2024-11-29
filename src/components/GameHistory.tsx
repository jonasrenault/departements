import { AdsClick, EditNote } from '@mui/icons-material'
import { Chip, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { GameMode } from '../types'
import { computeStats, loadGameHistory } from '../utils'
import GameStatsDisplay from './GameStatsDisplay'

export default function GameHistory() {
  const [history, _] = useState(loadGameHistory())

  return (
    <Grid container columns={10} rowSpacing={2}>
      <Grid size={3} display='flex' justifyContent='center'>
        <Typography variant='subtitle2'>Session</Typography>
      </Grid>
      <Grid size={2} display='flex' justifyContent='center'>
        <Typography variant='subtitle2'>Mode de jeu</Typography>
      </Grid>
      <Grid size={2} display='flex' justifyContent='center'>
        <Typography variant='subtitle2'>Nombre d'essais</Typography>
      </Grid>
      <Grid size={3} display='flex' justifyContent='center'>
        <Typography variant='subtitle2'>Score</Typography>
      </Grid>
      {history.map((gameHistory) => (
        <>
          <Grid size={3} display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='subtitle2'>{gameHistory.date.toLocaleString()}</Typography>
          </Grid>
          <Grid size={2} display='flex' justifyContent='center' alignItems='center'>
            <Tooltip title='Mode de jeu'>
              <Chip
                icon={gameHistory.mode === GameMode.Point ? <AdsClick /> : <EditNote />}
                label={gameHistory.mode === GameMode.Point ? 'Pointer' : 'Nommer'}
                variant='outlined'
                color='primary'
                size='small'
              />
            </Tooltip>
          </Grid>
          <Grid size={2} display='flex' justifyContent='center' alignItems='center'>
            <Tooltip title="nombre d'essais">
              <Chip
                icon={<AdsClick />}
                label={gameHistory.maxGuesses}
                variant='outlined'
                color='primary'
                size='small'
              />
            </Tooltip>
          </Grid>
          <Grid
            size={3}
            sx={{ color: 'black' }}
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <GameStatsDisplay
              stats={computeStats(gameHistory.departements)}
              maxGuesses={gameHistory.maxGuesses}
              labelColor='primary'
            />
          </Grid>
        </>
      ))}
    </Grid>
  )
}
