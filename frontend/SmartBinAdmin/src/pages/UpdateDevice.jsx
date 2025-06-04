import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import BasePage from '../components/BasePage';

import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap } from 'react-leaflet';
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

const ClickMarker = ({ setCoordinates, displayText }) => {
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
      <Popup>{displayText}</Popup>
    </Marker>
  ) : null;
};

const UpdateDevice = () => {
  const [data, setData]  = useState({});
  const [coordinates, setCoordinates] = useState(null);
  const navigate= useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (location.state?.deviceInfo) {
      setData(location.state.deviceInfo);
      setCoordinates({ lat: location.state.deviceInfo.coordinate[0], lng: location.state.deviceInfo.coordinate[1] });
    }
  }, [location.state]);

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
    try {
        const response = await axiosInstance.put("/devices/update/"+data._id, data, {withCredentials: true});
        if(!response.data.success){
            toast.error(response.data.message);
        }else{
            toast.success("Device Info updated successfully!");
            navigate("/devices");
        }

    } catch (err) {
      console.error("Login error:", err.message);
    }
  }

const pageContent=()=>{


    return(
      <div className="content-pane">
        <h1 className='content-title'>Update Device Info</h1>
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
              className="w-50 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
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
            <ClickMarker setCoordinates={setCoordinates} displayText={data.deviceID+" - "+data.location}/>
            <Marker position={coordinates}>
              <Popup>{data.deviceID+" - "+data.location}</Popup>
            </Marker>
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

export default UpdateDevice