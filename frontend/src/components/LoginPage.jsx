import React from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { Button, Form, FloatingLabel, Container, Row, Col, Card } from 'react-bootstrap'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import { actions } from '../slices/index.js'
import { useAuth } from '../hooks/index.js'
import getPath from '../path.js'
import imagePath from '../assets/avatar.jpg'

const LoginPage = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const dispatch = useDispatch()
  const [authFailed, setAuthFailed] = useState(false)
  const inputRef = useRef()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    onSubmit: async (values) => {
      setAuthFailed(false)

      try {
        const res = await axios.post(getPath.loginPath(), values)
        localStorage.setItem('userId', JSON.stringify(res.data))
        dispatch(actions.authorization({ name: res.data.username, token: res.data.token }))
        auth.login(res.data)
        const { from } = location.state || { from: { pathname: '/' } }
        navigate(from)
      }
      catch (err) {
        formik.setSubmitting(false)
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true)
          inputRef.current.select()
          return
        }
        throw err
      }
    },
  })

  return (
    <Container className="h-100" fluid>
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={imagePath} className="rounded-circle" alt="Log in page" />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('enter')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="form-floating mb-3">
                    <FloatingLabel controlId="username" label={t('username')}>
                      <Form.Control
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        onBlur={formik.handleBlur}
                        disabled={formik.isSubmitting}
                        placeholder="username"
                        name="username"
                        // id="username"
                        autoComplete="username"
                        isInvalid={authFailed}
                        required
                        ref={inputRef}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group className="form-floating mb-3">
                    <FloatingLabel controlId="password" label={t('password')}>
                      <Form.Control
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        disabled={formik.isSubmitting}
                        placeholder="password"
                        name="password"
                        // id="password"
                        autoComplete="current-password"
                        isInvalid={authFailed}
                        required
                      />
                    </FloatingLabel>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback" style={{ display: authFailed ? 'block' : 'none' }}>{t('noValidUsername')}</Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" disabled={formik.isSubmitting} variant="outline-primary" className="w-100 mb-3">{t('enter')}</Button>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('notAccount')}</span>
                {' '}
                <NavLink to={getPath.signupPagePath()}>{t('signUp')}</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
