import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import BasePage from '../components/BasePage';

const Devices= () => {
  const [data, setData] = useState({});

  useEffect(()=>{
    async function reloadData(){
      try {
        const response = await axiosInstance.get("/devices/all", {}, {withCredentials: true});
        //console.log(JSON.stringify(response.data.data));
        if(!response.data.success){
              toast.error(response.data.message);
        }else{
            setData(response.data.data);
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
                <div className="flex flex-row w-full items-center">
                  <h1 className='content-title'>List of Devices</h1>
                  <Link to="/add-device" className="absolute button-in-use h-fit right-10">
                    + New Device
                  </Link>
                </div>
                <hr />
                <table className="table-general">
                  <thead className="tablehead-general">
                    <tr>
                      <th className="tableheadentry-general">Device ID#</th>
                      <th className="tableheadentry-general">Location</th>
                      <th className="tableheadentry-general">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data !== null && data.length > 0 ?
                    (data.map((device) => (
                      <tr key={device._id} className="tablerow-general">
                        <td className="tableentry-general">{device.deviceID}</td>
                        <td className="tableentry-general">{device.location}</td>
                        <td className="tableentry-general">
                          <Link to="/update-device" className="absolute button-edit h-fit" state={{ "deviceInfo": device }}>
                            Update
                          </Link>
                        </td>
                      </tr>
                    ))) : (
                      <tr className="tablerow-general">No Device available</tr>
                    )
                  }
                  </tbody>
                </table>
            </div>
        );
    }

  return (
    <>
      <BasePage pageTitle="Devices" pageContent={pageContent}/>
    </>
  )
}

export default Devices