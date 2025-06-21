import {useEffect, useState} from 'react'
import axiosInstance from '../axiosConfig';

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
    <div className='fixed top-0 left-25 w-full h-20 grid grid-cols-2 items-center bg-white shadow text-black z-10'>
        <h1 className="mx-5 font-bold text-gray-800 text-2xl">{pageTitle}</h1>
        <span className="text-center">Hi, {name}</span>
    </div>
  )
}

export default Header