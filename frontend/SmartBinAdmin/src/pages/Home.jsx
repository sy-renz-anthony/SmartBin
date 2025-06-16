import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BasePage from '../components/BasePage';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import {MdSummarize} from 'react-icons/md'
import {BsFillTrashFill} from 'react-icons/bs'

import PieChartDashboard from '../components/PieChartDashboard';
import BarChartDashboard from '../components/BarChartDashboard';

const Home = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [deviceStatusCount, setDeviceStatusCount] =useState([]);

  useEffect(() => {
    async function reloadData(){
      try {
        const response1 = await axiosInstance.get("/usages/chart-values", {}, {withCredentials: true});
        if(!response1.data.success){
              toast.error(response1.data.message);
        }else{
            setPieChartData(response1.data.data);
        }

        const response2 = await axiosInstance.get("/devices/status-count", {}, {withCredentials: true});
        if(!response2.data.success){
              toast.error(response2.data.message);
        }else{
            setDeviceStatusCount(response2.data.data);
        }

      } catch (err) {
          console.error("Login error:", err.message);
      }
    }
    
    reloadData();
  }, []);

  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>DashBoard</h1>
        <hr />
        <div className="w-full h-auto  grid grid-cols-2">
          <PieChartDashboard data={pieChartData}/>
          <div className="flex flex-col w-full h-full">
            <BarChartDashboard data={deviceStatusCount} />
            <div className="flex flex-row w-full h-fit gap-10">
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