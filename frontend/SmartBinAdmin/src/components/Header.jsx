import {useEffect, useState} from 'react'
import axiosInstance from '../axiosConfig';
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";

const Header = ({pageTitle}) => {
  const [name, setName] = useState("");

  useEffect(()=>{
    async function reloadData(){
      if(!localStorage.getItem('name')){
        try {
          const response = await axiosInstance.get("/users/my-info", {}, {withCredentials: true});
          if(response.data.success){
                localStorage.setItem('name', response.data.data[0].firstName+" "+response.data.data[0].lastName);
                setName(response.data.data[0].firstName+" "+response.data.data[0].lastName);
          }else{
            localStorage.setItem('name', 'Guest User');
          }

        } catch (err) {
            console.error("Login error:", err.message);
        }
      }else{
        setName(localStorage.getItem('name'));
      }
    }
    
    reloadData();
  }, []);

  return (
    <div className='fixed top-0 left-25 w-full h-20 flex flex-row items-center bg-white shadow text-black z-10'>
        <h1 className="w-2/3 lg:w-3/4 pl-8 font-bold text-teal-900 text-2xl">{pageTitle}</h1>
        <span className='w-1/4 flex justify-center'>Hi, {name}<MdNotifications className="w-7 h-7 mx-10 text-teal-700 hover:text-orange-600"/></span>
        
    </div>
  )
}

export default Header