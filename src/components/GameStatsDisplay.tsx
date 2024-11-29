import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material'
import { forwardRef } from 'react'
import { GameStats } from '../types'

const CircularProgressWithLabel = forwardRef(function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; labelcolor: string },
  ref,
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }} {...props} ref={ref}>
      <CircularProgress variant='determinate' {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant='caption'
          component='div'
          sx={{ color: props.labelcolor }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
})

interface GameStatsDisplayProps {
  stats?: GameStats
  maxGuesses: number
  sx?: SxProps<Theme>
  labelcolor?: string
}

export default function GameStatsDisplay({
  stats,
  maxGuesses,
  sx = [],
  labelcolor = '#ffffff',
}: GameStatsDisplayProps) {
  return (
    <Stack
      direction='row'
      sx={[{ justifyContent: 'center', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box sx={{ color: '#059669', display: 'flex', alignItems: 'center' }}>
        <Tooltip title={`Réponses correctes (${stats?.correct} / ${stats?.total})`}>
          <CircularProgressWithLabel
            value={stats ? (stats.correct / stats.total) * 100 : 0}
            color='inherit'
            labelcolor={labelcolor}
          />
        </Tooltip>
      </Box>
      {maxGuesses > 1 && (
        <Box sx={{ color: '#0891B2', display: 'flex', alignItems: 'center' }}>
          <Tooltip title={`Réponses au deuxième essai (${stats?.second} / ${stats?.total})`}>
            <CircularProgressWithLabel
              value={stats ? (stats.second / stats.total) * 100 : 0}
              color='inherit'
              labelcolor={labelcolor}
            />
          </Tooltip>
        </Box>
      )}
      {maxGuesses > 2 && (
        <Box sx={{ color: '#DB2777', display: 'flex', alignItems: 'center' }}>
          <Tooltip title={`Réponses au troisième essai (${stats?.third} / ${stats?.total})`}>
            <CircularProgressWithLabel
              value={stats ? (stats.third / stats.total) * 100 : 0}
              color='inherit'
              labelcolor={labelcolor}
            />
          </Tooltip>
        </Box>
      )}
      <Box sx={{ color: '#DC2626', display: 'flex', alignItems: 'center' }}>
        <Tooltip title={`Mauvaises réponses (${stats?.error} / ${stats?.total})`}>
          <CircularProgressWithLabel
            value={stats ? (stats.error / stats.total) * 100 : 0}
            color='inherit'
            labelcolor={labelcolor}
          />
        </Tooltip>
      </Box>
    </Stack>
  )
}
