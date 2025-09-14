import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import {GoDotFill} from 'react-icons/go'
import { FaExclamation } from "react-icons/fa6";

import BasePage from '../components/BasePage';

const Devices= () => {
  const [data, setData] = useState({});

  const reloadData = async () =>{
    try {
        const response = await axiosInstance.get("/devices/all", {}, {withCredentials: true});
      if(!response.data.success){
        toast.error(response.data.message);
      }else{
        setData(response.data.data);
      }

    } catch (err) {
      console.error("Login error:", err.message);
    }
  }

  useEffect(()=>{
    reloadData();
    const interval = setInterval(reloadData, 30000);

    return ()=>clearInterval(interval);
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
                      <th className="tableheadentry-general">Location Description</th>
                      <th className="tableheadentry-general">Status</th>
                      <th className="tableheadentry-general">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data !== null && data.length > 0 ?
                    (data.map((device) => (
                      <tr key={device._id} className="tablerow-general">
                        <td className="tableentry-general">{device.deviceID}</td>
                        <td className="tableentry-general">{device.location}</td>
                        <td className="tableentry-general mx-10">
                          {!device.isOnline ? 
                            <div className="flex items-center"><GoDotFill size='30' className="text-red-500"/>
                              <span>Offline</span>
                            </div> : 
                            <div className="flex items-center"><GoDotFill size='30' className="text-green-500"/>
                              <span>Online</span>
                            </div>
                          }
                          {
                            (device.isBiodegradableBinFull || device.isNonBiodegradableBinFull || device.isHazardousBinFull) && (
                              <div className="flex items-center">
                                <FaExclamation size='20' className="text-yellow-500"/>
                                <span className="text-sm text-gray-600">
                                  {device.isBiodegradableBinFull && (<>Biodegradable</>)}
                                  {(device.isBiodegradableBinFull && (device.isNonBiodegradableBinFull||device.isHazardousBinFull)) && (<>, </>)}
                                  {device.isNonBiodegradableBinFull && (<>Non-Biodegradable</>)}
                                  {(device.isHazardousBinFull&&(device.isBiodegradableBinFull||device.isNonBiodegradableBinFull)) && (<>, </>)}
                                  {device.isHazardousBinFull && (<>Hazardous</>)}

                                  {((device.isBiodegradableBinFull && (!device.isNonBiodegradableBinFull && !device.isHazardousBinFull)) || (device.isNonBiodegradableBinFull && (!device.isBiodegradableBinFull && !device.isHazardousBinFull)) || (device.isHazardousBinFull && (!device.isBiodegradableBinFull && !device.isNonBiodegradableBinFull))) ? <> Bin is Full!</> : <> Bins are Full!</>
                                  }
                                 </span>
                              </div>
                            )
                          }
                          
                          </td>
                        <td className="tableentry-general">
                          <Link to="/update-device" className="button-edit h-fit" state={{ "deviceInfo": device }}>
                            Update
                          </Link>
                        </td>
                      </tr>
                    ))) : (
                      <tr className="tablerow-general"><td className="tableentry-general">No Device available</td></tr>
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