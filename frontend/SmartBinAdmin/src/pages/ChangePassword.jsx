import { useState, useEffect} from 'react';
import axiosInstance from '../axiosConfig';

import BasePage from '../components/BasePage';

const ChangePassword = () => {
  const [newPassword, setNewPassword]  = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");



  const pageContent=()=>{
    return(
      <div className="content-pane">
        <h1 className='content-title'>Change Password</h1>
        <hr />
        
        
      </div>
    );
  }

  return (
    <>
      <BasePage pageTitle="My Account" pageContent={pageContent}/>
    </>
  )
}

export default ChangePassword