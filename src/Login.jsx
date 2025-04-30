import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Loginyupp } from './schemas/Loginyup'; // senin doğrulama şeman

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Loginyupp,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const { data } = await axios.post('http://localhost:3000/api/auth/login', values);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/clienthesap');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Giriş başarısız');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div>
      <h1>Giriş Yap</h1>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: 'red' }}>{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: 'red' }}>{formik.errors.password}</div>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Yükleniyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default Login;
