import { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import LogoutModal from './LogoutConfirmModal';
import PasswordConfirmModal from './PasswordConfirmModal';

const BasePage = ({pageTitle, setNextPage, pageContent, passwordModalReroute}) => {
  const [isLogoutModalVisible, setLogoutModalVisibility] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisibility] = useState(false);

  useEffect(()=>{
    return()=>{ 
      setLogoutModalVisibility(false); 
      setPasswordModalVisibility(false);
    }
  }, []);

  const logOutButtonEventHandler=()=>{
    setLogoutModalVisibility(true);
  }

  const closeLogoutModalButtonEventHandler=()=>{
    setLogoutModalVisibility(false);
  }
  const closePasswordModalButtonEventHandler=()=>{
    setPasswordModalVisibility(false);
  }

  const showPasswordModal=(nextRoute)=>{
    if(setNextPage !== null){
      setNextPage("/"+nextRoute);
    }
    setPasswordModalVisibility(true);
  }

  return (
    <div>
    <div className="flex w-max pr-25 min-h-screen bg-gray-600">
      <Header pageTitle={pageTitle}/>
      <SideBar logoutButtonEventHandler={logOutButtonEventHandler} />
      <div className="flex-1 min-h-screen h-full pb-40 w-full">
        { pageContent && pageContent(showPasswordModal) }
      </div>
    </div>
    <LogoutModal isOpen={isLogoutModalVisible} onClose={closeLogoutModalButtonEventHandler}/>
    <PasswordConfirmModal isOpen={isPasswordModalVisible} onClose={closePasswordModalButtonEventHandler} confirmationEventHandler={passwordModalReroute}/>
    </div>
  )
}

export default BasePage