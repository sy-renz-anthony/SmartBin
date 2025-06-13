import { useState} from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from "react-router-dom";

import BasePage from '../components/BasePage';
import { toast } from 'react-toastify';

const Usages = () => {

  const navigate = useNavigate();

  const handleSubmit= async(e) =>{
    
  }


  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>Search Records</h1>
        <hr />
        
      </div>
    );
  }

  return (
    <>
      <BasePage pageTitle="Usages" pageContent={pageContent}/>
    </>
  )
}

export default Usages