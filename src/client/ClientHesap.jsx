import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'

function ClientHesap() {
    const navigate = useNavigate();
    const [clientdatagetir, setclientdatagetir] = useState(null);

    const clientbilgigetir = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/getir", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setclientdatagetir(response.data);
        } catch (error) {
            console.error("Veri getirme hatası:", error);
         
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
        
        </>
    )
}

export default ClientHesap;