import { useState, useEffect } from "react";
import {toast} from "react-toastify"

import axiosInstance from '../axiosConfig.js'

export default function Modal({ isOpen, onClose, confirmationEventHandler}) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if(isOpen)
      setPassword("");
  }, [isOpen]);

  if (!isOpen)
    return null;


  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axiosInstance.post("/users/validate-my-password", {"password": password}, {withCredentials: true});
          if(!response.data.success){
              toast.error(response.data.message);
          }else{
              if(confirmationEventHandler !== null){
                confirmationEventHandler();
              }
              toast.success(response.data.message);
          }

        } catch (err) {
            console.error("Login error:", err.message);
        }
    };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
    <div className="fixed top-0 left-0 w-screen h-screen bg-gray-700 opacity-50"></div>
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-2 right-5 text-gray-600 hover:text-black text-xl"
          >
            &times;
          </button>
          <h1 className="mx-5 my-5 font-bold text-gray-800 text-lg transition-all duration-500 ease-linear">Confirm Password</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-sm" >
        
            <div className="mb-6">
              <label className="block text-gray-600 mb-1" htmlFor="password">
                Please enter your password to continue
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="relative flex top-0 left-0 w-full h-auto justify-center">
              <button className="w-20 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200" >Submit</button>
            </div>
          </form>
          
        </div>
    </div>
  );
}