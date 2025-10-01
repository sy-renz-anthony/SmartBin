import { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'

import axiosInstance from '../axiosConfig.js'

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const timerRef = useRef(null);
  

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const sendCodeButtonPressed =async (e) =>{
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/users/password-reset-otp", {"emailAddress": email}, {withCredentials: true});
      if(!response.data.success){
        toast.error(response.data.message);
      }else{
        toast.success(response.data.message+"\nPlease check your email and go to the next page to input your OTP codes and proceed to reset the password or you can wait for 3 mins and request for another code.", {autoClose: 180000});
        setDisableSubmit(true);

        if (timerRef.current)
          clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          setDisableSubmit(false);
        }, 180000);
      }
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
          <button type="submit" className={`w-full bg-blue-600 text-white py-2 rounded-xl ${disableSubmit ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-900 transition duration-200'}` }
          disabled={disableSubmit}>
            Send Codes
          </button>
        </form>

          <div className="mt-10 text-right">
            <Link to="/reset-password" className="text-sm text-blue-500 hover:underline active:text-blue-700">
                I already have my codes
            </Link>
          </div>
      </div>
    </div>
  )
}

export default ResetPassword