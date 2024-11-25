import { Box, Container, Divider, Typography } from '@mui/material'

export default function Home() {
  return (
    <main>
      <Container sx={{ py: 8 }} maxWidth='md'>
        <Box sx={{ mb: 4 }}>
          <Typography variant='body1'>
            FARMD is a minimalist starter template for a FARM application stack ready to run with
            docker. It offers basic user management, with options for OAuth2 support via Google, so
            that you can get started straight away. It is built with a clean design & minimal
            dependencies in mind, keeping only the essentials.
          </Typography>
          <Typography variant='h6' gutterBottom sx={{ mt: 4 }}>
            Features
          </Typography>
          <Divider />
        </Box>
      </Container>
    </main>
  )
}
