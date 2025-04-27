import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Dataupdate } from '../schemas/Datarefresh';
import { useNavigate } from 'react-router-dom';

function ClientDataUpdate() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
    passwordagain: '',
    kullanici_adi: ''
  });

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/clientdata", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setInitialValues({
          email: response.data.user.email,
          kullanici_adi: response.data.user.kullanici_adi,
          password: '',
          passwordagain: ''
        });
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenemedi:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const usercontrol = () => {
    const role = localStorage.getItem("role");
    if (role !== "user") {
      navigate("/login");
      return false;
    }
    return true;
  };

  const clientupdate = useFormik({
    enableReinitialize: true, // initialValues değişince formu güncelle
    initialValues,
    validationSchema: Dataupdate,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Sadece değişen alanları gönder
        const payload = {};
        if (values.email !== initialValues.email) payload.email = values.email;
        if (values.password) payload.password = values.password;
        if (values.passwordagain) payload.passwordagain = values.passwordagain;
        if (values.kullanici_adi !== initialValues.kullanici_adi) payload.kullanici_adi = values.kullanici_adi;

        // Hiçbir alan değişmemişse
        if (Object.keys(payload).length === 0) {
          alert("Değişiklik yapmadınız!");
          return;
        }

        const { data } = await axios.patch(
          "http://localhost:3000/api/auth/updateclient",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Güncelleme başarılı:", data);
        alert("Bilgileriniz başarıyla güncellendi!");
        
  
        resetForm({
          values: {
            ...values,
            password: '',
            passwordagain: ''
          }
        });

        // Kullanıcı adı değiştiyse localStorage'ı güncelle
        if (payload.kullanici_adi) {
          localStorage.setItem("username", payload.kullanici_adi);
        }

      } catch (error) {
        console.error("Hata:", error);
        alert(error.response?.data?.error || "Değişiklik yapılamadı, lütfen tekrar deneyiniz");
      }
    }
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (!usercontrol()) return;
  }, [navigate, token]);

  return (
    <div className="client-update-container">
      <h2>Bilgilerimi Güncelle</h2>
      <form onSubmit={clientupdate.handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email"
            value={clientupdate.values.email}
            onBlur={clientupdate.handleBlur}
            onChange={clientupdate.handleChange}
            placeholder="Mevcut email: ${initialValues.email}"
          />
          {clientupdate.touched.email && clientupdate.errors.email && (
            <div className="error">{clientupdate.errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label>Yeni Şifre:</label>
          <input
            type="password"
            name="password"
            value={clientupdate.values.password}
            onBlur={clientupdate.handleBlur}
            onChange={clientupdate.handleChange}
            placeholder="Şifrenizi değiştirmek istemiyorsanız boş bırakın"
          />
          {clientupdate.touched.password && clientupdate.errors.password && (
            <div className="error">{clientupdate.errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label>Şifre Tekrar:</label>
          <input 
            type="password"
            name="passwordagain"
            value={clientupdate.values.passwordagain}
            onBlur={clientupdate.handleBlur}
            onChange={clientupdate.handleChange} 
            placeholder="Yeni şifrenizi tekrar girin"
          />
          {clientupdate.touched.passwordagain && clientupdate.errors.passwordagain && (
            <div className="error">{clientupdate.errors.passwordagain}</div>
          )}
        </div>

        <div className="form-group">
          <label>Kullanıcı Adı:</label>
          <input 
            type="text" 
            name="kullanici_adi"
            value={clientupdate.values.kullanici_adi}
            onBlur={clientupdate.handleBlur}
            onChange={clientupdate.handleChange}
            placeholder="Mevcut kullanıcı adı: ${initialValues.kullanici_adi}"
          />
          {clientupdate.touched.kullanici_adi && clientupdate.errors.kullanici_adi && (
            <div className="error">{clientupdate.errors.kullanici_adi}</div>
          )}
        </div>

        <button type="submit" className="update-button">
          Bilgileri Güncelle
        </button>
      </form>
    </div>
  );
}

export default ClientDataUpdate;