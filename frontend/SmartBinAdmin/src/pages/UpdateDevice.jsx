import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import BasePage from '../components/BasePage';

const UpdateDevice = () => {
  const [data, setData]  = useState({});
  const navigate= useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (location.state?.deviceInfo) {
      setData(location.state.deviceInfo);
    }
  }, [location.state]);

  const handleSubmit= async(e) =>{
    try {
        const response = await axiosInstance.put("/devices/update/"+data._id, data, {withCredentials: true});
        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            toast.success("Device Info updated successfully!");
            navigate("/devices");
        }

    } catch (err) {
      console.error("Login error:", err.message);
    }
  }

const pageContent=()=>{


    return(
      <div className="content-pane">
        <h1 className='content-title'>Update Device Info</h1>
        <hr />
        <form action={handleSubmit} className="p-8 w-full" >
          <div className="personal-info-pane">
            <label className="text-gray-600 mb-1 w-fit" htmlFor="deviceID">
              Device ID#:
            </label>
            <input
              id="deviceID"
              type="text"
              className="w-100 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={data.deviceID}
              onChange={(e) =>{setData(prevData=>({
                ...prevData,
                "deviceID": e.target.value
              }))}}
              required
            />
            <label className="text-gray-600 mb-1 w-fit" htmlFor="location">
              Location:
            </label>
            <textarea
              id="location"
              rows="5"
              cols="40"
              className="w-100 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={data.location}
              onChange={(e) =>{setData(prevData=>({
                ...prevData,
                "location": e.target.value
              }))}}
              required
            />
          </div>
          <div className="flex items-center justify-center w-full h-auto pt-10">
            <button
              type="submit"
              className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
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
      <BasePage pageTitle="Add New Device" pageContent={pageContent}/>
    </>
  )
}

export default UpdateDevice