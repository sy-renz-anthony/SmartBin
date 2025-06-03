import { useEffect } from 'react'
import { Routes, Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import RequestResetPassword from './pages/RequestPasswordResetCode'
import ResetPassword from './pages/ResetPassword'
import MyAccount from './pages/MyAccount'
import AddUser from './pages/AddUser'
import ChangePassword from './pages/ChangePassword'
import UpdateMyInfo from './pages/UpdateMyInfo'
import Devices from './pages/Devices'
import AddDevice from './pages/AddDevice'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path='/request-password-reset' element={<RequestResetPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/my-account' element={<ProtectedRoute> <MyAccount /> </ProtectedRoute>} />
        <Route path='/add-user' element={<ProtectedRoute> <AddUser /> </ProtectedRoute>} />
        <Route path='/change-password' element={<ProtectedRoute> <ChangePassword /> </ProtectedRoute>} />
        <Route path='/update-my-info' element={<ProtectedRoute> <UpdateMyInfo /> </ProtectedRoute>} />
        <Route path='/devices' element={<ProtectedRoute> <Devices /> </ProtectedRoute>} />
        <Route path='/add-device' element={<ProtectedRoute> <AddDevice /> </ProtectedRoute>} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
