import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register' 
import Login from './Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
