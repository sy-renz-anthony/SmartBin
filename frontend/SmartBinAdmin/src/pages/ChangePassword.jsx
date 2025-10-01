import { useState} from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from "react-router-dom";

import BasePage from '../components/BasePage';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [newPassword, setNewPassword]  = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit= async(e) =>{
    if(!newPassword || newPassword.length < 10){
            toast.error("Invalid new password!");
    }else if(!confirmNewPassword){
      toast.error("Please confirm new password!");
    }else if(newPassword !== confirmNewPassword){
      toast.error("Passwords mismatched! Please confirm new password again!");
    }
    
    try {
        const response = await axiosInstance.post("/users/change-password", {"password": newPassword, "confirmPassword":confirmNewPassword }, {withCredentials: true});
        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            toast.success(response.data.message);
            navigate("/my-account");
        }

    } catch (err) {
      console.error("Login error:", err.message);
    }
  }


  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>Change Password</h1>
        <hr />
        <form action={handleSubmit} className="p-8 w-full" >
          <div className="personal-info-pane">
            <label className="text-gray-600 mb-1 w-fit" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="w-100 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label className="text-gray-600 mb-1 w-fit" htmlFor="newPassword">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              className="w-100 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center w-full h-auto pt-10">
            <button
              type="submit"
              className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 active:bg-blue-900 transition duration-200"
            >
              submit
            </button>
          </div>
          
              
        </form>
        
      </div>
    );
  }

  return (
    <>
      <BasePage pageTitle="My Account" pageContent={pageContent}/>
    </>
  )
}

export default ChangePassword