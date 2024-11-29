import { AdsClick, EditNote, RestartAlt, Settings } from '@mui/icons-material'
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  CircularProgressProps,
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
import { ChangeEvent, forwardRef, Fragment, useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { useGame } from '../contexts/game'
import { Departement, DepartementId, GameMode, GameStats, MapVisibility } from '../types'
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
    setStats({
      total: departements.features.length,
      seen: departements.features.filter((f) => f.properties.found).length,
      correct: departements.features.filter((f) => f.properties.found === 1).length,
      second: departements.features.filter((f) => f.properties.found === 2).length,
      third: departements.features.filter((f) => f.properties.found === 3).length,
      error: departements.features.filter((f) => f.properties.found === 4).length,
    })
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
                      // disablePortal
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
          <Stack direction='row' sx={{ justifyContent: 'center', alignItems: 'center', mr: 2 }}>
            <Box sx={{ color: '#059669', display: 'flex', alignItems: 'center' }}>
              <Tooltip title={`Réponses correctes (${stats?.correct} / ${stats?.total})`}>
                <CircularProgressWithLabel
                  value={stats ? (stats.correct / stats.total) * 100 : 0}
                  color='inherit'
                />
              </Tooltip>
            </Box>
            {maxGuesses > 1 && (
              <Box sx={{ color: '#0891B2', display: 'flex', alignItems: 'center' }}>
                <Tooltip title={`Réponses au deuxième essai (${stats?.second} / ${stats?.total})`}>
                  <CircularProgressWithLabel
                    value={stats ? (stats.second / stats.total) * 100 : 0}
                    color='inherit'
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
                  />
                </Tooltip>
              </Box>
            )}
            <Box sx={{ color: '#DC2626', display: 'flex', alignItems: 'center' }}>
              <Tooltip title={`Mauvaises réponses (${stats?.error} / ${stats?.total})`}>
                <CircularProgressWithLabel
                  value={stats ? (stats.error / stats.total) * 100 : 0}
                  color='inherit'
                />
              </Tooltip>
            </Box>
          </Stack>
          <SettingsMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
