import { Settings } from '@mui/icons-material'
import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState, MouseEvent, Fragment } from 'react'

export type MapLayer = {
  ids: string[]
  label: string
  visible: boolean
}

export type MapVisibility = {
  cities: MapLayer
  regions: MapLayer
}

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
          sx={{ ml: 2 }}
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

interface ControlPanelProps {
  visibility: MapVisibility
  handleVisibilityToggle: (key: keyof MapVisibility) => () => void
}

export default function ControlPanel(props: ControlPanelProps) {
  return (
    <Card sx={{ position: 'absolute', top: 20, left: 20 }}>
      <Stack direction='row' sx={{ justifyContent: 'end', alignItems: 'center', padding: 1 }}>
        <SettingsMenu
          visibility={props.visibility}
          handleVisibilityToggle={props.handleVisibilityToggle}
        />
      </Stack>
      <CardContent>
        <Typography variant='subtitle1' component='div' sx={{ color: 'text.secondary' }}>
          Cliquez sur le département 33 Gironde
        </Typography>
      </CardContent>
    </Card>
  )
}
