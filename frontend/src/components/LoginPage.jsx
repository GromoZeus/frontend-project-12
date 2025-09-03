import React from 'react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { Button, Form, FloatingLabel } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { actions } from '../slices/index.js'
import { useAuth } from '../hooks/index.jsx'
import getPath from '../path.js'

const LoginPage = () => {
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
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
            <fieldset>
              <Form.Group className="form-floating mb-3">
                <FloatingLabel controlId="username" label="Ваш ник">
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
                <FloatingLabel controlId="password" label="Пароль">
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
                <Form.Control.Feedback type="invalid" className="invalid-feedback" style={{ display: authFailed ? 'block' : 'none' }}>the username or password is incorrect</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" disabled={formik.isSubmitting} variant="outline-primary" className="w-100 mb-3">Войти</Button>
            </fieldset>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
