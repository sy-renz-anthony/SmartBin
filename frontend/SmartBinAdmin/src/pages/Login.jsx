import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from "react-toastify"

import axiosInstance from '../axiosConfig.js'



const Login = () => {
    const [employeeID, setEmployeeID] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const response = await axiosInstance.post("/users/login", {"employeeID": employeeID, "password": password }, {withCredentials: true});
        console.log(JSON.stringify(response.data));
        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            navigate("/home");
        }

        } catch (err) {
            console.error("Login error:", err.message);
        }
    };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm" >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          SmartBin v0.1 Login
        </h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1" htmlFor="email">
            Employee ID#:
          </label>
          <input
            id="employeeID"
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-1" htmlFor="password">
            Password
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
            <div className="mt-10 text-right">
            <Link to="/request-password-reset" className="text-sm text-blue-500 hover:underline">
                Reset my Password
            </Link>
            </div>
      </form>
        
    </div>
  )
}

export default Login