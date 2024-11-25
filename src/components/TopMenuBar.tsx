import { AppBar, Link, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router'

export default function TopMenuBar() {
  return (
    <AppBar position='absolute'>
      <Toolbar>
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          <Link component={NavLink} to='/' color='inherit' underline='none'>
            Quiz Départements
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
