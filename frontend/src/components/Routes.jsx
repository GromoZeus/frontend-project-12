import { createBrowserRouter } from 'react-router-dom'
import getPath from '../path.js'
import LogedIn from './LogedIn.jsx'
import LoginPage from './LoginPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

const router = createBrowserRouter([
  {
    path: getPath.chatPagePath(),
    element: <LogedIn />,
  },
  {
    path: getPath.loginPagePath(),
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
