import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmNewPasswordPane  from '../components/ConfirmNewPasswordPane';

const ResetPassword = () => {
    const [employeeID, setEmployeeID] = useState("");
    const [otpCode, setOtpCode] = useState("");

    const [isCodeChecked, setIsCodeChecked] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      toast.dismiss();
    }, []);

    const submitCodes = async(e) =>{
        e.preventDefault();
        
        try {
        const response = await axiosInstance.post("/users/is-valid-otp", {"employeeID": employeeID, "otp": otpCode }, {withCredentials: true});

        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            toast.success(response.data.message);
        }
        setIsCodeChecked(response.data.success);

        } catch (err) {
            console.error("Login error:", err.message);
        }
    };

    const submitNewPasswordFunction = async(newPassword, confirmNewPassword, e) =>{
      e.preventDefault();
      if(newPassword !== confirmNewPassword){
        toast.error("Passwords Mismatched! Please confirm your new password again!");
        return;
      }else if(newPassword.length<10){
        toast.error("Passwords should not be less than 10 characters in length!");
        return;
      }

      try {
        const response = await axiosInstance.post("/users/reset-password", {"employeeID": employeeID, "otp": otpCode, "password":newPassword, "confirmPassword":confirmNewPassword }, {withCredentials: true});

        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            toast.success(response.data.message);
            navigate("/");
        }

      } catch (err) {
        console.error("Login error:", err.message);
      }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={submitCodes} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm" >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Verify Password Reset OTP Codes</h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1" htmlFor="email">
            Employee ID#:
          </label>
          <input
            id="employeeID"
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={employeeID}
            onChange={(e) => {setEmployeeID(e.target.value)}}
            disabled={isCodeChecked}
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
            disabled={isCodeChecked}
            required
          />
        </div>
        {!isCodeChecked ? <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 active:bg-blue-900 transition duration-200">
          Submit
        </button> : <div><br /> <hr /><br /><ConfirmNewPasswordPane submitNewPasswordFunction={submitNewPasswordFunction} /></div>}
      </form>
    </div>
  )
}

export default ResetPassword