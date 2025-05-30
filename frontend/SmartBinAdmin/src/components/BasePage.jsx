import { useEffect, useState } from 'react';

import SideBar from '../components/SideBar';
import Header from '../components/Header';
import LogoutModal from './LogoutConfirmModal';

const BasePage = ({pageTitle, pageContent}) => {
  const [isLogoutModalVisible, setLogoutModalVisibility] = useState(false);

  useEffect(()=>{
    return()=>{ setLogoutModalVisibility(false); }
  }, []);

  const logOutButtonEventHandler=()=>{
    setLogoutModalVisibility(true);
  }

  const closeLogoutModalButtonEventHandler=()=>{
    setLogoutModalVisibility(false);
  }
  return (
    <>
    <div className="flex bg-gray-300">
      <Header pageTitle={pageTitle}/>
      <SideBar logoutButtonEventHandler={logOutButtonEventHandler} />
    </div>
    <LogoutModal isOpen={isLogoutModalVisible} onClose={closeLogoutModalButtonEventHandler}/>
    </>
  )
}

export default BasePage