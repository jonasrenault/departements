import { Settings } from '@mui/icons-material'
import type { FeatureCollection, Polygon } from 'geojson'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  CircularProgressProps,
  IconButton,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { Fragment, MouseEvent, useEffect, useState } from 'react'
import { Departement, MapVisibility, GameStats } from '../types'

interface SettingsMenuProps {
  visibility: MapVisibility
  handleVisibilityToggle: (key: keyof MapVisibility) => () => void
}

function SettingsMenu({ visibility, handleVisibilityToggle }: SettingsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <Tooltip title='Paramètres'>
        <IconButton
          onClick={handleClick}
          size='small'
          // sx={{ ml: 2 }}
          aria-controls={open ? 'settings-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Settings />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id='settings-menu'
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ListSubheader>Affichage</ListSubheader>
        {Object.entries(visibility).map(([key, value]) => (
          <MenuItem key={key} onClick={handleVisibilityToggle(key as keyof MapVisibility)} dense>
            <ListItemIcon>
              <Checkbox edge='start' checked={value.visible} tabIndex={-1} disableRipple />
            </ListItemIcon>
            {value.label}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  )
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
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
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

interface ControlPanelProps {
  visibility: MapVisibility
  handleVisibilityToggle: (key: keyof MapVisibility) => () => void
  target?: Departement
  departements: FeatureCollection<Polygon, Departement>
  guesses: number
  reset: () => void
}

export default function ControlPanel({
  visibility,
  handleVisibilityToggle,
  target,
  guesses,
  departements,
  reset,
}: ControlPanelProps) {
  const [stats, setStats] = useState<GameStats>()

  useEffect(() => {
    setStats({
      total: departements.features.length,
      seen: departements.features.filter((f) => f.properties.found).length,
      correct: departements.features.filter((f) => f.properties.found === 1).length,
      second: departements.features.filter((f) => f.properties.found === 2).length,
      third: departements.features.filter((f) => f.properties.found === 3).length,
      error: departements.features.filter((f) => f.properties.found === 4).length,
    })
  }, [departements])

  return (
    <Card sx={{ position: 'absolute', top: 20, left: 20, opacity: 0.8, maxWidth: 300 }}>
      <Stack direction='row' sx={{ justifyContent: 'end', alignItems: 'center', padding: 1 }}>
        <SettingsMenu visibility={visibility} handleVisibilityToggle={handleVisibilityToggle} />
      </Stack>
      <CardContent>
        {target ? (
          <Typography variant='subtitle1' component='div' sx={{ color: 'text.secondary' }}>
            Cliquez sur le département{' '}
            <span style={{ fontWeight: 'bold' }}>
              {target.code} - {target.nom}
            </span>
            {` (${4 - guesses} essai${guesses > 2 ? '' : 's'} restant)`}
          </Typography>
        ) : (
          <Stack
            direction='row'
            sx={{ justifyContent: 'center', alignItems: 'center', padding: 1 }}
          >
            <Button variant='contained' onClick={reset}>
              Rejouer
            </Button>
          </Stack>
        )}

        <Stack direction='row' sx={{ justifyContent: 'center', alignItems: 'center', padding: 1 }}>
          <Box sx={{ color: '#059669' }}>
            <Tooltip title={`Réponses correctes (${stats?.correct} / ${stats?.total})`}>
              <div>
                <CircularProgressWithLabel
                  value={stats ? (stats.correct / stats.total) * 100 : 0}
                  color='inherit'
                />
              </div>
            </Tooltip>
          </Box>
          <Box sx={{ color: '#0891B2' }}>
            <Tooltip title={`Réponses au deuxième essai (${stats?.second} / ${stats?.total})`}>
              <div>
                <CircularProgressWithLabel
                  value={stats ? (stats.second / stats.total) * 100 : 0}
                  color='inherit'
                />
              </div>
            </Tooltip>
          </Box>
          <Box sx={{ color: '#DB2777' }}>
            <Tooltip title={`Réponses au troisième essai (${stats?.third} / ${stats?.total})`}>
              <div>
                <CircularProgressWithLabel
                  value={stats ? (stats.third / stats.total) * 100 : 0}
                  color='inherit'
                />
              </div>
            </Tooltip>
          </Box>
          <Box sx={{ color: '#DC2626' }}>
            <Tooltip title={`Mauvaises réponses (${stats?.error} / ${stats?.total})`}>
              <div>
                <CircularProgressWithLabel
                  value={stats ? (stats.error / stats.total) * 100 : 0}
                  color='inherit'
                />
              </div>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
