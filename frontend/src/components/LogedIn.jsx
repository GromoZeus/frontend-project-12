import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/index.jsx'
// import ChatPage from './componentsChat/ChatPage.jsx'
import getPath from '../path.js'

const LogedIn = () => {
  const auth = useAuth()
  const location = useLocation()
  return (
    auth.loggedin
      ? (<span>Chat</span>)
      : (
          <Navigate
            to={getPath.loginPagePath()}
            state={{ from: location }}
          />
        )
  )
}

export default LogedIn
