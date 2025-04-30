import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loginyupp } from '../schemas/Loginyup';
import { useFormik } from 'formik';

function AdminLogin() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Loginyupp,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:3000/api/admin/login", values);
        
        if (response.data.success && response.data.token) {
          // Token'ı çözümle ve rol bilgisini al
          const token = response.data.token;
          localStorage.setItem("token", token);
    
      
          const payload = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem("role", payload.role); 
    
          navigate('/adminpanel');
        } else {
          alert('Login sırasında bir sorun oluştu.');
        }
      } catch (error) {
        alert(error.response?.data?.error || "Giriş başarısız");
      }
    }
    
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Email"
        />
        {formik.touched.email && formik.errors.email && (
          <div style={{ color: 'red' }}>{formik.errors.email}</div>
        )}
      </div>
      
      <div>
        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Şifre"
        />
        {formik.touched.password && formik.errors.password && (
          <div style={{ color: 'red' }}>{formik.errors.password}</div>
        )}
      </div>
      
      <button type="submit">Giriş Yap</button> 
    </form>
  );
}

export default AdminLogin;