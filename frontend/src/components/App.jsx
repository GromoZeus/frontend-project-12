import { StrictMode, useCallback, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useState } from 'react'
import { Provider } from 'react-redux'
import router from './Routes.jsx'
import store from '../slices/index.js'
import AuthContext from '../contexts/index.jsx'

const AuthProvider = ({ children }) => {
  const getUser = JSON.parse(localStorage.getItem('userId'))
  const [loggedin, setLoggedin] = useState(getUser ? true : false)
  const [user, setUser] = useState(getUser?.username)

  const login = useCallback((userData) => {
    setLoggedin(true)
    setUser(userData.username)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('userId')
    setUser(null)
    setLoggedin(false)
  }, [])

  const getToken = useCallback(() => {
    const userId = JSON.parse(localStorage.getItem('userId'))
    if (userId && userId.token) {
      return userId.token
    }
    logout()
    return {}
  }, [logout])

  const valueData = useMemo(
    () => ({
      loggedin,
      login,
      logout,
      getToken,
      user,
    }),
    [loggedin, login, logout, getToken, user],
  )

  return (
    <AuthContext.Provider value={valueData}>
      {children}
    </AuthContext.Provider>
  )
}

const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Provider>
    </StrictMode>
  )
}

export default App
