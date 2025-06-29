import {useEffect, useState, useRef} from 'react'
import axiosInstance from '../axiosConfig';
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";

const Header = ({pageTitle}) => {
  const [name, setName] = useState("");
  const [numberDeviceNotOk, setNumberDevicesNotOk] = useState(0);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef();

  const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsNotificationOpen(false);
        }
    };

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

      try {
          const response = await axiosInstance.get("/devices/is-all-bin-ok", {}, {withCredentials: true});
          if(!response.data.success){
            setNumberDevicesNotOk(0);
          }else{
              setNumberDevicesNotOk(response.data.devicesNotOkCount);
          }

        } catch (err) {
            console.error("Login error:", err.message);
        }
    }
    
    reloadData();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='fixed top-0 left-25 w-full h-20 flex flex-row items-center bg-white shadow text-black z-10'>
        <h1 className="w-2/3 lg:w-3/4 pl-8 font-bold text-teal-900 text-2xl">{pageTitle}</h1>
        <div className="w-1/4 flex flex-row justify-center" ref={dropdownRef}>
          
          <span className=''>Hi, {name}</span>
          {
          numberDeviceNotOk > 0 ? 
            <MdNotificationsActive className="w-7 h-7 mx-10 text-red-500 hover:text-yellow-500" onClick={() => setIsNotificationOpen(!isNotificationOpen)}/>
            :<MdNotifications className="w-7 h-7 mx-10 text-teal-700 hover:text-orange-400" onClick={() => setIsNotificationOpen(!isNotificationOpen)}/>
          }

          {isNotificationOpen && (
            <div className="fixed top-15 right-0 border border-gray-300 rounded mt-1 pt-5 px-5 pb-8 bg-white shadow z-10 absolute max-w-80 min-w-50 max-h-80 overflow-auto text-center">
              <h3 className="text-lg text-left mx-5 mb-3">Notifications</h3>
              <hr className="mb-5"/>
                <span >{numberDeviceNotOk > 0 ?
                  `There ${numberDeviceNotOk==1? 'is':'are' }  ${numberDeviceNotOk} SmartBin device${numberDeviceNotOk>1 ? 's':'' } that need${numberDeviceNotOk==1 ? 's':'' } to be emptied!`:
                  'All good!'
                }</span>
              </div>
            )}
        </div>
    </div>
  )
}

export default Header