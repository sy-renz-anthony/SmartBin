import { useState, useEffect } from 'react';
import BasePage from '../components/BasePage';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import PieChartDashboard from '../components/PieChartDashboard';

const Home = () => {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    async function reloadData(){
      try {
        const response = await axiosInstance.get("/usages/chart-values", {}, {withCredentials: true});
        if(!response.data.success){
              toast.error(response.data.message);
        }else{
            setPieChartData(response.data.data);
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