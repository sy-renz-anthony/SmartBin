import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BasePage from '../components/BasePage';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import {MdSummarize} from 'react-icons/md'
import {BsFillTrashFill} from 'react-icons/bs'

import PieChartDashboard from '../components/PieChartDashboard';
import BarChartDashboard from '../components/BarChartDashboard';

import assets from '../assets/assets';

const Home = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [deviceStatusCount, setDeviceStatusCount] =useState([]);
  const [numberDevicesNotOk, setNumberDevicesNotOk] = useState(0);
  
  const reloadData = async()=>{
      try {
        const response1 = await axiosInstance.get("/usages/chart-values", {}, {withCredentials: true});
        if(!response1.data.success){
              toast.error("No Bin Usage record found for the last 7 days!");
        }else{
            setPieChartData(response1.data.data);
        }

        const response2 = await axiosInstance.get("/devices/status-count", {}, {withCredentials: true});
        if(!response2.data.success){
              toast.error("Can't get the status of SmartBin devices!");
        }else{
            setDeviceStatusCount(response2.data.data);
        }

      } catch (err) {
          console.error("Login error:", err.message);
      }

      try {
        const response3 = await axiosInstance.get("/devices/is-all-bin-ok", {}, {withCredentials: true});
        if(!response3.data.success){
          setNumberDevicesNotOk(0);
          toast.error("An error occured while trying to check status of all bins!");
        }else{
            setNumberDevicesNotOk(response3.data.devicesNotOkCount);
        }

      } catch (err) {
          console.error("Login error:", err.message);
      }
    }

  useEffect(() => {
    reloadData();
    const interval = setInterval(reloadData, 30000);
    return ()=>clearInterval(interval);
    
  }, []);

  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>DashBoard</h1>
        <hr />
        <div className="w-full h-auto  grid grid-cols-2 gap-2">
          <div className="flex flex-col w-full h-full">
            <PieChartDashboard data={pieChartData}/>
            <div className="grid grid-cols-1 lg:flex lg:flex-row w-full h-fit gap-10 mt-10 mx-2 items-center justify-center text-center">
              {numberDevicesNotOk>0 ? 
                <>
                  <img src={assets.fullBinPic} className="w-35 h-35" />
                  <h2 className="text-2xl text-orange-500 font-bold mr-3 blinking-notOk">
                    {numberDevicesNotOk ==1 ? "A Bin needs to be emptied!" : "Serveral Bins need to be emptied!"}</h2>
                </> :
                <>
                  <img src={assets.emptyBinPic} className="w-35 h-35" />
                  <h2 className="text-2xl text-violet-500 font-bold mr-3">All Bins are good!</h2>
                </>
              }
              
            </div>
          </div>
          
          <div className="flex flex-col w-full h-full">
            <BarChartDashboard data={deviceStatusCount} />
            <div className="grid grid-cols-1 lg:flex lg:flex-row w-full h-fit gap-10">
              <Link to="/usages" className="button-in-use h-fit mt-10 flex gap-3">
                <MdSummarize size="30"/> Check Usage Records
              </Link>
              <Link to="/devices" className="button-in-use h-fit mt-10 flex gap-3">
                <BsFillTrashFill size="30"/> Check Devices
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BasePage pageTitle="Home" pageContent={pageContent}/>
    </>
  )
}

export default Home