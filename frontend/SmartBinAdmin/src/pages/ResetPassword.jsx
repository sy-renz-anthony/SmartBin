import React from 'react'
import { useState } from 'react';

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const submitCodes = async(e) =>{
        e.preventDefault();
        
        console.log("submitting the codes: ");
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={submitCodes} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm" >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Verify Password Reset OTP Codes</h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1" htmlFor="email">
            Email Address:
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-1" htmlFor="password">
            OTP Code:
          </label>
          <input
            id="otpCode"
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={otpCode}
            onChange={(e) => {setOtpCode(e.target.value)}}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200">
          Submit
        </button>
      </form>
        
    </div>
  )
}

export default ResetPassword