import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { RouterProvider } from 'react-router'
import { router } from './router'
import theme from './theme'

const GA_TRACKING_ID: string = import.meta.env.VITE_GA_TRACKING_ID

if (GA_TRACKING_ID !== null && GA_TRACKING_ID !== undefined && GA_TRACKING_ID !== '') {
  ReactGA.initialize(GA_TRACKING_ID)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
