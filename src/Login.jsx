import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Geçersiz email').required('Zorunlu alan'),
      password: Yup.string().min(6, 'En az 6 karakter').required('Zorunlu alan')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const { data } = await axios.post('http://localhost:3000/api/auth/login', values);
        localStorage.setItem('token', data.token);
        
        if (data.role === 'admin') navigate('/admin');
        else navigate('/');
        
      } catch (err) {
        setError(err.response?.data?.message || 'Giriş başarısız');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div>
      <h1>Giriş Yap</h1>
      
      {error && <div style={{color: 'red'}}>{error}</div>}

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div style={{color: 'red'}}>{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label>Şifre</label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{color: 'red'}}>{formik.errors.password}</div>
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