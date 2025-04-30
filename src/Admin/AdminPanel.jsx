import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kullanıcı verilerini çekme
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/ClientRegisterData", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);  // Kullanıcıları state'e aktar
      setLoading(false);
    } catch (error) {
      console.error("Kullanıcılar çekilirken hata:", error);
      if (error.response?.status === 401) {
        navigate("/adminlogin");
      }
    }
  };

  // Kullanıcıyı onaylama
  const approveUser = async (userId) => {
    try {
      await axios.put(
        `/api/admin/approve/${userId}`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers();  // Listeyi güncelle
    } catch (error) {
      console.error("Onaylama hatası:", error);
    }
  };

  // Kullanıcıyı reddetme
  const rejectUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/reject/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();  // Listeyi güncelle
    } catch (error) {
      console.error("Reddetme hatası:", error);
    }
  };

  // Admin kontrolü
  const checkAdmin = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "admin") {
      navigate("/adminlogin");
    }
  };

  useEffect(() => {
    checkAdmin();  // Admin kontrolü
    fetchUsers();  // Kullanıcıları çekme
  }, []);

  // Çıkış yapma
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="admin-panel">
      <h1>Admin Paneli - Kullanıcı Yönetimi</h1>
      <button onClick={handleLogout}>Çıkış Yap</button>

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            {/* Kullanıcı resmi */}
            {user.profileImage && (
              <img
                src={user.profileImage}
                alt={`${user.username} profil resmi`}
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              />
            )}

            <div>
              <p>
                <strong>Kullanıcı Adı:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Durum:</strong> {user.status || "Onay Bekliyor"}
              </p>
            </div>

            <div className="user-actions">
              <h2>admin paneli</h2>
              <button onClick={() => approveUser(user.id)}>Onayla</button>
              <button onClick={() => rejectUser(user.id)}>Reddet</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
