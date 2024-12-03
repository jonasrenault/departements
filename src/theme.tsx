import { createTheme } from '@mui/material/styles'

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  // palette: {
  //   primary: {
  //     light: '#718792',
  //     main: '#455a64',
  //     dark: '#1c313a',
  //     contrastText: '#ffffff',
  //   },
  //   secondary: {
  //     light: '#63a4ff',
  //     main: '#1976d2',
  //     dark: '#004ba0',
  //     contrastText: '#ffffff',
  //   },
  // },
  palette: {
    primary: { main: '#607d8b' },
    secondary: { main: '#8b607d' },
  },
})

export default theme
