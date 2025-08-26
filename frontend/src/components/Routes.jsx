import { createBrowserRouter } from 'react-router-dom'
import getRoutes from '../routes.js'
import LoginPage from './LoginPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

const router = createBrowserRouter([
  {
    path: getRoutes.chatPagePath(),
    element: <span>Chat</span>,
  },
  {
    path: getRoutes.loginPagePath(),
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
