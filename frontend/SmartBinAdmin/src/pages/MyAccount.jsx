import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../axiosConfig';

import BasePage from '../components/BasePage';

const MyAccount = () => {
  const [data, setData]  = useState({});

  const navigate = useNavigate();

  useEffect(()=>{
    async function reloadData(){
      try {
        const response = await axiosInstance.get("/users/my-info", {}, {withCredentials: true});
        if(!response.data.success){
              toast.error(response.data.message);
        }else{
            setData(response.data.data[0]);
        }

      } catch (err) {
          console.error("Login error:", err.message);
      }
    }
    
    reloadData();
  }, []);


  const pageContent=(showPasswordModal)=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>Personal Info</h1>
        <hr />
        <div className="personal-info-pane">
          <span className="content-label-identifier">Employee ID#:</span><span>{data.employeeID}</span>
          <span className="content-label-identifier">Name:</span><span>{data.lastName+", "+data.firstName+" "+data.middleName}</span>
          <span className="content-label-identifier">Contact#:</span><span>{data.contactNumber}</span>
          <span className="content-label-identifier">Email Add:</span><span>{data.emailAddress}</span>
          <span className="content-label-identifier">Address:</span><span>{data.address}</span>
        </div>
        <hr />
        <div className="flex mx-10 my-10 justify-end gap-10">
          <button type="submit" className="button-in-use" onClick={(e)=>showPasswordModal("update-info")}>Update Personal Info</button>
          <button type="submit" className="button-in-use" onClick={(e)=>showPasswordModal("change-password")}>Change Password</button>
          
        </div>
      </div>
    );
  }

  return (
    <>
      <BasePage pageTitle="My Account" pageContent={pageContent}/>
    </>
  )
}

export default MyAccount