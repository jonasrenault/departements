import { AdsClick, Settings } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  CircularProgressProps,
  IconButton,
  Link,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import type { FeatureCollection, Polygon } from 'geojson'
import { forwardRef, Fragment, MouseEvent, useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { Departement, GameStats, MapVisibility } from '../types'

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
          aria-controls={open ? 'settings-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          color='inherit'
        >
          <Settings />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id='settings-menu'
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mb: 1.5,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                bottom: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
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

const CircularProgressWithLabel = forwardRef(function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
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
          sx={{ color: '#ffffff' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
})

interface BottomMenuBarProps {
  visibility: MapVisibility
  handleVisibilityToggle: (key: keyof MapVisibility) => () => void
  target?: Departement
  departements: FeatureCollection<Polygon, Departement>
  guesses: number
  reset: () => void
}

export default function BottomMenuBar({
  visibility,
  handleVisibilityToggle,
  target,
  guesses,
  departements,
  reset,
}: BottomMenuBarProps) {
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
    <AppBar position='fixed' sx={{ bottom: 0, top: 'auto' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component='h1' variant='h6' color='inherit' noWrap>
          <Link component={NavLink} to='/' color='inherit' underline='none'>
            Quiz Départements
          </Link>
        </Typography>
        <Box>
          {target ? (
            <Stack direction='row' sx={{ alignItems: 'center' }}>
              <Typography variant='subtitle1' component='div' sx={{ color: 'inherit' }}>
                Cliquez sur le département{' '}
                <span style={{ fontWeight: 'bold' }}>
                  {target.code} - {target.nom}
                </span>
              </Typography>
              <Tooltip
                title={`${4 - guesses} essai${guesses > 2 ? '' : 's'} restant`}
                sx={{ ml: 2 }}
              >
                <Chip
                  icon={<AdsClick />}
                  label={4 - guesses}
                  color={guesses === 1 ? 'success' : guesses === 2 ? 'warning' : 'error'}
                  size='small'
                />
              </Tooltip>
            </Stack>
          ) : (
            <Stack
              direction='row'
              sx={{ justifyContent: 'center', alignItems: 'center', padding: 1 }}
            >
              <Button variant='contained' onClick={reset} color='secondary'>
                Rejouer
              </Button>
            </Stack>
          )}
        </Box>

        <Stack direction='row' sx={{ justifyContent: 'end', alignItems: 'center' }}>
          <Stack direction='row' sx={{ justifyContent: 'center', alignItems: 'center', mr: 2 }}>
            <Box sx={{ color: '#059669', display: 'flex', alignItems: 'center' }}>
              <Tooltip title={`Réponses correctes (${stats?.correct} / ${stats?.total})`}>
                <CircularProgressWithLabel
                  value={stats ? (stats.correct / stats.total) * 100 : 0}
                  color='inherit'
                />
              </Tooltip>
            </Box>
            <Box sx={{ color: '#0891B2', display: 'flex', alignItems: 'center' }}>
              <Tooltip title={`Réponses au deuxième essai (${stats?.second} / ${stats?.total})`}>
                <CircularProgressWithLabel
                  value={stats ? (stats.second / stats.total) * 100 : 0}
                  color='inherit'
                />
              </Tooltip>
            </Box>
            <Box sx={{ color: '#DB2777', display: 'flex', alignItems: 'center' }}>
              <Tooltip title={`Réponses au troisième essai (${stats?.third} / ${stats?.total})`}>
                <CircularProgressWithLabel
                  value={stats ? (stats.third / stats.total) * 100 : 0}
                  color='inherit'
                />
              </Tooltip>
            </Box>
            <Box sx={{ color: '#DC2626', display: 'flex', alignItems: 'center' }}>
              <Tooltip title={`Mauvaises réponses (${stats?.error} / ${stats?.total})`}>
                <CircularProgressWithLabel
                  value={stats ? (stats.error / stats.total) * 100 : 0}
                  color='inherit'
                />
              </Tooltip>
            </Box>
          </Stack>
          <SettingsMenu visibility={visibility} handleVisibilityToggle={handleVisibilityToggle} />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
