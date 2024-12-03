import { AdsClick, EditNote, RestartAlt, Settings, Share } from '@mui/icons-material'
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Radio,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router'
import { useGame } from '../contexts/game'
import { Departement, DepartementId, GameMode, GameStats, MapVisibility } from '../types'
import { computeStats, loadDefaultDepartments } from '../utils'
import GameStatsDisplay from './GameStatsDisplay'
import logo from '/logo_transparent.png'

const defaultDepartements = loadDefaultDepartments()

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
    numberOfTargets,
    setNumberOfTargets,
    reset,
  } = useGame()
  const [open, setOpen] = useState(false)
  const [maxGuessesError, setMaxGuessesError] = useState('')
  const [maxGuessesInput, setMaxGuessesInput] = useState(maxGuesses.toString())

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
    setMaxGuessesInput(event.target.value)
    const value = parseInt(event.target.value)
    if (1 <= value && value <= 3) {
      setMaxGuesses(value)
      setMaxGuessesError('')
    } else {
      setMaxGuessesError("Le nombre d'essais doit être compris entre 1 et 3.")
    }
  }

  const onNbTargetsChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value
    setNumberOfTargets(value as number)
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
                  value='point'
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
                  value='name'
                  name='radio-game-mode'
                  inputProps={{ 'aria-label': 'B' }}
                />
              </ListItemIcon>
              <ListItemText>Nommer</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding secondaryAction={<Share />}>
            <ListItemButton dense onClick={handleGameModeToggle(GameMode.Pick)}>
              <ListItemIcon>
                <Radio
                  checked={gameMode === GameMode.Pick}
                  value='pick'
                  name='radio-game-mode'
                  inputProps={{ 'aria-label': 'B' }}
                />
              </ListItemIcon>
              <ListItemText>Choisir</ListItemText>
            </ListItemButton>
          </ListItem>

          <Divider sx={{ mt: 1, mb: 1 }} />
          <ListItem>
            <TextField
              label="Nombre d'essais"
              variant='outlined'
              type='number'
              fullWidth
              value={maxGuessesInput}
              onChange={onMaxGuessesChange}
              error={Boolean(maxGuessesError)}
              helperText={maxGuessesError}
            />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel id='nbTargets-select-label'>Départements à trouver</InputLabel>
              <Select
                labelId='nbTargets-select-label'
                id='nbTargets-select'
                value={numberOfTargets}
                label='Départements à trouver'
                onChange={onNbTargetsChange}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={60}>60</MenuItem>
                <MenuItem value={70}>70</MenuItem>
                <MenuItem value={80}>80</MenuItem>
                <MenuItem value={90}>90</MenuItem>
                <MenuItem value={defaultDepartements.features.length}>Tous</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>

        <Button
          variant='outlined'
          onClick={() => reset()}
          startIcon={<RestartAlt />}
          sx={{ margin: 1.5 }}
        >
          Rejouer
        </Button>
      </Drawer>
    </Fragment>
  )
}

