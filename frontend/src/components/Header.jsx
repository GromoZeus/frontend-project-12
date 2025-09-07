import { Button, Navbar, Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '../hooks/index.js'
import getPath from '../path.js'

const AuthButton = () => {
  const auth = useAuth()
  const { t } = useTranslation()
  return (
    auth.loggedin
      ? <Button onClick={auth.logout}>{t('exitButton')}</Button>
      : null
  )
}

const Header = () => {
  const { t } = useTranslation()
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={getPath.chatPagePath()}>{t('chatLogo')}</Navbar.Brand>
        <AuthButton />
      </Container>
    </Navbar>
  )
}

export default Header
