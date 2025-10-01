import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import BasePage from '../components/BasePage';

import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ClickMarker = ({ setCoordinates }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setCoordinates({ lat, lng });
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>
        Lat: {position[0].toFixed(4)} <br /> Lng: {position[1].toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
};

const AddDevice = () => {
  const [data, setData]  = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const navigate= useNavigate();


  useEffect(() => {
    if (coordinates !== null) {
      setData(prevData=>({
          ...prevData,
          "longitude": coordinates["lng"], 
          "latitude": coordinates["lat"]
      }));
    }
  }, [coordinates]);

  const handleSubmit= async(e) =>{
    if(coordinates === null){
      toast.error("Please select the device's location in the map!");
      return;
    }
    try {
        const response = await axiosInstance.post("/devices/register", data, {withCredentials: true});
        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            toast.success("New Device registered successfully!");
            navigate("/devices");
        }

    } catch (err) {
      console.error("Login error:", err.message);
    }
  }

const pageContent=()=>{


    return(
      <div className="content-pane">
        <h1 className='content-title'>Add New Device</h1>
        <hr />
        <form action={handleSubmit} className="p-8 w-full" >
          <div className="personal-info-pane">
            <label className="text-gray-600 mb-1 w-fit" htmlFor="deviceID">
              Device ID#:
            </label>
            <input
              id="deviceID"
              type="text"
              className="w-100 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={data.deviceID}
              onChange={(e) =>{setData(prevData=>({
                ...prevData,
                "deviceID": e.target.value
              }))}}
              required
            />
            <label className="text-gray-600 mb-1 w-fit" htmlFor="location">
              Location Description:
            </label>
            <input
              id="location"
              type="text"
              className="w-100 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={data.location}
              onChange={(e) =>{setData(prevData=>({
                ...prevData,
                "location": e.target.value
              }))}}
              required
            />
            
            <span className="content-label-identifier">Coordinates:</span><span>{coordinates === null ?"Please select a location from the map below to set the location of the Device" : "["+coordinates["lat"]+", "+coordinates["lng"]+"]" }</span>
          </div>
          <div className="flex items-center justify-center w-full h-auto pt-10">
            <button
              type="submit"
              className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 active:bg-blue-900 transition duration-200"
            >
              submit
            </button>
          </div>
        </form>
        <div className="h-fit border">
          <MapContainer
            center={[9.061952, 123.034009]}
            zoom={17}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickMarker setCoordinates={setCoordinates} />
          </MapContainer>
        </div>
        
      </div>
    );
  }

  return (
    <>
      <BasePage pageTitle="Add New Device" pageContent={pageContent}/>
    </>
  )
}

export default AddDevice