import { Stack } from '@mui/material'
import { Outlet } from 'react-router'

export default function Root() {
  return (
    <Stack
      component='main'
      direction='column'
      sx={{
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
      }}
    >
      <Outlet />
    </Stack>
  )
}
