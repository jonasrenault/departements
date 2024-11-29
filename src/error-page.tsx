import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from '@mui/material'
import { isRouteErrorResponse, Link as RouterLink, useRouteError } from 'react-router'
import logo from '/logo_with_title.png'

interface Error {
  status: number
  statusText: string
  data: string
  message: string
}

export default function ErrorPage() {
  const error = useRouteError() as Error
  console.error(error)
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
      }}
    >
      <Card sx={{ width: 500 }}>
        <CardActionArea component={RouterLink} to='/'>
          <CardMedia sx={{ height: 500, width: 500 }} image={logo} title='Quiz Départements' />
        </CardActionArea>
        <CardContent>
          {isRouteErrorResponse(error) ? (
            <>
              <Typography variant='h1' component='div'>
                {error.status}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                {error.statusText || error.message}
              </Typography>{' '}
            </>
          ) : (
            <Typography variant='h1' component='div'>
              Oops
            </Typography>
          )}
          <Typography variant='body2'>Désolé, une erreur est survenue.</Typography>
        </CardContent>
        <CardActions>
          <Button component={RouterLink} to='/'>
            Retour à l'accueil
          </Button>
        </CardActions>
      </Card>
    </Container>
  )
}
