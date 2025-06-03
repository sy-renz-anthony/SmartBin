import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';

import BasePage from '../components/BasePage';

const Devices= () => {

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