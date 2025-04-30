import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register' 
import Login from './Login'
import ClientHesap from './client/ClientHesap'
import TemelSayfa from './TemelSayfa'
import ClientDataUpdate from './client/ClientDataUpdate'
import AdminPanel from './Admin/AdminPanel'
import AdminLogin from './Admin/AdminLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TemelSayfa />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clienthesap" element={<ClientHesap />} />
        <Route path="/clientupdate" element={<ClientDataUpdate/>}/>
         <Route path="/adminlogin" element={<AdminLogin/>}/>
           <Route path='/adminpanel' element={<AdminPanel/>}/>
       
      </Routes>
    </Router>
  )
}

export default App
