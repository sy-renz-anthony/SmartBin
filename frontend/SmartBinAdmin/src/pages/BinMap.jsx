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


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BinMap = () => {
  const position=[9.061952, 123.034009];


  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>Location and route to Collect Garbage</h1>
        <hr />
        <div className="w-full h-auto py-5">
          <MapContainer center={position} zoom={17} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>Welcome to London!</Popup>
            </Marker>
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