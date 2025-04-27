import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClientHesap() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);

  const kontrolEt = useCallback(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
      navigate("/login");
      return false;
    }
    return true;
  }, [navigate]);

  const fetchClientData = useCallback(async () => {
    if (!kontrolEt()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/auth/clientdata", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.user) {
        setClientData(response.data.user);
      } else {
        throw new Error("Geçersiz veri formatı");
      }
    } catch (error) {
      console.error("Veri çekerken hata:", error);
      setError("Bilgiler alınırken hata oluştu");

      if (error.response?.status === 401) {
        logout();
      }
    }
  }, [kontrolEt]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

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

      <button type='button' onClick={logout}>Hesaptan çık</button>
    </div>
  );
}

export default ClientHesap;