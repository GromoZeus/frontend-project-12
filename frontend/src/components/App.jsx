import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useState } from 'react'
import router from './components/Routes.jsx'
import AuthContext from '../contexts/index.jsx'

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false)

  const logIn = () => setLoggedIn(true)
  const logOut = () => {
    localStorage.removeItem('userId')
    setLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

const App = () => {
  return (
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  )
}

export default App
