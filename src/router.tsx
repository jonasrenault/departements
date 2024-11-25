import { createBrowserRouter } from 'react-router'
import ErrorPage from './error-page'
import Home from './routes/home'
import Root from './routes/root'

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Home /> }],
  },
]

export const router = createBrowserRouter(routes)
