import React from 'react'
import { useState } from 'react'

import axiosInstance from '../axiosConfig.js'

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const sendCodeButtonPressed =async (e) =>{
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/users/password-reset-otp", {"email": email});
      alert(response.data.message);
        
    } catch (err) {
      console.error("Login error:", err.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <form onSubmit={sendCodeButtonPressed}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recover my Password</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please input your email and we will send a password reset codes to it.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200">
            Send Codes
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword