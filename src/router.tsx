import { createBrowserRouter } from 'react-router'
import ErrorPage from './error-page'
import Root from './routes/root'
import Game from './routes/game'
import AboutPage from './routes/about'

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Game /> },
      { path: '/about', element: <AboutPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})
