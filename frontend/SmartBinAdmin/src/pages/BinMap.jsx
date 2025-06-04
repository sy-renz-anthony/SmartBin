import { useState, useEffect} from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from "react-router-dom";

import BasePage from '../components/BasePage';
import { toast } from 'react-toastify';

import {MapContainer, TileLayer, Marker,Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import RoutingMachine from '../RoutingMachine';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BinMap = () => {
  const position=[9.061952, 123.034009];
  const [data, setData] = useState({});
  const [showRoute, setShowRoute] = useState(true);

  useEffect(()=>{
    async function reloadData(){
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
    
    reloadData();
    
  }, []);

  const handleCheckboxChange = (event) => {
    setShowRoute(event.target.checked);
    console.log("value: "+showRoute);
  };

  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>Location and route to Collect Garbage</h1>
        <div className="w-full h-auto flex justify-end">
          <label className="text-gray-600 mb-1 w-fit" htmlFor="isShow">
              Show Route:
            </label>
          <input 
            className="ml-2 mr-5"
            id="isShow"
            type="checkbox"
            checked={showRoute}
            onChange={handleCheckboxChange}
          />
        </div>
        <hr className = "mb-5" />
        <div className="w-full h-auto py-5 border">
          <MapContainer center={position} zoom={17} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data !== null && data.length > 0 ?
            (data.map((device) => (
              <Marker key={device._id} position={device.coordinate}>
                <Popup>{device.deviceID+" - "+device.location}</Popup>
              </Marker>
            ))) : null}

            {data !== null && data.length > 0 && showRoute ? <RoutingMachine waypoints={data.map((m) => m.coordinate)} />: null}
          </MapContainer>
        </div>
      </div>
    );
  }

  return (
    <>
      <BasePage pageTitle="Maps" pageContent={pageContent}/>
    </>
  )
}

export default BinMap