import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/RequestPasswordResetCode'

function App() {

  const movieNumber = 2;

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/request-password-reset' element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App
