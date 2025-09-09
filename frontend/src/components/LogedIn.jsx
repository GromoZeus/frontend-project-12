import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/index.js'
import ChatPage from './ChatPage/ChatPage.jsx'
import getPath from '../path.js'

const LogedIn = () => {
  const auth = useAuth()
  const location = useLocation()
  return (
    auth.loggedin
      ? (<ChatPage />)
      : (
          <Navigate
            to={getPath.loginPagePath()}
            state={{ from: location }}
          />
        )
  )
}

export default LogedIn
