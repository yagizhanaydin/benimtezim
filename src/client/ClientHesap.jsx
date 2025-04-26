import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'

function ClientHesap() {
    const navigate = useNavigate();
    // Kullanıcı bilgilerini tutacak state
    const [clientdatagetir, setclientdatagetir] = useState(null);

    // Kullanıcı bilgilerini API'den çeken fonksiyon
    const clientbilgigetir = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/getir", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setclientdatagetir(response.data); //gelen bilgiler burada tutulur
        } catch (error) {
            console.error("Veri çekerken hata oluştu:", error);
         
        
            if (error.response && error.response.status === 401) {
                navigate("/login");
            }
        }
    }

    const clientbilgicontrol = () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
    
        if (!token || role !== "user") {
            navigate("/login");
        }
    }

  
    useEffect(() => {
        clientbilgicontrol();
        clientbilgigetir();
    }, []);

    return (
        <>
            <h3>Bilgilerim</h3>
            {clientdatagetir ? (
                <>
                    <div>Kullanıcı Adı: {clientdatagetir.kullanici_adi}</div>
                    <div>Email: {clientdatagetir.email}</div>
                   
                </>
            ) : (
                <div>Bilgiler yükleniyor...</div>
            )}
        </>
    )
}

export default ClientHesap;