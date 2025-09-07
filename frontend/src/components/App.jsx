import { StrictMode, useCallback, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { io } from 'socket.io-client'
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import axios from 'axios'
import router from './Routes.jsx'
import store, { actions } from '../slices/index.js'
import { AuthContext, ChatContext } from '../contexts/index.jsx'
import { useAuth } from '../hooks/index.js'
import getPath from '../path.js'
import content from '../locales/content.js'

const i18n = i18next.createInstance()
await i18n
  .use(initReactI18next)
  .init({
    lng: 'ru',
    resources: {
      ru: content,
    },
  })

const ChatProvider = ({ children }) => {
  const auth = useAuth()
  const { addMessage, addChannel, deleteChannel, channelRename } = actions
  const { dispatch } = store

  const socket = useMemo(() => io({
    transports: ['websocket'],
    autoConnect: true,
  }), [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload))
    })

    socket.on('newChannel', (payload) => {
      dispatch(addChannel(payload))
    })

    socket.on('removeChannel', (payload) => {
      dispatch(deleteChannel(payload))
    })

    socket.on('renameChannel', (payload) => {
      dispatch(channelRename(payload))
    })

    return () => {
      socket.off('newMessage')
      socket.off('newChannel')
      socket.off('removeChannel')
      socket.off('renameChannel')
      socket.disconnect()
    }
  }, [socket, dispatch, addMessage, addChannel, deleteChannel, channelRename])

  const chatApi = {
    sendMessage: async (message) => {
      try {
        const response = await axios.post(getPath.messagesPath(), message, {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`,
          },
        })
        return response.data
      }
      catch (error) {
        console.error('Request failed:', error)
        throw error
      }
    },
    newChannel: async (name) => {
      try {
        const response = await axios.post(getPath.channelsPath(), name, {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`,
          },
        })
        return response.data
      }
      catch (error) {
        console.error('Request failed:', error)
        throw error
      }
    },
    removeChannel: async (id) => {
      try {
        const response = await axios.delete([getPath.channelsPath(), id].join('/'), {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`,
          },
        })
        return response.data
      }
      catch (error) {
        console.error('Request failed:', error)
        throw error
      }
    },
    renameChannel: async ({ name, id }) => {
      try {
        const response = await axios.patch([getPath.channelsPath(), id].join('/'), name, {
          headers: {
            Authorization: `Bearer ${auth.getToken()}`,
          },
        })
        return response.data
      }
      catch (error) {
        console.error('Request failed:', error)
        throw error
      }
    },
  }

  return (
    <ChatContext.Provider value={chatApi}>
      {children}
    </ChatContext.Provider>
  )
}

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
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <AuthProvider>
            <ChatProvider>
              <RouterProvider router={router} />
            </ChatProvider>
          </AuthProvider>
        </Provider>
      </I18nextProvider>
    </StrictMode>
  )
}

export default App
