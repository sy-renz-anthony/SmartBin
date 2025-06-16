import { useState, useEffect } from 'react';
import BasePage from '../components/BasePage';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

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
            console.log("data: "+JSON.stringify(response2.data.data));
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
          <BarChartDashboard data={deviceStatusCount} />
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