import { GitHub } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Tooltip,
  Typography,
} from '@mui/material'
import { Link, Link as RouterLink } from 'react-router'
import logo from '/logo_with_title.png'

export default function AboutPage() {
  return (
    <Container
      maxWidth='md'
      //   disableGutters
      sx={{
        // backgroundColor: (theme) =>
        //   theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        // minHeight: '100vh',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        padding: 5,
      }}
    >
      <Card
        sx={{
          backgroundColor: 'rgba(250, 250, 250, 1)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <CardActionArea component={RouterLink} to='/'>
          <CardMedia
            component='img'
            alt='Quiz Départements'
            height='400'
            image={logo}
            sx={{ objectFit: 'contain' }}
          />
        </CardActionArea>
        <CardContent>
          <Typography variant='body1'>
            <span style={{ fontWeight: 'bold' }}>Quiz Départements</span> est une application
            open-source de quiz sur les départements français. Elle propose différents modes de jeu
            (pointer le département, nommer le département) ainsi que des options pour personnaliser
            l'affichage.
          </Typography>
        </CardContent>
        <CardActions sx={{ display: 'flex' }}>
          <Button variant='outlined' size='large' component={RouterLink} to='/'>
            Jouer
          </Button>

          <Tooltip title='Code source'>
            <Button
              variant='outlined'
              startIcon={<GitHub />}
              component={Link}
              to='https://github.com/jonasrenault/departements'
              target='_blank'
              size='large'
              sx={{ ml: 'auto!important' }}
            >
              Code source
            </Button>
          </Tooltip>

          <Tooltip title='Développé par'>
            <Button
              variant='outlined'
              size='large'
              startIcon={
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src='https://jrenault.fr/assets/images/bio-photo-2.jpg'
                >
                  JR
                </Avatar>
              }
              component={Link}
              to='https://jrenault.fr'
              target='_blank'
            >
              Jonas Renault
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    </Container>
  )
}
