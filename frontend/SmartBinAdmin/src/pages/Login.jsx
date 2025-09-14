import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import { useAuth } from "../AuthContext.jsx";
import assets from "../assets/assets.js";

import axiosInstance from '../axiosConfig.js'



const Login = () => {
    const [employeeID, setEmployeeID] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    
    const {login} = useAuth();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const response = await axiosInstance.post("/users/login", {"employeeID": employeeID, "password": password }, {withCredentials: true});
        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            const token = response.data.token;
            login(token);
            navigate("/home");
        }

        } catch (err) {
            console.error("Login error:", err.message);
        }
    };


  return (
    <div className="w-screen h-screen grid grid-row-2 sm:grid-cols-2 bg-gray-100">
      <div className="shadow-lg">
        <img src={assets.loginPic} className="w-full h-full" />
        <div className="absolute top-0 right-0 bg-white py-1 px-2 text-right">
          <Link to="http://www.freepik.com" className="text-sm text-blue-500 hover:underline">Designed by Freepik</Link>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 items-center justify-center bg-white h-full w-full">
          <div className="flex flex-row items-center gap-5">
            <h2 className="w-full text-3xl font-bold my-3 text-teal-800 text-center">
              Siaton SmartBin Login 
            </h2>
            <img src={assets.logo} className="w-20 h-20" />
          </div>
        <form onSubmit={handleLogin} className="bg-white px-3 w-full max-w-sm" >
          <h2 className="my-5 text-xl text-teal-800">Welcome Back!</h2>
          <p className="text-gray-600 mb-7">
            Sign in to access your dashboard and continue managing the SmartBins deployed accross our town and keep our community clean and healthy.
          </p>
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
            className="w-full mt-5 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
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
    </div>
  )
}

export default Login