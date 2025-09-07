import { createBrowserRouter } from 'react-router-dom'
import getPath from '../path.js'
import LogedIn from './LogedIn.jsx'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import Layout from './Layout.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: getPath.chatPagePath(),
        element: <LogedIn />,
      },
      {
        path: getPath.loginPagePath(),
        element: <LoginPage />,
      },
      {
        path: getPath.signupPagePath(),
        element: <SignupPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export default router
