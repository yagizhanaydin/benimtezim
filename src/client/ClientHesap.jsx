import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClientHesap() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/clientdata", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.user) {
        setClientData(response.data.user);
      } else {
        throw new Error("Geçersiz veri formatı");
      }
    } catch (error) {
      console.error("Veri çekerken hata:", error);
      setError("Bilgiler alınırken hata oluştu");

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    }
  };

  const kontrolEt = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
      navigate("/login");
    }
  };

  useEffect(() => {
    kontrolEt();
    fetchClientData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Bilgilerim</h3>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : clientData ? (
        <div>
          <div>Kullanıcı Adı: {clientData.kullanici_adi}</div>
          <div>Email: {clientData.email}</div>
        </div>
      ) : (
        <div>Bilgiler yükleniyor...</div>
      )}
    </div>
  );
}

export default ClientHesap;
