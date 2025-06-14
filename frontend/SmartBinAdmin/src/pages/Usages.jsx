import { useState} from 'react';
import axiosInstance from '../axiosConfig';
import BasePage from '../components/BasePage';
import { useNavigate } from "react-router-dom";
import UsageTablePanel from '../components/UsageTablePanel';

const Usages = () => {

  const navigate = useNavigate();

  const handleSubmit= async(e) =>{
    
  }


  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>Search Records</h1>
        <hr />
        <UsageTablePanel />
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