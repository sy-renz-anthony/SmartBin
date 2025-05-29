import { useEffect } from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import RequestResetPassword from './pages/RequestPasswordResetCode'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/request-password-reset' element={<RequestResetPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
