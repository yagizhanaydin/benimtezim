import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { Loginyupp } from './schemas/Loginyup'

function Login() {
  const navigate = useNavigate()

  const loginformik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Loginyupp,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/login', values)

        // Assuming token and role are returned from the API
        const { token, role } = response.data

        localStorage.setItem('token', token)
        localStorage.setItem('role', role)

        if (role === 'admin') {
          navigate('/adminpanel')
        } else if (role === 'yönetici') {
          navigate('/yönetici')
        } else if (role === 'client') {
          navigate('/client')
        } else {
          console.error('böyle bir kullanıcı yok')
        }

      } catch (error) {
        console.error('Login error:', error)
      }
    },
  })

  return (
    <form onSubmit={loginformik.handleSubmit}>
      <input
        type="email"
        name="email"
        value={loginformik.values.email}
        onBlur={loginformik.handleBlur}
        onChange={loginformik.handleChange}
        placeholder='email'
      />
      {loginformik.touched.email && loginformik.errors.email && (
        <div>{loginformik.errors.email}</div>
      )}

      <input
        type="password"
        name="password"
        value={loginformik.values.password}
        onBlur={loginformik.handleBlur}
        onChange={loginformik.handleChange}
        placeholder='password'
      />
      {loginformik.touched.password && loginformik.errors.password && (
        <div>{loginformik.errors.password}</div>
      )}

      <button type="submit">Giriş Yap</button>
    </form>
  )
}

export default Login
