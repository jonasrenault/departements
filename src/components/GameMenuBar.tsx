import { AdsClick, EditNote, RestartAlt, Settings } from '@mui/icons-material'
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Radio,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { useGame } from '../contexts/game'
import { Departement, DepartementId, GameMode, GameStats, MapVisibility } from '../types'
import { computeStats } from '../utils'
import GameStatsDisplay from './GameStatsDisplay'
import logo from '/logo_transparent.png'

const IdLabels = new Map([
  ['code', 'Code'],
  ['nom', 'Nom'],
  ['prefecture', 'Préfecture'],
])

function isOnlyCheckedValue(key: string, departementsId: DepartementId) {
  return !Object.entries(departementsId)
    .filter((entry) => entry[0] !== key)
    .map((entry) => entry[1])
    .some(Boolean)
}

function SettingsMenu() {
  const {
    visibility,
    setVisibility,
    departementsId,
    setDepartementsId,
    gameMode,
    setGameMode,
    maxGuesses,
    setMaxGuesses,
    reset,
  } = useGame()
  const [open, setOpen] = useState(false)
  const [maxGuessesError, setMaxGuessesError] = useState('')

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const handleVisibilityToggle = (value: keyof MapVisibility) => () => {
    setVisibility((_visibility) => ({
      ..._visibility,
      [value]: { ..._visibility[value], visible: !_visibility[value].visible },
    }))
  }

  const handleIdToggle = (value: keyof DepartementId) => () => {
    const newIds = { ...departementsId, [value]: !departementsId[value] }
    if (Object.values(newIds).some(Boolean)) {
      setDepartementsId(newIds)
    }
  }

  const handleGameModeToggle = (mode: GameMode) => () => {
    setGameMode(mode)
  }

  const onMaxGuessesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    if (1 <= value && value <= 3) {
      setMaxGuesses(value)
      setMaxGuessesError('')
    } else {
      setMaxGuessesError("Le nombre d'essais doit être compris entre 1 et 3.")
    }
  }

  return (
    <Fragment>
      <Tooltip title='Paramètres'>
        <IconButton
          onClick={toggleDrawer(true)}
          size='small'
          aria-controls={open ? 'settings-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          color='inherit'
        >
          <Settings />
        </IconButton>
      </Tooltip>
      <Drawer anchor='right' open={open} onClose={toggleDrawer(false)} sx={{ display: 'flex' }}>
        <List sx={{ width: 250, flexGrow: '1' }}>
          <ListSubheader>Affichage</ListSubheader>
          {Object.entries(visibility).map(([key, value]) => (
            <ListItem key={key} disablePadding>
              <ListItemButton onClick={handleVisibilityToggle(key as keyof MapVisibility)} dense>
                <ListItemIcon>
                  <Checkbox checked={value.visible} tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText>{value.label}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}

          <ListSubheader>Identification des départements</ListSubheader>
          {Object.entries(departementsId).map(([key, value]) => (
            <ListItem key={key} disablePadding>
              <ListItemButton
                onClick={handleIdToggle(key as keyof DepartementId)}
                dense
                disabled={value && isOnlyCheckedValue(key, departementsId)}
              >
                <ListItemIcon>
                  <Checkbox checked={value} tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText>{IdLabels.get(key)}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}

          <ListSubheader>Mode de jeu</ListSubheader>
          <ListItem disablePadding secondaryAction={<AdsClick />}>
            <ListItemButton dense onClick={handleGameModeToggle(GameMode.Point)}>
              <ListItemIcon>
                <Radio
                  checked={gameMode === GameMode.Point}
                  value='a'
                  name='radio-game-mode'
                  inputProps={{ 'aria-label': 'A' }}
                />
              </ListItemIcon>
              <ListItemText>Pointer</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding secondaryAction={<EditNote />}>
            <ListItemButton dense onClick={handleGameModeToggle(GameMode.Name)}>
              <ListItemIcon>
                <Radio
                  checked={gameMode === GameMode.Name}
                  value='b'
                  name='radio-game-mode'
                  inputProps={{ 'aria-label': 'B' }}
                />
              </ListItemIcon>
              <ListItemText>Nommer</ListItemText>
            </ListItemButton>
          </ListItem>

          <Divider sx={{ mt: 1, mb: 1 }} />
          <ListItem>
            <TextField
              label="Nombre d'essais"
              variant='outlined'
              type='number'
              fullWidth
              value={maxGuesses}
              onChange={onMaxGuessesChange}
              error={Boolean(maxGuessesError)}
              helperText={maxGuessesError}
            />
          </ListItem>
        </List>

        <Button variant='outlined' onClick={reset} startIcon={<RestartAlt />} sx={{ margin: 1.5 }}>
          Rejouer
        </Button>
      </Drawer>
    </Fragment>
  )
}

export default function GameMenuBar() {
  const {
    departementsId,
    target,
    guesses,
    maxGuesses,
    departements,
    gameMode,
    reset,
    onDepartementClick,
  } = useGame()
  const [stats, setStats] = useState<GameStats>()
  const [comboValue, setComboValue] = useState<Departement | null>(null)
  const [comboInputValue, setComboInputValue] = useState('')

  useEffect(() => {
    setStats(computeStats(departements.features.map((f) => f.properties)))
  }, [departements])

  const getLabel = (departement?: Departement) => {
    let label = ''
    if (departement) {
      if (departementsId.code) label += departement.code
      if (departementsId.nom) label += (departementsId.code ? ' - ' : '') + departement.nom
    }
    return label
  }

  return (
    <AppBar position='fixed' sx={{ bottom: 0, top: 'auto' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Link component={NavLink} to='/about' color='inherit' underline='none'>
          <Stack direction='row' sx={{ alignItems: 'center' }}>
            <Box
              component='img'
              sx={{
                height: 64,
                mr: 2,
              }}
              alt='Quiz Départements'
              src={logo}
            />
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ display: { sm: 'none', md: 'inherit' } }}
            >
              Quiz Départements
            </Typography>
          </Stack>
        </Link>
        <Box>
          <Stack direction='row' sx={{ alignItems: 'center' }}>
            {target ? (
              <>
                {gameMode === GameMode.Point ? (
                  <Typography
                    component='div'
                    sx={{ color: 'inherit', typography: { sm: 'caption', md: 'body1' } }}
                  >
                    Cliquez sur le département{' '}
                    <span style={{ fontWeight: 'bold' }}>{getLabel(target)}</span>
                  </Typography>
                ) : (
                  <>
                    <Typography
                      component='div'
                      sx={{ color: 'inherit', typography: { sm: 'caption', md: 'body1' } }}
                    >
                      Identifiez le département surligné :
                    </Typography>
                    <Autocomplete
                      autoHighlight
                      options={departements.features
                        .filter((feature) => !feature.properties.found)
                        .map((feature) => feature.properties)}
                      getOptionLabel={getLabel}
                      onChange={(_, newValue: Departement | null) => {
                        if (newValue) {
                          onDepartementClick(newValue)
                          setComboValue(null)
                          setComboInputValue('')
                        }
                      }}
                      value={comboValue}
                      inputValue={comboInputValue}
                      onInputChange={(_, newInputValue) => {
                        setComboInputValue(newInputValue)
                      }}
                      sx={{
                        width: { sm: 200, md: 300 },
                        color: 'inherit',
                        '& .MuiInputBase-root': {
                          bgcolor: 'background.paper',
                        },
                        ml: 2,
                      }}
                      size='small'
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </>
                )}
                <Tooltip
                  title={`${maxGuesses - guesses + 1} essai${maxGuesses - guesses + 1 >= 2 ? 's' : ''} restant`}
                  sx={{ ml: 2 }}
                >
                  <Chip
                    icon={<AdsClick />}
                    label={maxGuesses - guesses + 1}
                    color={guesses === 1 ? 'success' : guesses === 2 ? 'warning' : 'error'}
                    size='small'
                  />
                </Tooltip>
              </>
            ) : (
              <Button
                variant='contained'
                color='secondary'
                onClick={reset}
                startIcon={<RestartAlt />}
              >
                Rejouer
              </Button>
            )}
          </Stack>
        </Box>

        <Stack direction='row' sx={{ justifyContent: 'end', alignItems: 'center' }}>
          <GameStatsDisplay stats={stats} maxGuesses={maxGuesses} sx={{ mr: 1 }} />
          <SettingsMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