function TargetPicker() {
  const { departementsId, target, gameMode, departements, reset, onDepartementClick } = useGame()
  const [comboValue, setComboValue] = useState<Departement | null>(null)
  const [comboInputValue, setComboInputValue] = useState('')

  const getLabel = (departement?: Departement) => {
    let label = ''
    if (departement) {
      if (departementsId.code) label += departement.code
      if (departementsId.nom) label += (departementsId.code ? ' - ' : '') + departement.nom
    }
    return label
  }

  const handleOptionClick = (departement: Departement) => () => {
    onDepartementClick(departement)
  }

  const optionCodes = useMemo(
    () =>
      defaultDepartements.features
        .filter((feature) => feature.properties.code !== target?.code)
        .map((feature) => feature.properties.code)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5),
    [target],
  )

  const options = useMemo(
    () =>
      target
        ? departements.features
            .filter((feature) => optionCodes.includes(feature.properties.code))
            .map((feature) => feature.properties)
            .concat([target])
            .sort((a, b) => a.code.localeCompare(b.code))
        : [],
    [optionCodes, departements, target],
  )

  return (
    <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'center' }}>
      {target ? (
        <>
          {gameMode === GameMode.Point && (
            <Typography
              component='div'
              sx={{ color: 'inherit', typography: { xs: 'caption', md: 'body1' } }}
            >
              Cliquez sur le département{' '}
              <span style={{ fontWeight: 'bold' }}>{getLabel(target)}</span>
            </Typography>
          )}
          {gameMode === GameMode.Name && (
            <>
              <Typography
                component='div'
                sx={{ color: 'inherit', typography: { xs: 'caption', md: 'body1' } }}
              >
                Identifiez le département surligné :
              </Typography>
              <Autocomplete
                autoHighlight
                options={departements.features
                  // .filter((feature) => feature.properties.active && !feature.properties.found)
                  .map((feature) => feature.properties)
                  .sort((a, b) => a.code.localeCompare(b.code))}
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
                  width: { xs: 200, md: 300 },
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
          {gameMode === GameMode.Pick && (
            <>
              <Typography
                component='div'
                sx={{ color: 'inherit', typography: { xs: 'caption', md: 'body1' } }}
              >
                Identifiez le département surligné :
              </Typography>
              <Stack
                direction='row'
                useFlexGap
                sx={{ maxWidth: 500, flexWrap: 'wrap', my: 1, ml: 1 }}
                spacing={1}
              >
                {options.map((departement) => (
                  <Button
                    variant='contained'
                    key={departement.code}
                    size='small'
                    color='secondary'
                    onClick={handleOptionClick(departement)}
                    disabled={departement.guess}
                  >
                    {getLabel(departement)}
                  </Button>
                ))}
              </Stack>
            </>
          )}
        </>
      ) : (
        <Button
          variant='contained'
          color='secondary'
          onClick={() => reset()}
          startIcon={<RestartAlt />}
        >
          Rejouer
        </Button>
      )}
    </Stack>
  )
}

export default function GameMenuBar() {
  const { guesses, maxGuesses, departements } = useGame()
  const [stats, setStats] = useState<GameStats>()

  useEffect(() => {
    setStats(computeStats(departements.features.map((f) => f.properties)))
  }, [departements])

  return (
    <AppBar position='sticky' sx={{ bottom: 0, top: 'auto' }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          p: { xs: 1, md: 0 },
        }}
      >
        <Link
          component={NavLink}
          to='/about'
          color='inherit'
          underline='none'
          sx={{ order: { xs: 2, md: 1 } }}
        >
          <Stack direction='row' sx={{ alignItems: 'center' }}>
            <Box
              component='img'
              sx={{
                height: 48,
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
              sx={{ display: { xs: 'none', md: 'inherit' } }}
            >
              Quiz Départements
            </Typography>
          </Stack>
        </Link>
        <Box
          sx={{
            order: { xs: 1, md: 2 },
            flex: { xs: '0 0 100%', md: 'auto' },
            mb: { xs: 1, md: 0 },
          }}
        >
          <TargetPicker />
        </Box>

        <Stack
          direction='row'
          sx={{ justifyContent: 'end', alignItems: 'center', order: { xs: 2, md: 3 } }}
        >
          <Tooltip
            title={`${maxGuesses - guesses + 1} essai${maxGuesses - guesses + 1 >= 2 ? 's' : ''} restant`}
            sx={{ mr: 1 }}
          >
            <Chip
              icon={<AdsClick />}
              label={maxGuesses - guesses + 1}
              color={guesses === 1 ? 'success' : guesses === 2 ? 'warning' : 'error'}
              size='small'
            />
          </Tooltip>
          <GameStatsDisplay stats={stats} maxGuesses={maxGuesses} sx={{ mr: 1 }} />
          <SettingsMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
