import { createRoutesFromElements, createBrowserRouter, Route } from 'react-router-dom'
import App from './components/App.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import NotFoundScreen from './components/NotFoundScreen.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </>,
  ),
)

export default router
